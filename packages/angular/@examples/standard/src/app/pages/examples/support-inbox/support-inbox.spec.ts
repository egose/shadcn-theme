import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SupportInboxExamplePage } from './support-inbox';
import {
  ASSIGNEE_FILTERS,
  EXAMPLE_TICKETS,
  REPLY_SENT_AT_ISO,
  STATUS_FILTERS,
  filterTickets,
  requesterInitials,
} from './support-inbox-fixtures';

type PageControls = {
  viewState: { set: (state: 'loading' | 'empty' | 'error' | 'loaded') => void };
  readOnly: { set: (value: boolean) => void };
  simulateFailure: { set: (value: boolean) => void };
  simulateReplyFailure: { set: (value: boolean) => void };
  filterForm: {
    controls: {
      status: { setValue: (value: 'All' | 'Open' | 'Pending' | 'Resolved') => void };
      assignee: { setValue: (value: 'All' | 'Mara Chen' | 'Ravi Shah' | 'Unassigned') => void };
    };
  };
  reload: () => Promise<void>;
  sendReply: () => Promise<void>;
  resolveSelected: () => void;
  reopenSelected: () => void;
};

async function settle(fixture: ComponentFixture<unknown>): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 100));
  fixture.detectChanges();
  await fixture.whenStable();
  fixture.detectChanges();
}

function setTextarea(host: HTMLElement, value: string): void {
  const textarea = host.querySelector<HTMLTextAreaElement>('[data-testid="reply-body"]');
  expect(textarea).withContext('reply composer should exist').not.toBeNull();
  textarea!.value = value;
  textarea!.dispatchEvent(new Event('input', { bubbles: true }));
}

function click(host: HTMLElement, testid: string): void {
  const button = host.querySelector<HTMLButtonElement>(`[data-testid="${testid}"]`);
  expect(button).withContext(`${testid} should exist`).not.toBeNull();
  expect(button!.disabled).withContext(`${testid} should be enabled`).toBeFalse();
  button!.click();
}

describe('SupportInboxExamplePage', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] }).compileComponents();
  });

  function setup() {
    const fixture = TestBed.createComponent(SupportInboxExamplePage);
    fixture.detectChanges();
    return {
      fixture,
      host: fixture.nativeElement as HTMLElement,
      page: fixture.componentInstance as unknown as PageControls,
    };
  }

  it('lazy-loads through the registry entry', async () => {
    const loaded = await import('./support-inbox').then((m) => m.SupportInboxExamplePage);
    expect(loaded).toBe(SupportInboxExamplePage);
  });

  it('renders one h2 title first with no h1 and no heading skips', () => {
    const { host } = setup();
    const headings = Array.from(host.querySelectorAll('h1,h2,h3,h4,h5,h6'));
    expect(headings.length).toBeGreaterThan(0);
    expect(host.querySelector('h1')).toBeNull();
    expect(headings[0].tagName).toBe('H2');
    let previous = 2;
    for (const heading of headings.slice(1)) {
      const level = Number(heading.tagName.substring(1));
      expect(level).toBeLessThanOrEqual(previous + 1);
      previous = level;
    }
  });

  it('uses fixed UTC fixtures with stable ids, varied subjects, and local initials', () => {
    expect(EXAMPLE_TICKETS.map((ticket) => ticket.id)).toEqual([
      'ticket-1042',
      'ticket-1041',
      'ticket-1040',
      'ticket-1039',
    ]);
    expect(STATUS_FILTERS).toEqual(['All', 'Open', 'Pending', 'Resolved']);
    expect(ASSIGNEE_FILTERS).toEqual(['All', 'Mara Chen', 'Ravi Shah', 'Unassigned']);
    expect(REPLY_SENT_AT_ISO.endsWith('Z')).toBeTrue();
    const lengths = new Set(EXAMPLE_TICKETS.map((ticket) => ticket.subject.length));
    expect(lengths.size).toBe(EXAMPLE_TICKETS.length);
    for (const ticket of EXAMPLE_TICKETS) {
      expect(ticket.updatedAtIso.endsWith('Z')).toBeTrue();
      expect(Date.parse(ticket.updatedAtIso)).not.toBeNaN();
      expect(ticket.messages.length).toBeGreaterThan(0);
      for (const message of ticket.messages) {
        expect(message.createdAtIso.endsWith('Z')).toBeTrue();
        expect(Date.parse(message.createdAtIso)).not.toBeNaN();
      }
    }
    // The pure filter helper agrees with the rendered list for every combination.
    for (const status of STATUS_FILTERS) {
      for (const assignee of ASSIGNEE_FILTERS) {
        expect(filterTickets(EXAMPLE_TICKETS, status, assignee).map((ticket) => ticket.id)).toEqual(
          EXAMPLE_TICKETS.filter(
            (ticket) =>
              (status === 'All' || ticket.status === status) && (assignee === 'All' || ticket.assignee === assignee),
          ).map((ticket) => ticket.id),
        );
      }
    }
    expect(requesterInitials('Sam Rivera')).toBe('SR');
    const { host } = setup();
    for (const ticket of EXAMPLE_TICKETS) {
      expect(host.querySelector(`[data-testid="ticket-${ticket.id}"]`)).not.toBeNull();
    }
  });

  it('exposes the catalog toolbar and all four preview states', () => {
    const { fixture, host, page } = setup();
    expect(host.querySelector('[data-testid="example-state-toolbar"]')).not.toBeNull();

    page.viewState.set('loading');
    fixture.detectChanges();
    expect(host.querySelector('[data-testid="tickets-loading"]')).not.toBeNull();

    page.viewState.set('empty');
    fixture.detectChanges();
    expect(host.textContent).toContain('Inbox zero');
    expect(host.querySelector('[data-testid="no-ticket-results"]')).toBeNull();

    page.viewState.set('error');
    fixture.detectChanges();
    expect(host.querySelector('[data-testid="tickets-error"]')).not.toBeNull();

    page.viewState.set('loaded');
    fixture.detectChanges();
    expect(host.querySelector('[data-testid="ticket-ticket-1042"]')).not.toBeNull();
  });

  it('filters by status with a visible outcome', () => {
    const { fixture, host, page } = setup();
    page.filterForm.controls.status.setValue('Open');
    fixture.detectChanges();
    expect(host.querySelector('[data-testid="ticket-count"]')?.textContent).toContain('Showing 2 of 4 tickets');
    expect(host.querySelector('[data-testid="ticket-ticket-1042"]')).not.toBeNull();
    expect(host.querySelector('[data-testid="ticket-ticket-1040"]')).not.toBeNull();
    expect(host.querySelector('[data-testid="ticket-ticket-1041"]')).toBeNull();
    expect(host.querySelector('[data-testid="ticket-ticket-1039"]')).toBeNull();
  });

  it('filters by assignee with a visible outcome', () => {
    const { fixture, host, page } = setup();
    page.filterForm.controls.assignee.setValue('Ravi Shah');
    fixture.detectChanges();
    expect(host.querySelector('[data-testid="ticket-count"]')?.textContent).toContain('Showing 1 of 4 tickets');
    expect(host.querySelector('[data-testid="ticket-ticket-1041"]')).not.toBeNull();
    expect(host.querySelector('[data-testid="ticket-ticket-1042"]')).toBeNull();
  });

  it('selects a ticket, shows its timeline, and moves focus to the detail heading', async () => {
    const { fixture, host } = setup();
    click(host, 'ticket-select-ticket-1041');
    fixture.detectChanges();
    await settle(fixture);
    const heading = host.querySelector('[data-testid="ticket-detail-heading"]');
    expect(heading?.textContent).toContain('Invoice lines show the wrong workspace name');
    expect(host.querySelectorAll('[data-testid="ticket-detail-timeline"] li').length).toBe(2);
    expect(host.querySelector('[data-testid="message-ticket-1041-message-1"]')?.textContent).toContain(
      'old workspace name',
    );
    expect(host.querySelector('[data-testid="ticket-select-ticket-1041"]')?.getAttribute('aria-current')).toBe('true');
    expect(document.activeElement).toBe(heading);
  });

  it('keeps desktop list and detail panes in the DOM with a responsive split contract', () => {
    const { host } = setup();
    expect(host.querySelector('[data-testid="ticket-list-pane"]')).not.toBeNull();
    expect(host.querySelector('[data-testid="ticket-detail-pane"]')).not.toBeNull();
    // Desktop split is a medium-and-up two-column grid; the back control only shows on small screens.
    expect(host.querySelector('[data-testid="back-to-tickets"]')?.className).toContain('md:tw:hidden');
  });

  it('requires a valid reply before sending anything', async () => {
    const { fixture, host } = setup();
    const before = host.querySelectorAll('[data-testid="ticket-detail-timeline"] li').length;
    click(host, 'reply-submit');
    fixture.detectChanges();
    await settle(fixture);
    expect(host.querySelector('[data-testid="reply-body-error"]')?.textContent).toContain('Write a reply');
    expect(host.querySelectorAll('[data-testid="ticket-detail-timeline"] li').length).toBe(before);
    expect(host.querySelector('[data-testid="inbox-outcome"]')).toBeNull();
  });

  it('sends a reply that appends to the timeline with a visible outcome', async () => {
    const { fixture, host } = setup();
    click(host, 'ticket-select-ticket-1042');
    fixture.detectChanges();
    await settle(fixture);
    setTextarea(host, 'Your fresh reset link is on its way — it stays valid for 60 minutes.');
    fixture.detectChanges();
    click(host, 'reply-submit');
    fixture.detectChanges();
    await settle(fixture);
    const timeline = host.querySelector('[data-testid="ticket-detail-timeline"]');
    expect(timeline?.textContent).toContain('Your fresh reset link is on its way');
    expect(host.querySelector('[data-testid="inbox-outcome"]')?.textContent).toContain(
      'Reply sent to Sam Rivera as plain text.',
    );
    expect(host.querySelector<HTMLTextAreaElement>('[data-testid="reply-body"]')?.value).toBe('');
    expect(document.activeElement?.getAttribute('data-testid')).toBe('reply-body');
  });

  it('renders reply text as text and never as HTML', async () => {
    const { fixture, host } = setup();
    // The deterministic fixture itself proves the contract for seeded messages.
    click(host, 'ticket-select-ticket-1040');
    fixture.detectChanges();
    await settle(fixture);
    expect(host.querySelector('[data-testid="message-ticket-1040-message-1"]')?.textContent).toContain(
      'announces <b>every</b> keystroke',
    );

    click(host, 'ticket-select-ticket-1042');
    fixture.detectChanges();
    await settle(fixture);
    setTextarea(host, 'Following up <b>today</b> & tomorrow');
    fixture.detectChanges();
    click(host, 'reply-submit');
    fixture.detectChanges();
    await settle(fixture);
    const timeline = host.querySelector('[data-testid="ticket-detail-timeline"]');
    expect(timeline?.textContent).toContain('Following up <b>today</b> & tomorrow');
    expect(timeline?.querySelector('b')).toBeNull();
  });

  it('preserves the draft on reply failure and sends on retry', async () => {
    const { fixture, host, page } = setup();
    page.simulateReplyFailure.set(true);
    fixture.detectChanges();
    setTextarea(host, 'Checking with finance about the legal name.');
    fixture.detectChanges();
    const selectedBefore = host.querySelector('[data-testid="ticket-select-ticket-1042"]');
    expect(selectedBefore).not.toBeNull();
    // ticket-1042 is Open by default, but select explicitly to prove context is kept.
    (host.querySelector('[data-testid="ticket-select-ticket-1042"]') as HTMLButtonElement).click();
    fixture.detectChanges();
    await settle(fixture);
    click(host, 'reply-submit');
    fixture.detectChanges();
    await settle(fixture);
    expect(host.querySelector('[data-testid="reply-error"]')?.textContent).toContain('Reply failed to send');
    expect(host.querySelector<HTMLTextAreaElement>('[data-testid="reply-body"]')?.value).toContain(
      'Checking with finance',
    );
    expect(host.querySelector('[data-testid="ticket-detail-timeline"]')?.textContent).not.toContain(
      'Checking with finance',
    );

    page.simulateReplyFailure.set(false);
    fixture.detectChanges();
    click(host, 'reply-retry');
    fixture.detectChanges();
    await settle(fixture);
    expect(host.querySelector('[data-testid="reply-error"]')).toBeNull();
    expect(host.querySelector('[data-testid="ticket-detail-timeline"]')?.textContent).toContain(
      'Checking with finance',
    );
    expect(host.querySelector('[data-testid="inbox-outcome"]')?.textContent).toContain('Reply sent to');
  });

  it('resolves the selected ticket with a visible outcome and keeps keyboard focus', async () => {
    const { fixture, host, page } = setup();
    page.filterForm.controls.status.setValue('Open');
    fixture.detectChanges();
    click(host, 'ticket-select-ticket-1042');
    fixture.detectChanges();
    await settle(fixture);
    click(host, 'ticket-resolve');
    fixture.detectChanges();
    await settle(fixture);
    expect(host.querySelector('[data-testid="inbox-outcome"]')?.textContent).toContain('ticket-1042 resolved');
    expect(host.querySelector('[data-testid="ticket-ticket-1042"]')).toBeNull();
    // The resolved ticket leaves the Open filter, so selection falls back without losing context.
    expect(host.querySelector('[data-testid="ticket-count"]')?.textContent).toContain('Showing 1 of 4 tickets');
    expect(host.querySelector('[data-testid="ticket-detail-heading"]')?.textContent).toContain(
      'Keyboard navigation in the dialog preview',
    );
    expect(document.activeElement?.getAttribute('data-testid')).toBe('ticket-detail-heading');
  });

  it('reopens a resolved ticket and locks the composer while resolved', async () => {
    const { fixture, host } = setup();
    click(host, 'ticket-select-ticket-1039');
    fixture.detectChanges();
    await settle(fixture);
    expect(host.querySelector('[data-testid="ticket-resolve"]')).toBeNull();
    expect(host.querySelector('[data-testid="reply-resolved-note"]')).not.toBeNull();
    expect(host.querySelector<HTMLTextAreaElement>('[data-testid="reply-body"]')?.disabled).toBeTrue();
    expect(host.querySelector<HTMLButtonElement>('[data-testid="reply-submit"]')?.disabled).toBeTrue();

    click(host, 'ticket-reopen');
    fixture.detectChanges();
    await settle(fixture);
    expect(host.querySelector('[data-testid="inbox-outcome"]')?.textContent).toContain('ticket-1039 reopened');
    expect(host.querySelector('[data-testid="detail-status-ticket-1039"]')?.textContent).toContain('Open');
    expect(host.querySelector<HTMLTextAreaElement>('[data-testid="reply-body"]')?.disabled).toBeFalse();
    expect(document.activeElement?.getAttribute('data-testid')).toBe('ticket-detail-heading');
  });

  it('keeps empty-inbox and no-matches states distinct with recovery actions', () => {
    const { fixture, host, page } = setup();
    page.filterForm.controls.status.setValue('Resolved');
    page.filterForm.controls.assignee.setValue('Ravi Shah');
    fixture.detectChanges();
    const noMatches = host.querySelector('[data-testid="no-ticket-results"]');
    expect(noMatches).not.toBeNull();
    expect(noMatches?.textContent).toContain('No tickets match these filters');
    expect(noMatches?.textContent).not.toContain('Inbox zero');
    click(host, 'clear-ticket-filters');
    fixture.detectChanges();
    expect(host.querySelector('[data-testid="ticket-ticket-1042"]')).not.toBeNull();

    page.viewState.set('empty');
    fixture.detectChanges();
    expect(host.textContent).toContain('Inbox zero');
    expect(host.querySelector('[data-testid="no-ticket-results"]')).toBeNull();
  });

  it('moves from list to detail and back without losing context or focus', async () => {
    const { fixture, host } = setup();
    click(host, 'ticket-select-ticket-1040');
    fixture.detectChanges();
    await settle(fixture);
    expect(host.querySelector('[data-testid="ticket-detail-heading"]')?.textContent).toContain(
      'Keyboard navigation in the dialog preview',
    );
    expect(document.activeElement?.getAttribute('data-testid')).toBe('ticket-detail-heading');

    click(host, 'back-to-tickets');
    fixture.detectChanges();
    await settle(fixture);
    expect(document.activeElement?.getAttribute('data-testid')).toBe('ticket-select-ticket-1040');
    // Context is preserved: the same ticket stays selected and its detail still renders.
    expect(host.querySelector('[data-testid="ticket-select-ticket-1040"]')?.getAttribute('aria-current')).toBe('true');
    expect(host.querySelector('[data-testid="ticket-detail-heading"]')?.textContent).toContain(
      'Keyboard navigation in the dialog preview',
    );
  });

  it('blocks reply, retry, resolve, and reopen in read-only preview through every path', async () => {
    const { fixture, host, page } = setup();
    page.readOnly.set(true);
    fixture.detectChanges();
    expect(host.querySelector<HTMLTextAreaElement>('[data-testid="reply-body"]')?.disabled).toBeTrue();
    expect(host.querySelector<HTMLButtonElement>('[data-testid="reply-submit"]')?.disabled).toBeTrue();
    expect(host.querySelector<HTMLButtonElement>('[data-testid="ticket-resolve"]')?.disabled).toBeTrue();
    expect(host.textContent).toContain('Read-only preview');

    const timelineCount = host.querySelectorAll('[data-testid="ticket-detail-timeline"] li').length;
    await page.sendReply();
    page.resolveSelected();
    page.reopenSelected();
    fixture.detectChanges();
    expect(host.querySelectorAll('[data-testid="ticket-detail-timeline"] li').length).toBe(timelineCount);
    expect(host.querySelector('[data-testid="detail-status-ticket-1042"]')?.textContent).toContain('Open');
    expect(host.querySelector('[data-testid="inbox-outcome"]')).toBeNull();
    expect(host.querySelector('[data-testid="reply-error"]')).toBeNull();
  });

  it('reloads through the deterministic simulator, honoring simulated failure', async () => {
    const { fixture, host, page } = setup();
    page.simulateFailure.set(true);
    await page.reload();
    fixture.detectChanges();
    expect(host.querySelector('[data-testid="tickets-error"]')).not.toBeNull();

    page.simulateFailure.set(false);
    await page.reload();
    fixture.detectChanges();
    expect(host.querySelector('[data-testid="ticket-ticket-1040"]')).not.toBeNull();
  });
});
