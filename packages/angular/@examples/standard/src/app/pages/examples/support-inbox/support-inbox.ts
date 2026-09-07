import { DatePipe } from '@angular/common';
import { Component, computed, effect, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HlmAvatar, HlmAvatarFallback } from '@egose/shadcn-theme-ng/avatar';
import { HlmBadge, type BadgeVariantType } from '@egose/shadcn-theme-ng/badge';
import { EgBasicAlert } from '@egose/shadcn-theme-ng/basic-alert';
import { HlmButton } from '@egose/shadcn-theme-ng/button';
import { HlmEmptyImports } from '@egose/shadcn-theme-ng/empty';
import { HlmLabel } from '@egose/shadcn-theme-ng/label';
import { HlmNativeSelectImports } from '@egose/shadcn-theme-ng/native-select';
import { HlmSkeleton } from '@egose/shadcn-theme-ng/skeleton';
import { HlmTextarea } from '@egose/shadcn-theme-ng/textarea';
import { DemoHeaderComponent } from '../../../shared/demo-header';
import { EXAMPLE_READ_ONLY_MESSAGE, ExampleViewState } from '../../../shared/real-examples/example-view-state';
import { ExampleStateToolbarComponent } from '../../../shared/real-examples/example-state-toolbar';
import { simulateExampleLoad } from '../../../shared/real-examples/async-simulator';
import {
  ASSIGNEE_FILTERS,
  AssigneeFilter,
  EXAMPLE_TICKETS,
  REPLY_FAILURE_MESSAGE,
  REPLY_SENT_AT_ISO,
  STATUS_FILTERS,
  StatusFilter,
  SupportTicket,
  TicketMessage,
  filterTickets,
  requesterInitials,
} from './support-inbox-fixtures';

/**
 * Support inbox and ticket handling product flow.
 *
 * Responsive ticket triage composed from package primitives only: badges,
 * buttons, avatars, native selects, textarea, skeletons, empty states, and
 * an alert. Desktop shows a list/detail split view; small screens get an
 * accessible list-to-detail-to-list flow (both panes stay in the DOM and CSS
 * decides visibility, so focus can move between them). Status and assignee
 * filtering is deterministic through a pure helper; the selected ticket
 * falls back to the first visible ticket when filters invalidate it.
 * Message bodies and replies render as text (interpolation only — never
 * innerHTML). Loading, empty, error, and loaded previews run through the
 * shared catalog tooling without a backend, while reply failure/retry is an
 * explicit local control with a fixed outcome.
 */
@Component({
  selector: 'app-support-inbox-example',
  imports: [
    DatePipe,
    DemoHeaderComponent,
    ExampleStateToolbarComponent,
    HlmAvatar,
    HlmAvatarFallback,
    HlmBadge,
    HlmButton,
    EgBasicAlert,
    HlmEmptyImports,
    HlmLabel,
    HlmNativeSelectImports,
    HlmSkeleton,
    HlmTextarea,
    ReactiveFormsModule,
  ],
  template: `
    <section class="tw:min-w-0 tw:space-y-6">
      <app-demo-header
        title="Support Inbox"
        description="Triage tickets, reply to requesters, and resolve conversations. The catalog toolbar switches this preview between loading, empty, error, and loaded views without a backend."
      />

      <app-example-state-toolbar
        [(viewState)]="viewState"
        [(readOnly)]="readOnly"
        [(simulateFailure)]="simulateFailure"
      />

      @switch (viewState()) {
        @case ('loading') {
          <div role="status" aria-label="Loading tickets" data-testid="tickets-loading" class="tw:space-y-3">
            @for (slot of loadingSlots; track slot) {
              <div class="tw:flex tw:items-center tw:gap-3 tw:rounded-2xl tw:border tw:border-slate-200 tw:p-4">
                <hlm-skeleton class="tw:h-10 tw:w-10 tw:rounded-full" />
                <div class="tw:flex tw:min-w-0 tw:flex-1 tw:flex-col tw:gap-2">
                  <hlm-skeleton class="tw:h-4 tw:w-full tw:max-w-48" />
                  <hlm-skeleton class="tw:h-4 tw:w-full tw:max-w-64" />
                </div>
              </div>
            }
          </div>
        }
        @case ('empty') {
          <div hlmEmpty data-testid="empty-preview" class="tw:border-slate-200 tw:bg-white">
            <div hlmEmptyHeader>
              <div hlmEmptyMedia variant="icon">📥</div>
              <h3 hlmEmptyTitle>Inbox zero</h3>
              <p hlmEmptyDescription>Every ticket is resolved. New requests appear here.</p>
            </div>
            <div hlmEmptyContent>
              <button hlmButton type="button" (click)="viewState.set('loaded')">Show fixtures</button>
            </div>
          </div>
        }
        @case ('error') {
          <div role="alert" data-testid="tickets-error" class="tw:grid tw:gap-3">
            <eg-basic-alert
              variant="danger"
              title="Tickets failed to load"
              [description]="loadError() ?? 'Tickets failed to load.'"
            />
            <div>
              <button hlmButton type="button" data-testid="retry-tickets" (click)="reload()">Retry</button>
            </div>
          </div>
        }
        @default {
          <form
            [formGroup]="filterForm"
            class="tw:grid tw:min-w-0 tw:gap-3 sm:tw:grid-cols-2"
            aria-label="Ticket filters"
          >
            <div class="tw:grid tw:min-w-0 tw:gap-2">
              <label hlmLabel for="ticket-status">Status</label>
              <hlm-native-select selectId="ticket-status" formControlName="status" data-testid="status-filter">
                @for (status of statusOptions; track status) {
                  <option [value]="status">{{ status === 'All' ? 'All statuses' : status }}</option>
                }
              </hlm-native-select>
            </div>
            <div class="tw:grid tw:min-w-0 tw:gap-2">
              <label hlmLabel for="ticket-assignee">Assignee</label>
              <hlm-native-select selectId="ticket-assignee" formControlName="assignee" data-testid="assignee-filter">
                @for (assignee of assigneeOptions; track assignee) {
                  <option [value]="assignee">{{ assignee === 'All' ? 'All assignees' : assignee }}</option>
                }
              </hlm-native-select>
            </div>
          </form>

          <p role="status" data-testid="ticket-count" class="tw:text-sm tw:text-slate-600">
            {{ countSummary() }}
          </p>

          @if (filteredTickets().length === 0) {
            <div hlmEmpty data-testid="no-ticket-results" class="tw:border-slate-200 tw:bg-white">
              <div hlmEmptyHeader>
                <div hlmEmptyMedia variant="icon">🔎</div>
                <h3 hlmEmptyTitle>No tickets match these filters</h3>
                <p hlmEmptyDescription>
                  No ticket matches the current status and assignee filters. Clear the filters to see the full inbox
                  again.
                </p>
              </div>
              <div hlmEmptyContent>
                <button
                  hlmButton
                  variant="secondary"
                  appearance="outline"
                  type="button"
                  data-testid="clear-ticket-filters"
                  (click)="clearFilters()"
                >
                  Clear filters
                </button>
              </div>
            </div>
          } @else {
            <div class="tw:grid tw:min-w-0 tw:gap-4 md:tw:grid-cols-[minmax(0,300px)_minmax(0,1fr)]">
              <!-- Ticket list. On small screens only one pane is visible; on desktop both are. -->
              <section
                aria-label="Ticket list"
                data-testid="ticket-list-pane"
                [class]="mobileView() === 'detail' ? 'tw:hidden md:tw:block' : 'tw:block tw:min-w-0'"
              >
                <ul class="tw:grid tw:min-w-0 tw:gap-3" aria-label="Support tickets">
                  @for (ticket of filteredTickets(); track ticket.id) {
                    <li [attr.data-testid]="'ticket-' + ticket.id" class="tw:min-w-0">
                      <button
                        type="button"
                        [attr.id]="'ticket-select-' + ticket.id"
                        [attr.data-testid]="'ticket-select-' + ticket.id"
                        [attr.aria-current]="isSelected(ticket) ? 'true' : null"
                        [attr.aria-label]="ticket.subject + ', ' + ticket.status + ', assigned to ' + ticket.assignee"
                        (click)="selectTicket(ticket.id)"
                        class="tw:flex tw:w-full tw:min-w-0 tw:items-center tw:gap-3 tw:rounded-2xl tw:border tw:bg-white tw:p-4 tw:text-left tw:break-words"
                        [class]="
                          isSelected(ticket) ? 'tw:border-slate-900 tw:ring-1 tw:ring-slate-900' : 'tw:border-slate-200'
                        "
                      >
                        <hlm-avatar aria-hidden="true" class="tw:shrink-0">
                          <span hlmAvatarFallback>{{ initials(ticket) }}</span>
                        </hlm-avatar>
                        <span class="tw:min-w-0 tw:flex-1">
                          <span class="tw:block tw:truncate tw:text-sm tw:font-semibold tw:text-slate-900">
                            {{ ticket.subject }}
                          </span>
                          <span class="tw:mt-1 tw:block tw:truncate tw:text-xs tw:text-slate-500">
                            {{ ticket.id }} · {{ ticket.assignee }} ·
                            {{ ticket.updatedAtIso | date: 'mediumDate' : 'UTC' : 'en-US' }}
                          </span>
                          <span class="tw:mt-2 tw:flex tw:flex-wrap tw:gap-1.5">
                            <span hlmBadge [variant]="statusVariant(ticket.status)">{{ ticket.status }}</span>
                            <span hlmBadge variant="secondary">{{ ticket.priority }}</span>
                          </span>
                        </span>
                      </button>
                    </li>
                  }
                </ul>
                @if (hasActiveFilters()) {
                  <div class="tw:mt-3">
                    <button
                      hlmButton
                      variant="secondary"
                      appearance="outline"
                      size="sm"
                      type="button"
                      data-testid="clear-ticket-filters"
                      (click)="clearFilters()"
                    >
                      Clear filters
                    </button>
                  </div>
                }
              </section>

              <!-- Ticket detail. Renders the selected ticket's timeline, reply composer, and actions. -->
              @if (selectedTicket(); as ticket) {
                <article
                  aria-label="Ticket detail"
                  data-testid="ticket-detail-pane"
                  [class]="mobileView() === 'list' ? 'tw:hidden md:tw:block' : 'tw:block tw:min-w-0'"
                  class="tw:rounded-2xl tw:border tw:border-slate-200 tw:bg-white tw:p-4 sm:tw:p-6"
                >
                  <button
                    hlmButton
                    variant="secondary"
                    appearance="outline"
                    size="sm"
                    type="button"
                    data-testid="back-to-tickets"
                    (click)="backToList()"
                    class="tw:mb-4 md:tw:hidden"
                  >
                    ← Back to tickets
                  </button>

                  <h3
                    id="ticket-detail-heading"
                    tabindex="-1"
                    data-testid="ticket-detail-heading"
                    class="tw:min-w-0 tw:break-words tw:text-base tw:font-semibold tw:text-slate-900"
                  >
                    {{ ticket.subject }}
                  </h3>
                  <p
                    class="tw:mt-1 tw:flex tw:min-w-0 tw:flex-wrap tw:items-center tw:gap-1.5 tw:text-xs tw:text-slate-500"
                  >
                    <span class="tw:break-words"
                      >{{ ticket.id }} · {{ ticket.requester }} · Assigned to {{ ticket.assignee }}</span
                    >
                    <span
                      hlmBadge
                      [variant]="statusVariant(ticket.status)"
                      [attr.data-testid]="'detail-status-' + ticket.id"
                    >
                      {{ ticket.status }}
                    </span>
                    <span hlmBadge variant="secondary">{{ ticket.priority }}</span>
                  </p>
                  <p class="tw:mt-2 tw:min-w-0 tw:break-words tw:text-sm tw:text-slate-600">{{ ticket.description }}</p>

                  <h4 class="tw:mt-5 tw:text-sm tw:font-semibold tw:text-slate-900">Conversation</h4>
                  <ol
                    aria-label="Conversation timeline"
                    data-testid="ticket-detail-timeline"
                    class="tw:mt-2 tw:space-y-3"
                  >
                    @for (message of ticket.messages; track message.id) {
                      <li
                        [attr.data-testid]="'message-' + message.id"
                        class="tw:min-w-0 tw:rounded-xl tw:border tw:border-slate-200 tw:bg-slate-50 tw:p-3"
                      >
                        <p
                          class="tw:flex tw:min-w-0 tw:flex-wrap tw:items-baseline tw:gap-x-2 tw:text-xs tw:text-slate-500"
                        >
                          <span class="tw:break-words tw:font-semibold tw:text-slate-700">{{ message.author }}</span>
                          <span>{{ message.role === 'agent' ? 'Support agent' : 'Requester' }}</span>
                          <span class="tw:break-words">
                            {{ message.createdAtIso | date: 'medium' : 'UTC' : 'en-US' }}
                          </span>
                        </p>
                        <p
                          class="tw:mt-1 tw:min-w-0 tw:break-words tw:whitespace-pre-wrap tw:text-sm tw:text-slate-800"
                        >
                          {{ message.body }}
                        </p>
                      </li>
                    }
                  </ol>

                  <form [formGroup]="replyForm" (ngSubmit)="sendReply()" novalidate class="tw:mt-5 tw:grid tw:gap-2">
                    <label hlmLabel for="reply-body">Reply to {{ ticket.requester }}</label>
                    <textarea
                      hlmTextarea
                      id="reply-body"
                      data-testid="reply-body"
                      class="tw:min-h-[120px] tw:w-full"
                      formControlName="body"
                      placeholder="Write a reply as plain text"
                    ></textarea>
                    @if (bodyError(); as error) {
                      <p data-testid="reply-body-error" class="tw:text-sm tw:text-red-600">{{ error }}</p>
                    }
                    @if (ticket.status === 'Resolved') {
                      <p data-testid="reply-resolved-note" class="tw:text-xs tw:text-slate-500">
                        This ticket is resolved. Reopen it to send another reply.
                      </p>
                    }
                    <label
                      class="tw:inline-flex tw:cursor-pointer tw:items-center tw:gap-2 tw:text-sm tw:text-slate-700"
                    >
                      <input
                        type="checkbox"
                        class="tw:h-4 tw:w-4 tw:accent-slate-900"
                        [checked]="simulateReplyFailure()"
                        (change)="simulateReplyFailure.set($any($event.target).checked)"
                        data-testid="simulate-reply-failure"
                      />
                      Simulate reply failure
                    </label>
                    <div class="tw:flex tw:flex-wrap tw:gap-2">
                      <button
                        hlmButton
                        type="submit"
                        size="sm"
                        data-testid="reply-submit"
                        [disabled]="readOnly() || replyPending() || ticket.status === 'Resolved'"
                        [title]="readOnly() ? READ_ONLY_MESSAGE : 'Send reply as plain text'"
                      >
                        {{ replyPending() ? 'Sending…' : 'Send reply' }}
                      </button>
                      @if (ticket.status === 'Resolved') {
                        <button
                          hlmButton
                          variant="secondary"
                          type="button"
                          size="sm"
                          data-testid="ticket-reopen"
                          [disabled]="readOnly()"
                          [title]="readOnly() ? READ_ONLY_MESSAGE : 'Reopen ' + ticket.id"
                          (click)="reopenSelected()"
                        >
                          Reopen ticket
                        </button>
                      } @else {
                        <button
                          hlmButton
                          variant="secondary"
                          type="button"
                          size="sm"
                          data-testid="ticket-resolve"
                          [disabled]="readOnly()"
                          [title]="readOnly() ? READ_ONLY_MESSAGE : 'Resolve ' + ticket.id"
                          (click)="resolveSelected()"
                        >
                          Resolve ticket
                        </button>
                      }
                    </div>
                  </form>

                  @if (replyError(); as failure) {
                    <div role="alert" data-testid="reply-error" class="tw:mt-3 tw:grid tw:gap-2">
                      <eg-basic-alert variant="danger" title="Reply failed to send" [description]="failure" />
                      <div>
                        <button
                          hlmButton
                          variant="secondary"
                          appearance="outline"
                          size="sm"
                          type="button"
                          data-testid="reply-retry"
                          [disabled]="readOnly()"
                          (click)="retryReply()"
                        >
                          Retry reply
                        </button>
                      </div>
                    </div>
                  }
                </article>
              }
            </div>

            @if (outcome(); as result) {
              <p
                role="status"
                data-testid="inbox-outcome"
                class="tw:min-w-0 tw:break-words tw:text-sm tw:text-slate-700"
              >
                {{ result }}
              </p>
            }
            @if (readOnly()) {
              <p class="tw:text-xs tw:text-slate-500">{{ READ_ONLY_MESSAGE }}</p>
            }
          }
        }
      }

      <div class="tw:flex tw:flex-wrap tw:gap-2">
        <button hlmButton variant="secondary" type="button" (click)="reload()">Simulate reload</button>
      </div>
    </section>
  `,
})
export class SupportInboxExamplePage {
  private readonly _fb = inject(FormBuilder);

  protected readonly viewState = signal<ExampleViewState>('loaded');
  protected readonly readOnly = signal(false);
  protected readonly simulateFailure = signal(false);
  protected readonly simulateReplyFailure = signal(false);
  protected readonly tickets = signal<SupportTicket[]>(
    EXAMPLE_TICKETS.map((ticket) => ({ ...ticket, messages: [...ticket.messages] })),
  );
  protected readonly selectedId = signal<string | null>('ticket-1042');
  protected readonly mobileView = signal<'list' | 'detail'>('list');
  protected readonly outcome = signal<string | null>(null);
  protected readonly loadError = signal<string | null>(null);
  protected readonly replyPending = signal(false);
  protected readonly replyError = signal<string | null>(null);

  protected readonly filterForm = this._fb.nonNullable.group({
    status: this._fb.nonNullable.control<StatusFilter>('All'),
    assignee: this._fb.nonNullable.control<AssigneeFilter>('All'),
  });
  private readonly _rawFilters = toSignal(this.filterForm.valueChanges, {
    initialValue: this.filterForm.getRawValue(),
  });
  private readonly _filters = computed(() => ({
    status: this._rawFilters().status ?? ('All' as StatusFilter),
    assignee: this._rawFilters().assignee ?? ('All' as AssigneeFilter),
  }));

  protected readonly replyForm = this._fb.nonNullable.group({
    body: this._fb.nonNullable.control('', {
      validators: [Validators.required, Validators.minLength(2), Validators.maxLength(2000)],
    }),
  });

  constructor() {
    // The composer pairs with a reactive form control, so the locked state
    // (read-only preview or resolved ticket) is applied through the control
    // itself rather than a template disabled binding.
    effect(() => {
      const locked = this.readOnly() || this.selectedTicket()?.status === 'Resolved';
      const control = this.replyForm.controls.body;
      if (locked && control.enabled) {
        control.disable({ emitEvent: false });
      } else if (!locked && control.disabled) {
        control.enable({ emitEvent: false });
      }
    });
  }

  protected readonly loadingSlots = [0, 1, 2];
  protected readonly statusOptions = STATUS_FILTERS;
  protected readonly assigneeOptions = ASSIGNEE_FILTERS;
  protected readonly READ_ONLY_MESSAGE = EXAMPLE_READ_ONLY_MESSAGE;

  protected readonly filteredTickets = computed(() => {
    const filters = this._filters();
    return filterTickets(this.tickets(), filters.status, filters.assignee);
  });

  protected readonly hasActiveFilters = computed(() => {
    const filters = this._filters();
    return filters.status !== 'All' || filters.assignee !== 'All';
  });

  /** The selected ticket, falling back to the first visible ticket when filters invalidate it. */
  protected readonly selectedTicket = computed(() => {
    const filtered = this.filteredTickets();
    return filtered.find((ticket) => ticket.id === this.selectedId()) ?? filtered[0] ?? null;
  });

  protected readonly countSummary = computed(() => {
    const total = this.tickets().length;
    const visible = this.filteredTickets().length;
    return this.hasActiveFilters()
      ? `Showing ${visible} of ${total} tickets · Status ${this._filters().status} · Assignee ${this._filters().assignee}.`
      : `Showing ${visible} of ${total} tickets.`;
  });

  protected initials(ticket: SupportTicket): string {
    return requesterInitials(ticket.requester);
  }

  protected isSelected(ticket: SupportTicket): boolean {
    return this.selectedTicket()?.id === ticket.id;
  }

  protected statusVariant(status: SupportTicket['status']): BadgeVariantType {
    switch (status) {
      case 'Open':
        return 'info';
      case 'Pending':
        return 'warning';
      case 'Resolved':
        return 'success';
    }
  }

  protected bodyError(): string | null {
    const control = this.replyForm.controls.body;
    if (!control.touched || control.valid) return null;
    if (control.hasError('required')) return 'Write a reply before sending';
    if (control.hasError('minlength')) return 'Use at least 2 characters for the reply';
    if (control.hasError('maxlength')) return 'Keep the reply under 2000 characters';
    return 'Enter a valid reply';
  }

  protected selectTicket(id: string): void {
    this.selectedId.set(id);
    this.outcome.set(null);
    this.replyError.set(null);
    this.mobileView.set('detail');
    this.focusAfterRender('ticket-detail-heading');
  }

  protected backToList(): void {
    this.mobileView.set('list');
    const id = this.selectedTicket()?.id ?? this.selectedId();
    if (id) {
      this.focusAfterRender(`ticket-select-${id}`);
    }
  }

  protected clearFilters(): void {
    this.filterForm.setValue({ status: 'All', assignee: 'All' });
  }

  protected async sendReply(): Promise<void> {
    if (this.readOnly() || this.replyPending()) {
      return;
    }
    this.replyForm.markAllAsTouched();
    if (this.replyForm.invalid) {
      return;
    }
    const ticket = this.selectedTicket();
    if (!ticket || ticket.status === 'Resolved') {
      return;
    }
    const body = (this.replyForm.controls.body.value ?? '').trim();
    this.replyPending.set(true);
    this.replyError.set(null);
    try {
      await simulateExampleLoad(null, {
        shouldFail: this.simulateReplyFailure(),
        latencyMs: 10,
        errorMessage: REPLY_FAILURE_MESSAGE,
      });
      const message: TicketMessage = {
        id: `${ticket.id}-reply-${ticket.messages.length + 1}`,
        author: 'Support Agent',
        role: 'agent',
        body,
        createdAtIso: REPLY_SENT_AT_ISO,
      };
      this.tickets.update((list) =>
        list.map((candidate) =>
          candidate.id === ticket.id
            ? { ...candidate, messages: [...candidate.messages, message], updatedAtIso: REPLY_SENT_AT_ISO }
            : candidate,
        ),
      );
      this.replyForm.reset({ body: '' });
      this.outcome.set(`Reply sent to ${ticket.requester} as plain text.`);
      document.getElementById('reply-body')?.focus();
    } catch (error) {
      this.replyError.set(error instanceof Error ? error.message : REPLY_FAILURE_MESSAGE);
    } finally {
      this.replyPending.set(false);
    }
  }

  protected retryReply(): void {
    void this.sendReply();
  }

  protected resolveSelected(): void {
    const ticket = this.selectedTicket();
    if (!ticket || this.readOnly() || ticket.status === 'Resolved') {
      return;
    }
    this.tickets.update((list) =>
      list.map((candidate) => (candidate.id === ticket.id ? { ...candidate, status: 'Resolved' as const } : candidate)),
    );
    this.outcome.set(`${ticket.id} resolved. The requester sees the reply as plain text.`);
    this.focusAfterRender('ticket-detail-heading');
  }

  protected reopenSelected(): void {
    const ticket = this.selectedTicket();
    if (!ticket || this.readOnly() || ticket.status !== 'Resolved') {
      return;
    }
    this.tickets.update((list) =>
      list.map((candidate) => (candidate.id === ticket.id ? { ...candidate, status: 'Open' as const } : candidate)),
    );
    this.outcome.set(`${ticket.id} reopened and assigned back to the queue.`);
    this.focusAfterRender('ticket-detail-heading');
  }

  protected async reload(): Promise<void> {
    this.viewState.set('loading');
    this.loadError.set(null);
    try {
      const tickets = await simulateExampleLoad(EXAMPLE_TICKETS, { shouldFail: this.simulateFailure() });
      this.tickets.set(tickets.map((ticket) => ({ ...ticket, messages: [...ticket.messages] })));
      this.outcome.set(null);
      this.replyError.set(null);
      this.replyForm.reset({ body: '' });
      if (!tickets.some((ticket) => ticket.id === this.selectedId())) {
        this.selectedId.set(tickets[0]?.id ?? null);
      }
      this.viewState.set('loaded');
    } catch (error) {
      this.loadError.set(error instanceof Error ? error.message : 'Tickets failed to load.');
      this.viewState.set('error');
    }
  }

  private focusAfterRender(elementId: string): void {
    setTimeout(() => document.getElementById(elementId)?.focus(), 0);
  }
}
