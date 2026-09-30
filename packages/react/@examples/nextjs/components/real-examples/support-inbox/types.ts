export type TicketStatus = 'open' | 'resolved';
export type TicketFilter = 'all' | TicketStatus;
export type InboxAction = 'send' | 'resolve' | 'reopen';

export type Message = {
  id: string;
  author: string;
  body: string;
  sentAt: string;
};

export type Ticket = {
  id: string;
  subject: string;
  customer: string;
  status: TicketStatus;
  readOnly?: string;
  messages: Message[];
};

export type TicketFeedback = { kind: 'success' | 'error'; text: string };
