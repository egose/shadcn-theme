import type { Ticket } from './types';

const requests = [
  ['Export missing columns', 'Maya Chen'],
  ['Invite link expired', 'Luis Ortega'],
  ['Invoice address correction', 'Amina Yusuf'],
  ['Keyboard navigation in reports', 'Noah Williams'],
  ['Restoring a saved dashboard', 'Sofia Rossi'],
  ['Weekly digest preferences', 'Oliver Kim'],
  ['Workspace name with a very long customer reference that should wrap', 'Isabella García'],
  ['Import preview question', 'Ethan Patel'],
  ['Historical workspace request', 'Zoe Martin'],
  ['Report totals explained', 'Leo Andersson'],
] as const;

// Fixed UTC event times, including simulated replies; never the wall clock.
export function messageTime(sequence: number) {
  return new Date(Date.UTC(2026, 8, 24, 9, sequence)).toISOString();
}

export function createTickets(): Ticket[] {
  return requests.map(([subject, customer], index) => ({
    id: `SUP-${101 + index}`,
    subject,
    customer,
    status: index >= 8 ? 'resolved' : 'open',
    ...(index === 8 ? { readOnly: 'Historical workspace: this conversation is read-only.' } : {}),
    messages: (index === 0
      ? [
          'Our export is missing the department column. Can you help us check the report settings?',
          'Thanks for reporting this. Is the column visible in the saved report?',
          'Yes, it appears in the preview but not in the downloaded file.',
          'Please check whether the export uses the saved view or the default view.',
          'We used the default view. Our reference is department_finance_europe_quarterly_reconciliation_2026_september_export_review.',
          'The saved view includes custom columns. Choose that view in the export dialog.',
          'That restored the department column. Will the scheduled export use the same setting?',
          'Scheduled exports keep their own view selection. Update that selection as well.',
          'Understood. Please confirm that this applies to the weekly schedule too.',
        ]
      : [
          `Could you help with ${subject.toLowerCase()}? We have included the details in this local example conversation.`,
        ]
    ).map((body, messageIndex) => ({
      id: `SUP-${101 + index}-message-${messageIndex + 1}`,
      author: messageIndex % 2 === 0 ? customer : 'Alex Support',
      body,
      sentAt: messageTime(messageIndex),
    })),
  }));
}

export function initials(name: string) {
  return name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('');
}
