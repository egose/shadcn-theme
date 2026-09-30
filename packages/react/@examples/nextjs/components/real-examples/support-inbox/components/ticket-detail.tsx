'use client';

import { useEffect, useId, useRef } from 'react';

import { Button } from '@egose/shadcn-theme/components/ui/button';
import { ScrollArea } from '@egose/shadcn-theme/components/ui/scroll-area';
import { Textarea } from '@egose/shadcn-theme/components/ui/textarea';

import { initials } from '../fixtures';
import type { InboxAction, Ticket, TicketFeedback } from '../types';

type Props = {
  ticket: Ticket;
  draft: string;
  feedback?: TicketFeedback;
  busy: boolean;
  pendingHere: boolean;
  active: boolean;
  outsideFilter: boolean;
  onDraft: (value: string) => void;
  onAction: (action: InboxAction) => Promise<boolean>;
};

export function TicketDetail({
  ticket,
  draft,
  feedback,
  busy,
  pendingHere,
  active,
  outsideFilter,
  onDraft,
  onAction,
}: Props) {
  const id = useId();
  const replyRef = useRef<HTMLTextAreaElement>(null);
  const resultRef = useRef<HTMLParagraphElement>(null);
  const focusOrigin = useRef<{ action: InboxAction; element: HTMLElement } | null>(null);
  const reason =
    ticket.readOnly ??
    (ticket.status === 'resolved'
      ? 'Resolved tickets cannot receive replies. Reopen to continue; any draft is retained.'
      : pendingHere
        ? 'Saving this ticket; its draft is temporarily locked.'
        : busy
          ? 'Another ticket is saving. You may draft here; actions resume when it finishes.'
          : 'Replies are local simulations. Enter a non-empty reply to send.');

  useEffect(() => {
    if (pendingHere || !feedback) return;
    const origin = focusOrigin.current;
    focusOrigin.current = null;
    // After enabled controls commit, recover focus only if it hasn't moved elsewhere.
    if (
      active &&
      origin?.element.isConnected &&
      (document.activeElement === origin.element ||
        document.activeElement === resultRef.current ||
        document.activeElement === document.body)
    ) {
      if (origin.action === 'send') replyRef.current?.focus();
      else resultRef.current?.focus();
    }
  }, [active, feedback, pendingHere]);

  function act(action: InboxAction, origin: HTMLElement) {
    focusOrigin.current = { action, element: origin };
    // Keep focus inside the Sheet on an enabled local target before the action
    // disables its opener. Otherwise the browser's blur/FocusScope recovery can
    // strand focus on the dialog root and look like deliberate navigation.
    if (document.activeElement === origin) resultRef.current?.focus();
    void onAction(action);
  }

  return (
    <section aria-label={`Conversation for ${ticket.id}`} className="flex h-full min-h-0 min-w-0 flex-col">

      <header className="shrink-0 space-y-1 border-b p-3">
                <h3 className="break-words font-semibold">{ticket.subject}</h3>

        <p className="text-muted-foreground text-sm">
          {ticket.id} · {ticket.customer} · {ticket.status}
        </p>

        {outsideFilter && (
          <p className="text-sm">Selected ticket is outside the current filters. Selection and draft are retained.</p>
        )}

      </header>

      <ScrollArea className="min-h-0 flex-1 basis-0" role="region" aria-label="Conversation history" tabIndex={0}>

        <ol className="space-y-4 p-3" aria-label="Messages">

          {ticket.messages.map((message) => (
            <li key={message.id} className="min-w-0 rounded-md border p-3 text-sm">

              <p className="font-medium">
                <span aria-hidden="true" className="mr-2 inline-block rounded bg-muted px-1">
                  {initials(message.author)}
                </span>
                {message.author}
              </p>

              <time className="text-muted-foreground text-xs" dateTime={message.sentAt}>
                {message.sentAt.slice(0, 16).replace('T', ' ')} UTC
              </time>
                            <p className="mt-2 whitespace-pre-wrap [overflow-wrap:anywhere]">{message.body}</p>

            </li>
          ))}

        </ol>

      </ScrollArea>

      <form
        className="shrink-0 space-y-2 border-t p-3"
        onSubmit={(event) => {
          event.preventDefault();
          void act('send', (event.nativeEvent as SubmitEvent).submitter ?? replyRef.current ?? event.currentTarget);
        }}
      >

        <p ref={resultRef} tabIndex={-1} role={feedback?.kind === 'error' ? 'alert' : 'status'} className="text-sm">
                    {pendingHere ? 'Saving ticket…' : feedback?.text}

        </p>

        <label htmlFor={`${id}-reply`} className="text-sm font-medium">
          Reply to {ticket.customer}
        </label>

        <Textarea
          ref={replyRef}
          id={`${id}-reply`}
          value={draft}
          rows={2}
          className="max-h-28 min-h-16 resize-none"
          disabled={Boolean(ticket.readOnly) || ticket.status === 'resolved' || pendingHere}
          aria-describedby={`${id}-reason`}
          onChange={(event) => onDraft(event.target.value)}
        />

        <p id={`${id}-reason`} className="text-muted-foreground text-xs">
          {reason}
        </p>

        <div className="flex flex-wrap gap-2">

          <Button
            type="submit"
            size="sm"
            disabled={busy || Boolean(ticket.readOnly) || ticket.status !== 'open' || !draft.trim()}
            aria-describedby={`${id}-reason`}
          >
            Send reply
          </Button>

          <Button
            type="button"
            size="sm"
            variant="secondary"
            disabled={busy || Boolean(ticket.readOnly)}
            aria-describedby={`${id}-reason`}
            onClick={(event) => void act(ticket.status === 'open' ? 'resolve' : 'reopen', event.currentTarget)}
          >
                        {ticket.status === 'open' ? 'Resolve ticket' : 'Reopen ticket'}

          </Button>

        </div>

      </form>

    </section>
  );
}
