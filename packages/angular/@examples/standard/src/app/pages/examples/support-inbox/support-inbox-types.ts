import type { WritableSignal } from '@angular/core';
import type { FormControl, FormGroup } from '@angular/forms';

export type TicketStatus = 'Open' | 'Pending' | 'Resolved';
export type TicketPriority = 'Low' | 'Normal' | 'Urgent';
export type TicketAssignee = 'Mara Chen' | 'Ravi Shah' | 'Unassigned';
export type TicketRole = 'requester' | 'agent';
export type StatusFilter = 'All' | TicketStatus;
export type AssigneeFilter = 'All' | TicketAssignee;

export interface TicketMessage {
  readonly id: string;
  readonly author: string;
  readonly role: TicketRole;
  readonly body: string;
  readonly createdAtIso: string;
}

export interface SupportTicket {
  readonly id: string;
  readonly subject: string;
  readonly status: TicketStatus;
  readonly priority: TicketPriority;
  readonly requester: string;
  readonly assignee: TicketAssignee;
  readonly description: string;
  readonly updatedAtIso: string;
  readonly messages: readonly TicketMessage[];
}

/** Owned by the route for the entire session, never by the selected detail view. */
export interface TicketReplyState {
  readonly form: FormGroup<{ body: FormControl<string> }>;
  readonly pending: WritableSignal<boolean>;
  readonly error: WritableSignal<string | null>;
  readonly outcome: WritableSignal<string | null>;
  revision: number;
  operation: number;
}
