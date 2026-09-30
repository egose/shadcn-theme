import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { SupportInboxExamplePage } from './support-inbox';
import type { SupportTicket, TicketAssignee } from './support-inbox-types';

type PageActions = {
  sendReply(): Promise<void>;
  resolveSelected(): void;
  assignSelected(assignee: TicketAssignee): void;
  reload(): Promise<void>;
  tickets(): SupportTicket[];
  viewState(): string;
  loadError(): string | null;
};

describe('Support inbox rendered interleavings and triage', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] }).compileComponents();
  });

  function setup() {
    const fixture = TestBed.createComponent(SupportInboxExamplePage);
    const host = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
    const element = <T extends HTMLElement = HTMLElement>(selector: string): T => {
      const result = host.querySelector<T>(selector);
      expect(result).withContext(selector).not.toBeNull();
      return result!;
    };
    const click = (id: string) => {
      const button = element<HTMLButtonElement>(`[data-testid="${id}"]`);
      expect(button.disabled).withContext(id).toBeFalse();
      button.click();
      fixture.detectChanges();
    };
    const input = (selector: string, value: string) => {
      const control = element<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>(selector);
      control.value = value;
      control.dispatchEvent(new Event(control.tagName === 'SELECT' ? 'change' : 'input', { bubbles: true }));
      fixture.detectChanges();
    };
    const checkbox = (id: string, checked: boolean) => {
      const control = element<HTMLInputElement>(`[data-testid="${id}"]`);
      control.checked = checked;
      control.dispatchEvent(new Event('change', { bubbles: true }));
      fixture.detectChanges();
    };
    const settle = async () => {
      await new Promise((resolve) => setTimeout(resolve, 100));
      fixture.detectChanges();
      await fixture.whenStable();
      fixture.detectChanges();
    };
    return {
      fixture,
      host,
      element,
      click,
      input,
      checkbox,
      settle,
      page: fixture.componentInstance as unknown as PageActions,
      draft: () => element<HTMLTextAreaElement>('#reply-body').value,
      timeline: () => element('[data-testid="ticket-detail-timeline"]').textContent!,
    };
  }

  it('keeps failure, pending and retry with the ticket while other tickets can send', async () => {
    const ui = setup();
    ui.input('#reply-body', 'Original failed Sam text');
    ui.checkbox('simulate-reply-failure', true);
    ui.click('reply-submit');
    ui.click('ticket-select-ticket-1041');
    expect(ui.host.querySelector('[data-testid="reply-pending"]')).toBeNull();
    expect(ui.host.querySelector('[data-testid="reply-error"]')).toBeNull();
    ui.input('#reply-body', 'Independent Jordan send');
    ui.checkbox('simulate-reply-failure', false);
    ui.click('reply-submit');
    await ui.settle();
    expect(ui.timeline()).toContain('Independent Jordan send');
    expect(ui.host.querySelector('[data-testid="reply-error"]')).toBeNull();
    ui.click('ticket-select-ticket-1042');
    expect(ui.draft()).toBe('Original failed Sam text');
    expect(ui.element('[data-testid="reply-error"]').textContent).toContain('Reply failed to send');
    ui.input('#reply-body', 'Current corrected Sam draft');
    ui.click('reply-retry');
    expect(ui.element('[data-testid="reply-pending"]').textContent).toContain('ticket-1042');
    await ui.settle();
    expect(ui.timeline()).toContain('Current corrected Sam draft');
    expect(ui.timeline()).not.toContain('Original failed Sam text');
    expect(ui.host.querySelector('[data-testid="reply-error"]')).toBeNull();
    expect(ui.draft()).toBe('');
  });

  it('blocks duplicate sends and resolve while pending, then permits resolve/reopen without losing newer edits', async () => {
    const ui = setup();
    ui.input('#reply-body', 'One submitted reply');
    ui.click('reply-submit');
    expect(ui.element<HTMLButtonElement>('[data-testid="reply-submit"]').disabled).toBeTrue();
    expect(ui.element<HTMLButtonElement>('[data-testid="ticket-resolve"]').disabled).toBeTrue();
    const duplicate = ui.page.sendReply();
    ui.page.resolveSelected();
    ui.input('#reply-body', 'A different edit');
    ui.input('#reply-body', 'One submitted reply');
    await duplicate;
    await ui.settle();
    expect(ui.host.querySelectorAll('[data-testid="ticket-detail-timeline"] li').length).toBe(3);
    expect(ui.draft()).toBe('One submitted reply');
    expect(ui.element('[data-testid="detail-status-ticket-1042"]').textContent).toContain('Open');
    ui.click('ticket-resolve');
    expect(ui.element<HTMLTextAreaElement>('#reply-body').disabled).toBeTrue();
    ui.click('ticket-reopen');
    expect(ui.draft()).toBe('One submitted reply');
    expect(ui.element<HTMLTextAreaElement>('#reply-body').disabled).toBeFalse();
  });

  it('keeps a failed retry disabled while resolved and restores the draft after reopening', async () => {
    const ui = setup();
    ui.checkbox('simulate-reply-failure', true);
    ui.input('#reply-body', 'Preserved failed draft');
    ui.click('reply-submit');
    await ui.settle();
    ui.click('ticket-resolve');
    expect(ui.element<HTMLButtonElement>('[data-testid="reply-retry"]').disabled).toBeTrue();
    await ui.page.sendReply();
    expect(ui.host.querySelectorAll('[data-testid="ticket-detail-timeline"] li').length).toBe(2);
    ui.click('ticket-reopen');
    expect(ui.draft()).toBe('Preserved failed draft');
    ui.checkbox('simulate-reply-failure', false);
    ui.click('reply-retry');
    await ui.settle();
    expect(ui.timeline()).toContain('Preserved failed draft');
  });

  it('does not steal focus from another ticket composer when a reply settles', async () => {
    const ui = setup();
    ui.click('ticket-select-ticket-1042');
    await ui.settle();
    ui.input('#reply-body', 'Background Sam reply');
    ui.click('reply-submit');
    ui.click('ticket-select-ticket-1041');
    // Let the list/detail focus transition finish before focusing this composer.
    await new Promise((resolve) => setTimeout(resolve, 0));
    ui.element('#reply-body').focus();
    ui.input('#reply-body', 'Jordan still typing');
    await ui.settle();
    expect(document.activeElement).toBe(ui.element('#reply-body'));
    expect(ui.draft()).toBe('Jordan still typing');
    expect(ui.host.querySelector('[data-testid="inbox-outcome"]')).toBeNull();
  });

  for (const boundary of ['reset-inbox', 'reload-inbox', 'example-state-empty', 'example-state-readonly']) {
    for (const fails of [false, true]) {
      it(`suppresses ${fails ? 'failure' : 'success'} after ${boundary}, including return to an editable session`, async () => {
        const ui = setup();
        ui.checkbox('simulate-reply-failure', fails);
        ui.input('#reply-body', 'Old operation');
        ui.click('reply-submit');
        if (boundary === 'example-state-readonly') {
          ui.checkbox(boundary, true);
          ui.checkbox(boundary, false);
        } else {
          ui.click(boundary);
        }
        if (boundary === 'example-state-empty' || boundary === 'reload-inbox') ui.click('example-state-loaded');
        const preservesDraft = boundary.startsWith('example-state');
        expect(ui.draft()).toBe(preservesDraft ? 'Old operation' : '');
        ui.checkbox('simulate-reply-failure', false);
        ui.input('#reply-body', 'New session operation');
        ui.click('reply-submit');
        await ui.settle();
        expect(ui.timeline()).toContain('New session operation');
        expect(ui.timeline()).not.toContain('Old operation');
        expect(ui.host.querySelectorAll('[data-testid="ticket-detail-timeline"] li').length).toBe(3);
        expect(ui.host.querySelector('[data-testid="reply-error"]')).toBeNull();
        expect(ui.element('[data-testid="inbox-outcome"]').textContent).toContain('Reply sent');
      });
    }
  }

  it('resets drafts for every ticket and suppresses a reload failure after reset', async () => {
    const ui = setup();
    ui.input('#reply-body', 'Sam draft before reload');
    ui.click('ticket-select-ticket-1041');
    ui.input('#reply-body', 'Jordan draft before reload');
    ui.checkbox('example-state-simulate-failure', true);
    ui.click('reload-inbox');
    ui.click('reset-inbox');
    ui.input('#reply-body', 'Sam draft after reset');
    await ui.settle();
    expect(ui.draft()).toBe('Sam draft after reset');
    expect(ui.host.querySelector('[data-testid="tickets-error"]')).toBeNull();
    ui.click('ticket-select-ticket-1041');
    expect(ui.draft()).toBe('');
  });

  it('lets only the most recent reload decide the preview state', async () => {
    const ui = setup();
    ui.checkbox('example-state-simulate-failure', true);
    const first = ui.page.reload();
    ui.checkbox('example-state-simulate-failure', false);
    const second = ui.page.reload();
    await Promise.all([first, second]);
    ui.fixture.detectChanges();
    expect(ui.host.querySelector('[data-testid="tickets-error"]')).toBeNull();
    expect(ui.host.querySelector('[data-testid="ticket-list-pane"]')).not.toBeNull();
  });

  for (const fails of [false, true]) {
    it(`suppresses destroyed-session ${fails ? 'failure' : 'success'} and focus callbacks`, async () => {
      const ui = setup();
      ui.checkbox('simulate-reply-failure', fails);
      ui.input('#reply-body', 'Destroyed reply');
      const send = ui.page.sendReply();
      ui.click('ticket-select-ticket-1041');
      ui.fixture.destroy();
      const replacement = setup();
      replacement.element('#ticket-search').focus();
      await send;
      await replacement.settle();
      expect(ui.page.tickets()[0].messages.length).toBe(2);
      expect(replacement.timeline()).not.toContain('Destroyed reply');
      expect(replacement.host.querySelector('[data-testid="reply-error"]')).toBeNull();
      expect(document.activeElement).toBe(replacement.element('#ticket-search'));
    });

    it(`suppresses destroyed-session reload ${fails ? 'failure' : 'success'}`, async () => {
      const ui = setup();
      ui.checkbox('example-state-simulate-failure', fails);
      const reload = ui.page.reload();
      ui.fixture.destroy();
      await reload;
      expect(ui.page.viewState()).toBe('loading');
      expect(ui.page.loadError()).toBeNull();
    });
  }

  it('accepts normalized 2 and 2000 character bounds and renders the normalized submission', async () => {
    const ui = setup();
    for (const value of ['  ok  ', `  ${'z'.repeat(2000)}  `]) {
      ui.input('#reply-body', value);
      expect(ui.element('#reply-body').getAttribute('aria-invalid')).not.toBe('true');
      ui.click('reply-submit');
      await ui.settle();
      const messages = ui.page.tickets()[0].messages;
      expect(messages[messages.length - 1].body).toBe(value.trim());
      expect(ui.timeline()).toContain(value.trim());
      expect(ui.host.querySelector('[data-testid="reply-body-error"]')).toBeNull();
    }
  });

  it('searches ID, subject and requester case-insensitively, preserving drafts through no-results recovery', async () => {
    const ui = setup();
    ui.input('#reply-body', 'Sam draft across search');
    for (const query of [' TICKET-1041 ', 'WORKSPACE NAME', 'jordan lee']) {
      ui.input('#ticket-search', query);
      expect(ui.element('[data-testid="ticket-count"]').textContent).toContain('Showing 1 of 4');
      expect(ui.element('[data-testid="ticket-detail-heading"]').textContent).toContain('Invoice lines');
    }
    ui.input('#reply-body', 'Jordan draft across search');
    ui.element('#ticket-search').focus();
    ui.input('#ticket-search', 'no such ticket');
    expect(ui.host.querySelector('[data-testid="ticket-detail-pane"]')).toBeNull();
    expect(ui.element('[data-testid="no-ticket-results"]').textContent).toContain('No tickets match');
    expect(document.activeElement).toBe(ui.element('#ticket-search'));
    ui.click('clear-ticket-filters');
    await ui.settle();
    expect(ui.draft()).toBe('Sam draft across search');
    expect(document.activeElement?.id).toBe('ticket-select-ticket-1042');
    ui.click('ticket-select-ticket-1041');
    expect(ui.draft()).toBe('Jordan draft across search');
  });

  it('reassigns under an active filter with sensible fallback, no-results focus, and ticket-local drafts', async () => {
    const ui = setup();
    ui.input('#ticket-assignee', 'Mara Chen');
    ui.click('ticket-select-ticket-1042');
    ui.input('#reply-body', 'Sam reassignment draft');
    await ui.settle();
    ui.input('#detail-assignee', 'Ravi Shah');
    await ui.settle();
    expect(ui.host.querySelector('[data-testid="ticket-ticket-1042"]')).toBeNull();
    expect(ui.element('[data-testid="ticket-detail-heading"]').textContent).toContain('Annual receipt');
    expect(document.activeElement?.id).toBe('ticket-detail-heading');
    expect(ui.draft()).toBe('');
    ui.input('#detail-assignee', 'Unassigned');
    await ui.settle();
    expect(ui.element('[data-testid="no-ticket-results"]').textContent).toContain('No tickets match');
    expect(document.activeElement?.id).toBe('no-ticket-results-heading');
    expect(ui.element('[data-testid="inbox-outcome"]').textContent).toContain('ticket-1039 assigned to Unassigned');
    ui.click('clear-ticket-filters');
    ui.click('ticket-select-ticket-1042');
    await ui.settle();
    expect(ui.element<HTMLSelectElement>('#detail-assignee').value).toBe('Ravi Shah');
    expect(ui.draft()).toBe('Sam reassignment draft');
    ui.checkbox('example-state-readonly', true);
    await ui.settle();
    expect(ui.element<HTMLSelectElement>('#detail-assignee').disabled).toBeTrue();
    ui.page.assignSelected('Mara Chen');
    ui.fixture.detectChanges();
    expect(ui.element<HTMLSelectElement>('#detail-assignee').value).toBe('Ravi Shah');
    ui.click('ticket-select-ticket-1041');
    expect(ui.element('[data-testid="ticket-detail-heading"]').textContent).toContain('Invoice lines');
  });

  it('keeps reply identity when reassignment removes the sending ticket from the filter', async () => {
    const ui = setup();
    ui.input('#ticket-assignee', 'Mara Chen');
    ui.click('ticket-select-ticket-1042');
    await ui.settle();
    ui.input('#reply-body', 'Sent while reassigned');
    ui.click('reply-submit');
    ui.input('#detail-assignee', 'Ravi Shah');
    await ui.settle();
    expect(ui.timeline()).not.toContain('Sent while reassigned');
    ui.click('clear-ticket-filters');
    ui.click('ticket-select-ticket-1042');
    expect(ui.timeline()).toContain('Sent while reassigned');
  });

  it('keeps validation, pending, failure, success and readonly detail usable at 320px', async () => {
    const ui = setup();
    const wrapper = document.createElement('div');
    wrapper.style.cssText = 'width:280px;position:absolute;top:0;left:0;box-sizing:border-box';
    document.body.appendChild(wrapper);
    wrapper.appendChild(ui.host);
    const assertFits = () => {
      const edge = wrapper.getBoundingClientRect().right;
      const walk = (parent: Element) => {
        for (const child of Array.from(parent.children)) {
          const style = getComputedStyle(child);
          if (style.display === 'none') continue;
          expect(child.getBoundingClientRect().right)
            .withContext(child.tagName + ' ' + child.className)
            .toBeLessThanOrEqual(edge + 1);
          if (!['auto', 'scroll', 'hidden'].includes(style.overflowX)) walk(child);
        }
      };
      walk(wrapper);
      expect(ui.host.querySelectorAll('h2').length).toBe(1);
    };
    try {
      // Karma's 320px window can reserve 15px for the runner scrollbar.
      expect(window.matchMedia('(max-width: 320px)').matches).toBeTrue();
      ui.click('ticket-select-ticket-1041');
      await ui.settle();
      expect(getComputedStyle(ui.element('[data-testid="ticket-list-pane"]')).display).toBe('none');
      expect(getComputedStyle(ui.element('[data-testid="ticket-detail-pane"]')).display).not.toBe('none');
      ui.click('reply-submit');
      assertFits();
      ui.input('#reply-body', 'Long unbroken reply ' + 'x'.repeat(1500));
      ui.checkbox('simulate-reply-failure', true);
      ui.click('reply-submit');
      expect(ui.host.querySelector('[data-testid="reply-pending"]')).not.toBeNull();
      assertFits();
      await ui.settle();
      expect(ui.host.querySelector('[data-testid="reply-error"]')).not.toBeNull();
      assertFits();
      ui.checkbox('simulate-reply-failure', false);
      ui.click('reply-retry');
      await ui.settle();
      expect(ui.timeline()).toContain('Long unbroken reply');
      assertFits();
      ui.checkbox('example-state-readonly', true);
      assertFits();
      ui.click('back-to-tickets');
      await ui.settle();
      expect(document.activeElement?.id).toBe('ticket-select-ticket-1041');
      expect(getComputedStyle(ui.element('[data-testid="ticket-detail-pane"]')).display).toBe('none');
      assertFits();
    } finally {
      wrapper.remove();
    }
  });
});
