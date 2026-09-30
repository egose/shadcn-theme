'use client';

import { useRef, useState } from 'react';

import { simulate, type SimulatedOutcome } from '../_shared/async-simulation';
import type { ExampleState } from '../_shared/example-state-toolbar';
import { createTickets, messageTime } from './fixtures';
import type { InboxAction, TicketFeedback, TicketFilter } from './types';

export function useSupportInboxController() {
  const [tickets, setTickets] = useState(createTickets);
  const [selectedId, setSelectedId] = useState('SUP-101');
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [feedback, setFeedback] = useState<Record<string, TicketFeedback>>({});
  const [pending, setPending] = useState<{ ticketId: string; action: InboxAction } | null>(null);
  const inFlight = useRef(false);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<TicketFilter>('all');
  const [state, setState] = useState<ExampleState>('loaded');
  const [outcome, setOutcome] = useState<SimulatedOutcome>('success');

  const visibleTickets = tickets.filter(
    (ticket) =>
      (filter === 'all' || ticket.status === filter) &&
      `${ticket.id} ${ticket.subject} ${ticket.customer}`.toLowerCase().includes(query.trim().toLowerCase()),
  );
  const selected = tickets.find((ticket) => ticket.id === selectedId)!;

  function editDraft(id: string, value: string) {
    if (pending?.ticketId === id) return;
    setDrafts((current) => ({ ...current, [id]: value }));
  }

  async function perform(action: InboxAction) {
    const ticket = selected;
    const body = (drafts[ticket.id] ?? '').trim();
    if (
      inFlight.current ||
      state !== 'loaded' ||
      ticket.readOnly ||
      (action === 'send' && (ticket.status !== 'open' || !body)) ||
      (action === 'resolve' && ticket.status !== 'open') ||
      (action === 'reopen' && ticket.status !== 'resolved')
    )
      return false;

    inFlight.current = true;
    setPending({ ticketId: ticket.id, action });
    try {
      await simulate({ ticketId: ticket.id, action, ...(action === 'send' ? { body } : {}) }, { outcome });
      setTickets((current) =>
        current.map((row) =>
          row.id !== ticket.id
            ? row
            : action === 'send'
              ? {
                  ...row,
                  messages: [
                    ...row.messages,
                    {
                      id: `${row.id}-message-${row.messages.length + 1}`,
                      author: 'Alex Support',
                      body,
                      sentAt: messageTime(row.messages.length),
                    },
                  ],
                }
              : { ...row, status: action === 'resolve' ? 'resolved' : 'open' },
        ),
      );
      if (action === 'send') setDrafts((current) => ({ ...current, [ticket.id]: '' }));
      setFeedback((current) => ({
        ...current,
        [ticket.id]: {
          kind: 'success',
          text: action === 'send' ? 'Reply sent.' : action === 'resolve' ? 'Ticket resolved.' : 'Ticket reopened.',
        },
      }));
      return true;
    } catch {
      setFeedback((current) => ({
        ...current,
        [ticket.id]: {
          kind: 'error',
          text:
            action === 'send'
              ? 'Reply failed. Your draft is retained; try Send reply again.'
              : `${action === 'resolve' ? 'Resolve' : 'Reopen'} failed. Ticket unchanged; try again.`,
        },
      }));
      return false;
    } finally {
      inFlight.current = false;
      setPending(null);
    }
  }

  return {
    selected,
    selectedId,
    setSelectedId,
    visibleTickets,
    drafts,
    editDraft,
    feedback,
    pending,
    perform,
    query,
    setQuery,
    filter,
    setFilter,
    state,
    setState,
    outcome,
    setOutcome,
  };
}
