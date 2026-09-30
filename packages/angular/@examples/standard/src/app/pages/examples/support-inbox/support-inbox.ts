import { Component, DestroyRef, ElementRef, computed, effect, inject, signal, untracked } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, type AbstractControl, type ValidationErrors } from '@angular/forms';
import { EgBasicAlert } from '@egose/shadcn-theme-ng/basic-alert';
import { HlmButton } from '@egose/shadcn-theme-ng/button';
import { HlmEmptyImports } from '@egose/shadcn-theme-ng/empty';
import { HlmInput } from '@egose/shadcn-theme-ng/input';
import { HlmLabel } from '@egose/shadcn-theme-ng/label';
import { HlmNativeSelectImports } from '@egose/shadcn-theme-ng/native-select';
import { HlmSkeleton } from '@egose/shadcn-theme-ng/skeleton';
import { DemoHeaderComponent } from '../../../shared/demo-header';
import { EXAMPLE_READ_ONLY_MESSAGE, ExampleViewState } from '../../../shared/real-examples/example-view-state';
import { ExampleStateToolbarComponent } from '../../../shared/real-examples/example-state-toolbar';
import { simulateExampleLoad } from '../../../shared/real-examples/async-simulator';
import { SupportTicketListComponent } from './components/ticket-list';
import { SupportTicketDetailComponent } from './components/ticket-detail';
import {
  ASSIGNEE_FILTERS,
  EXAMPLE_TICKETS,
  REPLY_FAILURE_MESSAGE,
  REPLY_SENT_AT_ISO,
  STATUS_FILTERS,
  TICKET_ASSIGNEES,
  filterTickets,
  freshTickets,
} from './support-inbox-fixtures';
import type {
  AssigneeFilter,
  StatusFilter,
  TicketAssignee,
  TicketReplyState,
  TicketStatus,
} from './support-inbox-types';

function replyValidation(value: string): ValidationErrors | null {
  const length = value.trim().length;
  return length === 0
    ? { required: true }
    : length < 2
      ? { minlength: true }
      : length > 2000
        ? { maxlength: true }
        : null;
}

/** Route owns ticket identity, drafts and session policy; local views compose public primitives. */
@Component({
  selector: 'app-support-inbox-example',
  imports: [
    DemoHeaderComponent,
    ExampleStateToolbarComponent,
    HlmButton,
    EgBasicAlert,
    HlmEmptyImports,
    HlmInput,
    HlmLabel,
    HlmNativeSelectImports,
    HlmSkeleton,
    ReactiveFormsModule,
    SupportTicketListComponent,
    SupportTicketDetailComponent,
  ],
  templateUrl: './support-inbox.html',
})
export class SupportInboxExamplePage {
  private readonly _fb = inject(FormBuilder);
  private readonly _destroyRef = inject(DestroyRef);
  private readonly _host = inject<ElementRef<HTMLElement>>(ElementRef);
  private _loadOperation = 0;
  private _focusOperation = 0;
  private readonly _replies = new Map<string, TicketReplyState>();

  protected readonly viewState = signal<ExampleViewState>('loaded');
  protected readonly readOnly = signal(false);
  protected readonly simulateFailure = signal(false);
  protected readonly simulateReplyFailure = signal(false);
  protected readonly tickets = signal(freshTickets());
  protected readonly selectedId = signal<string | null>('ticket-1042');
  protected readonly mobileView = signal<'list' | 'detail'>('list');
  protected readonly outcome = signal<string | null>(null);
  protected readonly loadError = signal<string | null>(null);
  protected readonly filterForm = this._fb.nonNullable.group({
    status: this._fb.nonNullable.control<StatusFilter>('All'),
    assignee: this._fb.nonNullable.control<AssigneeFilter>('All'),
    search: '',
  });
  private readonly _filters = toSignal(this.filterForm.valueChanges, { initialValue: this.filterForm.getRawValue() });
  protected readonly filteredTickets = computed(() => {
    const filters = this._filters();
    return filterTickets(this.tickets(), filters.status ?? 'All', filters.assignee ?? 'All', filters.search);
  });
  protected readonly hasActiveFilters = computed(() => {
    const filters = this._filters();
    return filters.status !== 'All' || filters.assignee !== 'All' || !!filters.search?.trim();
  });
  protected readonly selectedTicket = computed(() => {
    const filtered = this.filteredTickets();
    return filtered.find((ticket) => ticket.id === this.selectedId()) ?? filtered[0] ?? null;
  });
  protected readonly selectedReply = computed(() => this._replies.get(this.selectedTicket()?.id ?? '') ?? null);
  protected readonly countSummary = computed(() => {
    const summary = `Showing ${this.filteredTickets().length} of ${this.tickets().length} tickets`;
    const filters = this._filters();
    return this.hasActiveFilters()
      ? `${summary} · Status ${filters.status} · Assignee ${filters.assignee}${filters.search?.trim() ? ' · Search ' + filters.search.trim() : ''}.`
      : `${summary}.`;
  });
  protected readonly loadingSlots = [0, 1, 2];
  protected readonly statusOptions = STATUS_FILTERS;
  protected readonly assigneeOptions = ASSIGNEE_FILTERS;
  protected readonly READ_ONLY_MESSAGE = EXAMPLE_READ_ONLY_MESSAGE;

  constructor() {
    for (const ticket of EXAMPLE_TICKETS) {
      const reply: TicketReplyState = {
        form: this._fb.nonNullable.group({
          body: ['', (control: AbstractControl<string>) => replyValidation(control.value)],
        }),
        pending: signal(false),
        error: signal(null),
        outcome: signal(null),
        revision: 0,
        operation: 0,
      };
      reply.form.valueChanges.pipe(takeUntilDestroyed(this._destroyRef)).subscribe(() => {
        reply.revision++;
      });
      this._replies.set(ticket.id, reply);
    }
    effect(() => {
      const locked = this.readOnly();
      const preview = this.viewState();
      const tickets = this.tickets();
      untracked(() => {
        if (locked || preview !== 'loaded') this.cancelReplies();
        for (const ticket of tickets) {
          const body = this._replies.get(ticket.id)!.form.controls.body;
          if (locked || ticket.status === 'Resolved') body.disable({ emitEvent: false });
          else body.enable({ emitEvent: false });
        }
      });
    });
    effect(() => {
      const id = this.selectedTicket()?.id ?? null;
      // Adopt filter fallback rather than unexpectedly jumping back when filters clear.
      if (id !== this.selectedId()) this.selectedId.set(id);
    });
    this._destroyRef.onDestroy(() => {
      this._loadOperation++;
      this._focusOperation++;
      this.cancelReplies();
    });
  }

  protected setReadOnly(value: boolean): void {
    if (value) this.cancelReplies();
    this.readOnly.set(value);
  }

  protected setPreview(value: ExampleViewState): void {
    this._loadOperation++;
    this._focusOperation++;
    this.cancelReplies();
    this.viewState.set(value);
  }

  private cancelReplies(): void {
    for (const reply of this._replies.values()) {
      reply.operation++;
      if (reply.pending()) reply.outcome.set('Send cancelled. Your draft is preserved.');
      reply.pending.set(false);
    }
  }

  protected selectTicket(id: string): void {
    this.selectedId.set(id);
    this.outcome.set(null);
    this.mobileView.set('detail');
    this.focusAfterRender('ticket-detail-heading');
  }

  protected backToList(): void {
    this.mobileView.set('list');
    this.focusAfterRender(`ticket-select-${this.selectedTicket()?.id}`);
  }

  protected clearFilters(): void {
    this.filterForm.setValue({ status: 'All', assignee: 'All', search: '' });
    this.mobileView.set('list');
    this.focusAfterRender(`ticket-select-${this.selectedTicket()?.id}`);
  }

  protected async sendReply(): Promise<void> {
    const ticket = this.selectedTicket();
    const reply = this.selectedReply();
    if (!ticket || !reply || !this.canMutate() || reply.pending() || ticket.status === 'Resolved') return;
    reply.form.markAllAsTouched();
    const body = reply.form.controls.body.value.trim();
    // Also validate the captured value: a permission transition may precede
    // the effect that re-enables a previously disabled reactive control.
    if (replyValidation(body)) return;
    const revision = reply.revision;
    const operation = ++reply.operation;
    const canCommit = () =>
      reply.operation === operation &&
      this.canMutate() &&
      this.tickets().some((candidate) => candidate.id === ticket.id && candidate.status !== 'Resolved');
    reply.pending.set(true);
    reply.error.set(null);
    reply.outcome.set(null);
    this.outcome.set(null);
    try {
      await simulateExampleLoad(null, {
        shouldFail: this.simulateReplyFailure(),
        latencyMs: 10,
        errorMessage: REPLY_FAILURE_MESSAGE,
      });
      if (!canCommit()) return;
      this.tickets.update((list) =>
        list.map((candidate) =>
          candidate.id === ticket.id
            ? {
                ...candidate,
                messages: [
                  ...candidate.messages,
                  {
                    id: `${ticket.id}-reply-${candidate.messages.length + 1}`,
                    author: 'Support Agent',
                    role: 'agent' as const,
                    body,
                    createdAtIso: REPLY_SENT_AT_ISO,
                  },
                ],
                updatedAtIso: REPLY_SENT_AT_ISO,
              }
            : candidate,
        ),
      );
      if (reply.revision === revision) {
        reply.form.reset({ body: '' });
        if (
          this.selectedTicket()?.id === ticket.id &&
          this.mobileView() === 'detail' &&
          this._host.nativeElement.querySelector('[data-testid="ticket-detail-pane"]')?.contains(document.activeElement)
        ) {
          this.focusAfterRender('reply-body');
        }
      }
      reply.outcome.set(`Reply sent to ${ticket.requester} as plain text.`);
    } catch (error) {
      if (canCommit()) reply.error.set(error instanceof Error ? error.message : REPLY_FAILURE_MESSAGE);
    } finally {
      if (reply.operation === operation) reply.pending.set(false);
    }
  }

  protected resolveSelected(): void {
    this.setStatus('Resolved');
  }
  protected reopenSelected(): void {
    this.setStatus('Open');
  }

  private setStatus(status: TicketStatus): void {
    const ticket = this.selectedTicket();
    if (!ticket || !this.canMutate() || this.selectedReply()?.pending() || ticket.status === status) return;
    this.tickets.update((list) =>
      list.map((candidate) => (candidate.id === ticket.id ? { ...candidate, status } : candidate)),
    );
    this.outcome.set(
      status === 'Resolved'
        ? `${ticket.id} resolved. The requester sees the reply as plain text.`
        : `${ticket.id} reopened. Assigned to ${ticket.assignee}.`,
    );
    this.focusAfterMutation();
  }

  protected assignSelected(assignee: TicketAssignee): void {
    const ticket = this.selectedTicket();
    if (!ticket || !this.canMutate() || !TICKET_ASSIGNEES.includes(assignee) || ticket.assignee === assignee) return;
    this.tickets.update((list) =>
      list.map((candidate) => (candidate.id === ticket.id ? { ...candidate, assignee } : candidate)),
    );
    this.outcome.set(`${ticket.id} assigned to ${assignee}.`);
    this.focusAfterMutation();
  }

  private focusAfterMutation(): void {
    if (this.selectedTicket()) {
      this.mobileView.set('detail');
      this.focusAfterRender('ticket-detail-heading');
    } else {
      this.mobileView.set('list');
      this.focusAfterRender('no-ticket-results-heading');
    }
  }

  private canMutate(): boolean {
    return !this._destroyRef.destroyed && !this.readOnly() && this.viewState() === 'loaded';
  }

  protected reset(): void {
    this._loadOperation++;
    this._focusOperation++;
    this.cancelReplies();
    for (const reply of this._replies.values()) {
      reply.form.reset({ body: '' });
      reply.error.set(null);
      reply.outcome.set(null);
    }
    this.tickets.set(freshTickets());
    this.filterForm.reset({ status: 'All', assignee: 'All', search: '' });
    this.selectedId.set('ticket-1042');
    this.mobileView.set('list');
    this.outcome.set(null);
    this.loadError.set(null);
    this.viewState.set('loaded');
  }

  protected async reload(): Promise<void> {
    this.reset();
    const operation = ++this._loadOperation;
    this.viewState.set('loading');
    try {
      await simulateExampleLoad(null, { shouldFail: this.simulateFailure() });
      if (this._destroyRef.destroyed || operation !== this._loadOperation) return;
      this.viewState.set('loaded');
    } catch (error) {
      if (this._destroyRef.destroyed || operation !== this._loadOperation) return;
      this.loadError.set(error instanceof Error ? error.message : 'Tickets failed to load.');
      this.viewState.set('error');
    }
  }

  private focusAfterRender(elementId: string): void {
    const operation = ++this._focusOperation;
    const ticketId = this.selectedTicket()?.id;
    setTimeout(() => {
      if (
        !this._destroyRef.destroyed &&
        operation === this._focusOperation &&
        this.viewState() === 'loaded' &&
        ticketId === this.selectedTicket()?.id
      )
        this._host.nativeElement.querySelector<HTMLElement>(`#${elementId}`)?.focus();
    }, 0);
  }
}
