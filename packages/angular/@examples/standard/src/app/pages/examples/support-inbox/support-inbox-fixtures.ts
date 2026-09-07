/**
 * Support inbox example: typed models and deterministic fixtures.
 *
 * Colocated with the owning flow. Dates are fixed UTC ISO strings, IDs are
 * stable, subjects vary in length, and reply text is rendered as text (never
 * arbitrary HTML). No random or current-time defaults anywhere.
 */

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
  /** Fixed UTC ISO timestamp — never derived from the current time. */
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

export const STATUS_FILTERS: readonly StatusFilter[] = ['All', 'Open', 'Pending', 'Resolved'];

export const TICKET_ASSIGNEES: readonly TicketAssignee[] = ['Mara Chen', 'Ravi Shah', 'Unassigned'];

export const ASSIGNEE_FILTERS: readonly AssigneeFilter[] = ['All', ...TICKET_ASSIGNEES];

/** Fixed UTC ISO stamp applied to sent replies — never "now". */
export const REPLY_SENT_AT_ISO = '2026-02-02T10:00:00.000Z';

/** Deterministic reply-failure copy used by the composer retry flow. */
export const REPLY_FAILURE_MESSAGE = 'Reply failed to send. The draft is preserved — retry to send it again.';

export const EXAMPLE_TICKETS: readonly SupportTicket[] = [
  {
    id: 'ticket-1042',
    subject: 'Reset link expired',
    status: 'Open',
    priority: 'Urgent',
    requester: 'Sam Rivera',
    assignee: 'Mara Chen',
    description: 'The password reset link expires before the email arrives. The requester needs a fresh link.',
    updatedAtIso: '2026-01-28T16:05:00.000Z',
    messages: [
      {
        id: 'ticket-1042-message-1',
        author: 'Sam Rivera',
        role: 'requester',
        body: 'Hi, the reset link says it expired even though I clicked it within a minute. Can you send a fresh one?',
        createdAtIso: '2026-01-28T15:48:00.000Z',
      },
      {
        id: 'ticket-1042-message-2',
        author: 'Mara Chen',
        role: 'agent',
        body: 'Thanks for reporting this — I can see the expired token on your account and I am generating a new link now.',
        createdAtIso: '2026-01-28T16:05:00.000Z',
      },
    ],
  },
  {
    id: 'ticket-1041',
    subject: 'Invoice lines show the wrong workspace name after the January plan change',
    status: 'Pending',
    priority: 'Normal',
    requester: 'Jordan Lee',
    assignee: 'Ravi Shah',
    description:
      'Billing shows the previous workspace name on January invoice lines. Waiting on finance to confirm the legal name.',
    updatedAtIso: '2026-01-27T11:40:00.000Z',
    messages: [
      {
        id: 'ticket-1041-message-1',
        author: 'Jordan Lee',
        role: 'requester',
        body: 'Our January invoice lists the old workspace name on every line. Finance needs the corrected name before they approve it.',
        createdAtIso: '2026-01-26T09:12:00.000Z',
      },
      {
        id: 'ticket-1041-message-2',
        author: 'Ravi Shah',
        role: 'agent',
        body: 'Confirmed — the plan change kept the previous display name on open invoice lines. I have asked finance for the legal name to print.',
        createdAtIso: '2026-01-27T11:40:00.000Z',
      },
    ],
  },
  {
    id: 'ticket-1040',
    subject: 'Keyboard navigation in the dialog preview',
    status: 'Open',
    priority: 'Low',
    requester: 'Priya Nair',
    assignee: 'Unassigned',
    description: 'Questions about focus order and live-region announcements in the dialog preview.',
    updatedAtIso: '2026-01-25T09:20:00.000Z',
    messages: [
      {
        id: 'ticket-1040-message-1',
        author: 'Priya Nair',
        role: 'requester',
        // Intentionally contains markup-looking text: the page must render
        // message bodies as text, never as HTML.
        body: 'The dialog preview traps focus, but the live region announces <b>every</b> keystroke — is that intended?',
        createdAtIso: '2026-01-25T09:20:00.000Z',
      },
    ],
  },
  {
    id: 'ticket-1039',
    subject: 'Annual receipt request for the Acme Design System workspace renewal and tax filing records',
    status: 'Resolved',
    priority: 'Low',
    requester: 'Tom Becker',
    assignee: 'Mara Chen',
    description: 'The requester needed a stamped annual receipt for tax filing. Resolved with the receipt attached.',
    updatedAtIso: '2026-01-22T13:55:00.000Z',
    messages: [
      {
        id: 'ticket-1039-message-1',
        author: 'Tom Becker',
        role: 'requester',
        body: 'Could you send a stamped receipt for last year’s renewal? I need it for our tax filing records.',
        createdAtIso: '2026-01-21T10:02:00.000Z',
      },
      {
        id: 'ticket-1039-message-2',
        author: 'Mara Chen',
        role: 'agent',
        body: 'Done — the stamped annual receipt is attached to this thread. Let me know if finance needs anything else.',
        createdAtIso: '2026-01-22T13:55:00.000Z',
      },
    ],
  },
];

/** Local requester fallback: initials derived from the display name. */
export function requesterInitials(name: string): string {
  return name
    .split(/\s+/)
    .map((part) => part.charAt(0))
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

/**
 * Deterministic ticket filtering: status/assignee equality. Pure so specs
 * can assert the exact visible set for any filter combination.
 */
export function filterTickets(
  tickets: readonly SupportTicket[],
  status: StatusFilter,
  assignee: AssigneeFilter,
): SupportTicket[] {
  return tickets.filter(
    (ticket) => (status === 'All' || ticket.status === status) && (assignee === 'All' || ticket.assignee === assignee),
  );
}
