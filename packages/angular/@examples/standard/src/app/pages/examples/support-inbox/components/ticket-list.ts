import { DatePipe } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { HlmAvatar, HlmAvatarFallback } from '@egose/shadcn-theme-ng/avatar';
import { HlmBadge } from '@egose/shadcn-theme-ng/badge';
import { HlmButton } from '@egose/shadcn-theme-ng/button';
import { requesterInitials, statusVariant } from '../support-inbox-fixtures';
import type { SupportTicket } from '../support-inbox-types';

@Component({
  selector: 'app-support-ticket-list',
  imports: [DatePipe, HlmAvatar, HlmAvatarFallback, HlmBadge, HlmButton],
  templateUrl: './ticket-list.html',
  host: { class: 'tw:block tw:min-w-0' },
})
export class SupportTicketListComponent {
  readonly tickets = input.required<readonly SupportTicket[]>();
  readonly selectedId = input<string | null>(null);
  readonly hasFilters = input(false);
  readonly selectTicket = output<string>();
  readonly clearFilters = output<void>();
  protected readonly initials = requesterInitials;
  protected readonly statusVariant = statusVariant;
}
