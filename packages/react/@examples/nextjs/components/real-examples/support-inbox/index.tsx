'use client';

import { useRef, useState, useSyncExternalStore } from 'react';

import { Button } from '@egose/shadcn-theme/components/ui/button';
import { Input } from '@egose/shadcn-theme/components/ui/input';
import { Item, ItemContent, ItemDescription, ItemGroup } from '@egose/shadcn-theme/components/ui/item';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@egose/shadcn-theme/components/ui/resizable';
import { ScrollArea } from '@egose/shadcn-theme/components/ui/scroll-area';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@egose/shadcn-theme/components/ui/sheet';

import { ExampleStateToolbar } from '../_shared/example-state-toolbar';
import { OutcomePicker } from '../_shared/outcome-picker';
import { TicketDetail } from './components/ticket-detail';
import { initials } from './fixtures';
import type { TicketFilter } from './types';
import { useSupportInboxController } from './use-support-inbox-controller';

const desktopQuery = '(min-width: 1024px)';
function subscribeLayout(callback: () => void) {
  const media = window.matchMedia(desktopQuery);
  media.addEventListener('change', callback);
  return () => media.removeEventListener('change', callback);
}
const desktopSnapshot = () => window.matchMedia(desktopQuery).matches;
const serverSnapshot = () => false;

export default function SupportInboxExample() {
  const desktop = useSyncExternalStore(subscribeLayout, desktopSnapshot, serverSnapshot);
  const [mobileOpen, setMobileOpen] = useState(false);
  const opener = useRef<HTMLButtonElement | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const {
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
  } = useSupportInboxController();

  const outcomePicker = (
    <OutcomePicker label="Inbox outcome (catalog only)" value={outcome} onValueChange={setOutcome} />
  );
  const detail = (
    <TicketDetail
      key={selected.id}
      ticket={selected}
      draft={drafts[selected.id] ?? ''}
      active={desktop || mobileOpen}
      feedback={feedback[selected.id]}
      busy={Boolean(pending)}
      pendingHere={pending?.ticketId === selected.id}
      outsideFilter={!visibleTickets.some((ticket) => ticket.id === selected.id)}
      onDraft={(value) => editDraft(selected.id, value)}
      onAction={perform}
    />
  );

  const list = (
    <ScrollArea className="h-full min-h-0 min-w-0" role="region" aria-label="Ticket list" tabIndex={0}>

      {visibleTickets.length === 0 ? (
        <div className="space-y-2 p-4">
          <p>No tickets match the current filters.</p>
          <Button
            variant="secondary"
            onClick={() => {
              setQuery('');
              setFilter('all');
              searchRef.current?.focus();
            }}
          >
            Clear filters
          </Button>
        </div>
      ) : (
        <ItemGroup aria-label="Tickets" className="gap-2 p-2">

          {visibleTickets.map((ticket) => (
            <Item key={ticket.id} role="listitem" variant={selectedId === ticket.id ? 'muted' : 'outline'}>

              <ItemContent className="min-w-0">

                <button
                  type="button"
                  className="rounded text-left font-medium [overflow-wrap:anywhere] focus-visible:outline-2"
                  aria-label={`Open ${ticket.id}: ${ticket.subject}`}
                  aria-current={selectedId === ticket.id ? 'true' : undefined}
                  onClick={(event) => {
                    opener.current = event.currentTarget;
                    setSelectedId(ticket.id);
                    if (!desktop) setMobileOpen(true);
                  }}
                >
                                    {ticket.subject}

                </button>

                <ItemDescription>
                  <span aria-hidden="true">{initials(ticket.customer)} · </span>
                  {ticket.customer}
                </ItemDescription>

                <p className="text-muted-foreground text-xs">
                  {ticket.id} · {ticket.status}
                  {ticket.readOnly ? ' · Read-only' : ''}
                  {drafts[ticket.id] ? ' · Draft' : ''}
                </p>

              </ItemContent>

            </Item>
          ))}

        </ItemGroup>
      )}

    </ScrollArea>
  );

  return (
    <div className="min-w-0 space-y-4">

      <ExampleStateToolbar
        value={state}
        onValueChange={(next) => {
          setMobileOpen(false);
          setState(next);
        }}
      />
            {!(mobileOpen && !desktop && state === 'loaded') && outcomePicker}

      <p className="text-muted-foreground text-xs">
        Catalog previews preserve tickets, drafts and pending work. Loaded returns to this session; reload resets fixtures.
      </p>

      <h2 ref={headingRef} tabIndex={-1} className="text-xl font-semibold">
        Support inbox
      </h2>

      {pending && (
        <p role="status" className="text-sm">
          Saving {pending.ticketId} ({pending.action})… Navigation is available; other actions wait.
        </p>
      )}

      {state === 'loading' ? (
        <p role="status">Loading tickets…</p>
      ) : state === 'error' ? (
        <div role="alert" className="space-y-2">
          <p>Tickets could not be loaded.</p>
          <Button onClick={() => setState('loaded')}>Retry</Button>
        </div>
      ) : state === 'empty' ? (
        <div className="space-y-2">
          <p>No tickets in this preview. Your session is retained.</p>
          <Button onClick={() => setState('loaded')}>Return to inbox</Button>
        </div>
      ) : (
        <>

          <div className="flex flex-wrap items-end gap-3">

            <label className="min-w-0 flex-1 text-sm">
              Search tickets
              <Input
                ref={searchRef}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Subject, customer or ticket ID"
              />

            </label>

            <label className="text-sm">
              Ticket status
              <select
                className="bg-background ml-2 rounded-md border p-2"
                value={filter}
                onChange={(event) => setFilter(event.target.value as TicketFilter)}
              >
                                    <option value="all">All</option>
                <option value="open">Open</option>
                <option value="resolved">Resolved</option>

              </select>

            </label>

          </div>

          <p role="status" className="text-muted-foreground text-sm">
            {visibleTickets.length} tickets match. Search filters the list; the selected conversation stays available.
          </p>

          <div className="h-[min(44rem,75dvh)] min-h-[32rem] min-w-0 overflow-hidden rounded-md border">

            {desktop ? (
              <ResizablePanelGroup orientation="horizontal">

                <ResizablePanel id="support-list" defaultSize="35%" minSize="25%" maxSize="50%">
                  {list}
                </ResizablePanel>

                <ResizableHandle withHandle aria-label="Resize ticket list" />

                <ResizablePanel id="support-detail" defaultSize="65%" minSize="50%">
                  {detail}
                </ResizablePanel>

              </ResizablePanelGroup>
            ) : (
              list
            )}

          </div>

          <Sheet open={!desktop && mobileOpen} onOpenChange={setMobileOpen}>

            <SheetContent
              className="data-[side=right]:w-full data-[side=right]:sm:max-w-xl gap-0 overflow-y-auto"
              onCloseAutoFocus={(event) => {
                event.preventDefault();
                if (!desktop && opener.current?.isConnected) opener.current.focus();
                else if (searchRef.current) searchRef.current.focus();
                else headingRef.current?.focus();
              }}
            >

              <SheetHeader className="shrink-0 pr-14">
                                    <SheetTitle>Ticket {selected.id}</SheetTitle>

                <SheetDescription>
                  Conversation and local reply draft. Closing keeps pending work and drafts.
                </SheetDescription>

              </SheetHeader>
                                <div className="shrink-0 px-3 pb-2">{outcomePicker}</div>
                                <div className="min-h-[28rem] flex-1">{detail}</div>

            </SheetContent>

          </Sheet>

        </>
      )}

    </div>
  );
}
