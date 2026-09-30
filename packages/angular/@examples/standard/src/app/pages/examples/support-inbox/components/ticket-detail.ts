import { DatePipe } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HlmBadge } from '@egose/shadcn-theme-ng/badge';
import { HlmButton } from '@egose/shadcn-theme-ng/button';
import { HlmLabel } from '@egose/shadcn-theme-ng/label';
import { HlmNativeSelectImports } from '@egose/shadcn-theme-ng/native-select';
import { TICKET_ASSIGNEES, statusVariant } from '../support-inbox-fixtures';
import type { SupportTicket, TicketAssignee, TicketReplyState } from '../support-inbox-types';
import { SupportTicketComposerComponent } from './ticket-composer';

@Component({
  selector: 'app-support-ticket-detail',
  imports: [
    DatePipe,
    FormsModule,
    HlmBadge,
    HlmButton,
    HlmLabel,
    HlmNativeSelectImports,
    SupportTicketComposerComponent,
  ],
  templateUrl: './ticket-detail.html',
  host: { class: 'tw:block tw:min-w-0' },
})
export class SupportTicketDetailComponent {
  readonly ticket = input.required<SupportTicket>();
  readonly reply = input.required<TicketReplyState>();
  readonly readOnly = input(false);
  readonly simulateFailure = input(false);
  readonly failureChange = output<boolean>();
  readonly back = output<void>();
  readonly send = output<void>();
  readonly resolve = output<void>();
  readonly reopen = output<void>();
  readonly assign = output<TicketAssignee>();
  protected readonly assignees = TICKET_ASSIGNEES;
  protected readonly statusVariant = statusVariant;
}
