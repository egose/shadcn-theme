import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { HlmDialogService } from '@egose/shadcn-theme-ng/dialog';
import { from } from 'rxjs';
import { TeamManagementExamplePage } from './team-management';
import {
  EXAMPLE_MEMBERS,
  INVITED_MEMBER_JOINED_AT_ISO,
  TEAM_PAGE_SIZE,
  filterMembers,
  memberInitials,
} from './team-management-fixtures';

function overlayPane(): HTMLElement | null {
  return document.querySelector<HTMLElement>('.cdk-overlay-pane');
}

function mockConfirmation(answer: Promise<boolean>) {
  return spyOn(TestBed.inject(HlmDialogService), 'open').and.returnValue({
    closed$: from(answer),
    close: jasmine.createSpy('close'),
  } as unknown as ReturnType<HlmDialogService['open']>);
}

/** Finds the overlay pane containing the given text (menus and dialogs stack in separate panes). */
function overlayPaneContaining(text: string): HTMLElement | null {
  const panes = Array.from(document.querySelectorAll<HTMLElement>('.cdk-overlay-pane'));
  return panes.find((pane) => pane.textContent?.includes(text)) ?? null;
}

function overlayDialogButton(dialogText: string, buttonText: string): HTMLButtonElement | null {
  const dialog = overlayPaneContaining(dialogText);
  const buttons = Array.from(dialog?.querySelectorAll('button') ?? []);
  return buttons.find((button) => button.textContent?.trim() === buttonText) ?? null;
}

function overlayButton(text: string): HTMLButtonElement | null {
  const buttons = Array.from(overlayPane()?.querySelectorAll('button') ?? []);
  return buttons.find((button) => button.textContent?.trim() === text) ?? null;
}

function overlayField<T extends HTMLElement>(testid: string, selector: string): T | null {
  const panes = Array.from(document.querySelectorAll<HTMLElement>('.cdk-overlay-pane'));
  for (const pane of panes) {
    const host = pane.querySelector<T>(`[data-testid="${testid}"]`);
    if (host) {
      if (host.matches(selector)) return host;
      const inner = host.querySelector<T>(selector);
      if (inner) return inner;
    }
  }
  return null;
}

function setOverlayInput(testid: string, value: string): void {
  const input = overlayField<HTMLInputElement>(testid, 'input');
  expect(input).withContext(`[${testid}] should exist`).not.toBeNull();
  input!.value = value;
  input!.dispatchEvent(new Event('input', { bubbles: true }));
}

function setOverlaySelect(testid: string, value: string): void {
  const select = overlayField<HTMLSelectElement>(testid, 'select');
  expect(select).withContext(`[${testid}] select should exist`).not.toBeNull();
  select!.value = value;
  select!.dispatchEvent(new Event('change', { bubbles: true }));
}

function setHostSelect(host: HTMLElement, testid: string, value: string): void {
  const select = host.querySelector<HTMLSelectElement>(`[data-testid="${testid}"] select`);
  expect(select).withContext(`[${testid}] select should exist`).not.toBeNull();
  select!.value = value;
  select!.dispatchEvent(new Event('change', { bubbles: true }));
}

async function settle(fixture: ComponentFixture<unknown>): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 100));
  fixture.detectChanges();
  await fixture.whenStable();
  fixture.detectChanges();
}

/**
 * Polls until the dialog overlay is removed. Closing runs through exit
 * animations that can starve on loaded runners (CI); a fixed 100ms settle
 * then flakes with the pane lingering at `data-state="closed"`.
 */
async function waitForOverlayGone(fixture: ComponentFixture<unknown>, timeoutMs = 5000): Promise<boolean> {
  const deadline = Date.now() + timeoutMs;
  do {
    fixture.detectChanges();
    await fixture.whenStable();
    if (overlayPane() === null) return true;
    await new Promise((resolve) => setTimeout(resolve, 50));
  } while (Date.now() < deadline);
  fixture.detectChanges();
  return overlayPane() === null;
}

async function openRowMenu(
  fixture: ComponentFixture<TeamManagementExamplePage>,
  host: HTMLElement,
  memberId: string,
): Promise<void> {
  (host.querySelector(`[data-testid="menu-table-${memberId}"]`) as HTMLButtonElement).click();
  await settle(fixture);
}

describe('TeamManagementExamplePage', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection(), provideRouter([])],
    }).compileComponents();
  });

  afterEach(() => {
    document.querySelector('.cdk-overlay-container')?.remove();
  });

  function setup() {
    const fixture = TestBed.createComponent(TeamManagementExamplePage);
    fixture.detectChanges();
    return { fixture, host: fixture.nativeElement as HTMLElement };
  }

  function countText(host: HTMLElement): string {
    return host.querySelector('[data-testid="member-count"]')?.textContent ?? '';
  }

  it('lazy-loads through the registry entry', async () => {
    const loaded = await import('./team-management').then((m) => m.TeamManagementExamplePage);
    expect(loaded).toBe(TeamManagementExamplePage);
  });

  it('rejects a removal confirmed after permission changes', async () => {
    const { fixture, host } = setup();
    let confirm!: (value: boolean) => void;
    mockConfirmation(new Promise<boolean>((resolve) => (confirm = resolve)));
    const page = fixture.componentInstance as unknown as {
      readOnly: { set(value: boolean): void };
      requestRemove(member: (typeof EXAMPLE_MEMBERS)[number]): Promise<void>;
    };
    const pending = page.requestRemove(EXAMPLE_MEMBERS[1]);
    page.readOnly.set(true);
    fixture.detectChanges();
    confirm(true);
    await pending;
    fixture.detectChanges();
    expect(countText(host)).toContain('of 8 members');
    expect(host.querySelector('[data-testid="member-outcome"]')).toBeNull();
  });

  it('cannot undo a removal in readonly mode', async () => {
    const { fixture, host } = setup();
    mockConfirmation(Promise.resolve(true));
    const page = fixture.componentInstance as unknown as {
      readOnly: { set(value: boolean): void };
      requestRemove(member: (typeof EXAMPLE_MEMBERS)[number]): Promise<void>;
      undoRemove(): void;
    };
    await page.requestRemove(EXAMPLE_MEMBERS[1]);
    page.readOnly.set(true);
    fixture.detectChanges();
    page.undoRemove();
    fixture.detectChanges();
    expect(countText(host)).toContain('of 7 members');
  });

  it('validates trimmed invitation names before closing', async () => {
    const { fixture, host } = setup();
    (host.querySelector('[data-testid="invite-member"]') as HTMLButtonElement).click();
    await settle(fixture);
    setOverlayInput('invite-name', '   ');
    setOverlayInput('invite-email', 'new@example.com');
    overlayButton('Send invite')!.click();
    await settle(fixture);
    expect(overlayPane()?.querySelector('[data-testid="invite-name-error"]')).not.toBeNull();
    expect(countText(host)).toContain('of 8 members');
  });

  it('rejects duplicate email case-insensitively with an associated control error', async () => {
    const { fixture, host } = setup();
    (host.querySelector('[data-testid="invite-member"]') as HTMLButtonElement).click();
    await settle(fixture);
    setOverlayInput('invite-name', 'Another Ada');
    setOverlayInput('invite-email', EXAMPLE_MEMBERS[0].email.toUpperCase());
    overlayButton('Send invite')!.click();
    await settle(fixture);
    expect(overlayPane()?.querySelector('[data-testid="invite-email-error"]')?.textContent).toContain('already');
    expect(overlayField<HTMLInputElement>('invite-email', 'input')?.getAttribute('aria-describedby')).toContain(
      'invite-email-error',
    );
    expect(countText(host)).toContain('of 8 members');
  });

  it('associates normalized name errors, accepts padded valid values, and preserves literal text', async () => {
    const { fixture, host } = setup();
    (host.querySelector('[data-testid="invite-member"]') as HTMLButtonElement).click();
    await settle(fixture);
    setOverlayInput('invite-email', '  NEW.PERSON@EXAMPLE.COM  ');
    for (const name of ['', '   ', ' x ']) {
      setOverlayInput('invite-name', name);
      overlayButton('Send invite')!.click();
      await settle(fixture);
      const input = overlayField<HTMLInputElement>('invite-name', 'input')!;
      expect(input.getAttribute('aria-invalid')).toBe('true');
      expect(input.getAttribute('aria-describedby')).toContain('invite-name-error');
      expect(overlayPane()?.querySelector('#invite-name-error')).not.toBeNull();
    }
    setOverlayInput('invite-name', ' AB ');
    overlayButton('Send invite')!.click();
    await settle(fixture);
    expect(await waitForOverlayGone(fixture)).toBeTrue();
    expect(host.querySelector('[data-testid="member-row-member-ab"]')?.textContent).toContain('new.person@example.com');
    expect(host.querySelector('[data-testid="member-outcome"]')?.textContent).toContain('AB invited');

    (host.querySelector('[data-testid="invite-member"]') as HTMLButtonElement).click();
    await settle(fixture);
    setOverlayInput('invite-name', '<b>Literal Name</b>');
    setOverlayInput('invite-email', 'literal@example.com');
    overlayButton('Send invite')!.click();
    await settle(fixture);
    expect(await waitForOverlayGone(fixture)).toBeTrue();
    const row = host.querySelector('[data-testid="member-row-member-b-literal-name-b"]');
    expect(row?.textContent).toContain('<b>Literal Name</b>');
    expect(row?.querySelector('b')).toBeNull();
  });

  it('rechecks duplicate emails against live roster changes while the invite dialog is open', async () => {
    const { fixture, host } = setup();
    (host.querySelector('[data-testid="invite-member"]') as HTMLButtonElement).click();
    await settle(fixture);
    setOverlayInput('invite-name', 'Ivy Chen');
    setOverlayInput('invite-email', 'ivy@example.com');
    const page = fixture.componentInstance as unknown as { members: { set(members: readonly unknown[]): void } };
    page.members.set([...EXAMPLE_MEMBERS, { ...EXAMPLE_MEMBERS[0], id: 'incoming-ivy', email: 'IVY@example.com' }]);
    overlayButton('Send invite')!.click();
    await settle(fixture);
    expect(overlayPane()?.querySelector('#invite-email-error')?.textContent).toContain('already');
    expect(overlayField<HTMLInputElement>('invite-email', 'input')?.getAttribute('aria-invalid')).toBe('true');
    expect(countText(host)).toContain('of 9 members');
  });

  it('returns focus on invite, role, removal and bulk cancellation without changing the roster', async () => {
    const { fixture, host } = setup();
    const invite = host.querySelector<HTMLButtonElement>('[data-testid="invite-member"]')!;
    invite.focus();
    invite.click();
    await settle(fixture);
    overlayButton('Cancel')!.click();
    await settle(fixture);
    await waitForOverlayGone(fixture);
    expect(document.activeElement).toBe(invite);

    await openRowMenu(fixture, host, EXAMPLE_MEMBERS[1].id);
    overlayButton('Change role')!.click();
    await settle(fixture);
    overlayDialogButton('Change role for Bo Lindqvist', 'Cancel')!.click();
    await settle(fixture);
    await waitForOverlayGone(fixture);
    expect(document.activeElement).toBe(host.querySelector(`[data-testid="menu-table-${EXAMPLE_MEMBERS[1].id}"]`));

    await openRowMenu(fixture, host, EXAMPLE_MEMBERS[1].id);
    overlayButton('Remove')!.click();
    await settle(fixture);
    expect(overlayPaneContaining('Remove Bo Lindqvist?')?.textContent).not.toContain('30 days');
    overlayDialogButton('Remove Bo Lindqvist?', 'Cancel')!.click();
    await settle(fixture);
    await waitForOverlayGone(fixture);
    expect(document.activeElement).toBe(host.querySelector(`[data-testid="menu-table-${EXAMPLE_MEMBERS[1].id}"]`));

    host.querySelector<HTMLElement>('eg-table-row-selection [role="checkbox"]')!.click();
    await settle(fixture);
    const bulk = host.querySelector<HTMLButtonElement>('[data-testid="bulk-change"]')!;
    bulk.focus();
    bulk.click();
    await settle(fixture);
    expect(overlayPaneContaining('Change 1 selected members to Viewer?')?.textContent).toContain(EXAMPLE_MEMBERS[0].id);
    overlayDialogButton('Change 1 selected members to Viewer?', 'Cancel')!.click();
    await settle(fixture);
    await waitForOverlayGone(fixture);
    expect(document.activeElement).toBe(bulk);
    expect(countText(host)).toContain('of 8 members');
    expect(host.querySelector('[data-testid="member-outcome"]')).toBeNull();
  });

  it('closes a real owned confirmation on destruction instead of leaving an actionable overlay', async () => {
    const { fixture, host } = setup();
    await openRowMenu(fixture, host, EXAMPLE_MEMBERS[1].id);
    overlayButton('Remove')!.click();
    await settle(fixture);
    expect(overlayPaneContaining('Remove Bo Lindqvist?')).not.toBeNull();
    fixture.destroy();
    await new Promise((resolve) => setTimeout(resolve, 250));
    expect(overlayPaneContaining('Remove Bo Lindqvist?')).toBeNull();
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

  it('uses fixed UTC fixtures with stable ids, varied names, and local initials', () => {
    expect(TEAM_PAGE_SIZE).toBe(3);
    expect(EXAMPLE_MEMBERS.map((member) => member.id)).toEqual([
      'member-ada-okafor',
      'member-bo-lindqvist',
      'member-catarina-m-reyes-almeida',
      'member-dev-patel',
      'member-elsa-moreau',
      'member-finn-osei',
      'member-grace-nguyen-halvorsen',
      'member-hugo-stein',
    ]);
    for (const member of EXAMPLE_MEMBERS) {
      expect(member.joinedAtIso.endsWith('Z')).toBeTrue();
      expect(Date.parse(member.joinedAtIso)).not.toBeNaN();
    }
    expect(INVITED_MEMBER_JOINED_AT_ISO.endsWith('Z')).toBeTrue();
    const lengths = new Set(EXAMPLE_MEMBERS.map((member) => member.name.length));
    expect(lengths.size).toBeGreaterThan(4);
    expect(memberInitials('Ada Okafor')).toBe('AO');
    expect(memberInitials('Catarina M. Reyes Almeida')).toBe('CM');
    const { host } = setup();
    // First page shows the first three fixtures in order.
    expect(host.querySelector('[data-testid="member-row-member-ada-okafor"]')).not.toBeNull();
    expect(host.querySelector('[data-testid="member-row-member-bo-lindqvist"]')).not.toBeNull();
    expect(host.querySelector('[data-testid="member-row-member-catarina-m-reyes-almeida"]')).not.toBeNull();
    expect(host.querySelector('[data-testid="member-row-member-dev-patel"]')).toBeNull();
    expect(countText(host)).toContain('Showing 1–3 of 8 members');
    expect(countText(host)).toContain('Page 1 of 3');
  });

  it('exposes the catalog toolbar and all four preview states', () => {
    const { fixture, host } = setup();
    expect(host.querySelector('[data-testid="example-state-toolbar"]')).not.toBeNull();
    const page = fixture.componentInstance as unknown as {
      viewState: { set: (state: 'loading' | 'empty' | 'error' | 'loaded') => void };
    };

    page.viewState.set('loading');
    fixture.detectChanges();
    expect(host.querySelector('[data-testid="members-loading"]')).not.toBeNull();
    expect(host.querySelector('[aria-label="Loading members"]')).not.toBeNull();

    page.viewState.set('empty');
    fixture.detectChanges();
    expect(host.querySelector('[data-testid="empty-preview"]')?.textContent).toContain('No members yet');

    page.viewState.set('error');
    fixture.detectChanges();
    expect(host.querySelector('[data-testid="members-error"]')).not.toBeNull();
    expect(host.querySelector('[role="alert"]')).not.toBeNull();

    page.viewState.set('loaded');
    fixture.detectChanges();
    expect(host.querySelector('[data-testid="member-row-member-ada-okafor"]')).not.toBeNull();
  });

  it('filters deterministically by search across names and emails', () => {
    const { fixture, host } = setup();
    const page = fixture.componentInstance as unknown as {
      filterForm: { controls: { search: { setValue: (value: string) => void } } };
    };
    expect(filterMembers(EXAMPLE_MEMBERS, 'ada', 'All', 'All').map((m) => m.id)).toEqual(['member-ada-okafor']);

    page.filterForm.controls.search.setValue('ada');
    fixture.detectChanges();
    expect(host.querySelector('[data-testid="member-row-member-ada-okafor"]')).not.toBeNull();
    expect(host.querySelector('[data-testid="member-row-member-bo-lindqvist"]')).toBeNull();
    expect(countText(host)).toContain('Showing 1–1 of 1 members');

    page.filterForm.controls.search.setValue('EXAMPLE.COM');
    fixture.detectChanges();
    expect(countText(host)).toContain('of 8 members');
  });

  it('filters by status and role with observable outcomes', () => {
    const { fixture, host } = setup();
    expect(filterMembers(EXAMPLE_MEMBERS, '', 'Invited', 'All').map((m) => m.id)).toEqual([
      'member-catarina-m-reyes-almeida',
      'member-finn-osei',
    ]);

    setHostSelect(host, 'status-filter', 'Invited');
    fixture.detectChanges();
    expect(countText(host)).toContain('Showing 1–2 of 2 members');
    expect(host.querySelector('[data-testid="member-row-member-catarina-m-reyes-almeida"]')).not.toBeNull();
    expect(host.querySelector('[data-testid="member-row-member-finn-osei"]')).not.toBeNull();
    expect(host.querySelector('[data-testid="member-row-member-ada-okafor"]')).toBeNull();

    setHostSelect(host, 'role-filter', 'Admin');
    fixture.detectChanges();
    expect(countText(host)).toContain('Showing 0 members');
    expect(host.querySelector('[data-testid="no-results"]')).not.toBeNull();
  });

  it('resets to the first page when filters invalidate the current page', () => {
    const { fixture, host } = setup();
    const page = fixture.componentInstance as unknown as {
      filterForm: { controls: { search: { setValue: (value: string) => void } } };
    };

    (host.querySelector('[data-testid="members-page-3"]') as HTMLButtonElement).click();
    fixture.detectChanges();
    expect(countText(host)).toContain('Page 3 of 3');
    expect(host.querySelector('[data-testid="member-row-member-grace-nguyen-halvorsen"]')).not.toBeNull();

    page.filterForm.controls.search.setValue('ada');
    fixture.detectChanges();
    expect(countText(host)).toContain('Showing 1–1 of 1 members');
    expect(countText(host)).toContain('Page 1 of 1');
    expect(host.querySelector('[data-testid="member-row-member-ada-okafor"]')).not.toBeNull();
  });

  it('pages deterministically with announced current state', () => {
    const { fixture, host } = setup();

    expect(host.querySelector('[data-testid="members-page-1"]')?.getAttribute('aria-current')).toBe('page');
    (host.querySelector('[data-testid="members-next"]') as HTMLButtonElement).click();
    fixture.detectChanges();
    expect(countText(host)).toContain('Showing 4–6 of 8 members');
    expect(countText(host)).toContain('Page 2 of 3');
    expect(host.querySelector('[data-testid="member-row-member-dev-patel"]')).not.toBeNull();
    expect(host.querySelector('[data-testid="member-row-member-elsa-moreau"]')).not.toBeNull();
    expect(host.querySelector('[data-testid="member-row-member-finn-osei"]')).not.toBeNull();
    expect(host.querySelector('[data-testid="members-page-2"]')?.getAttribute('aria-current')).toBe('page');

    (host.querySelector('[data-testid="members-next"]') as HTMLButtonElement).click();
    fixture.detectChanges();
    expect(countText(host)).toContain('Showing 7–8 of 8 members');
    expect((host.querySelector('[data-testid="members-next"]') as HTMLButtonElement).disabled).toBeTrue();

    (host.querySelector('[data-testid="members-previous"]') as HTMLButtonElement).click();
    fixture.detectChanges();
    expect(countText(host)).toContain('Page 2 of 3');
  });

  it('invites a teammate through a validated dialog with one visible outcome', async () => {
    const { fixture, host } = setup();

    (host.querySelector('[data-testid="invite-member"]') as HTMLButtonElement).click();
    await settle(fixture);

    expect(overlayPane()?.textContent).toContain('Invite teammate');
    expect(overlayPane()?.contains(document.activeElement))
      .withContext('focus is moved into the invite dialog')
      .toBeTrue();

    overlayButton('Send invite')?.click();
    await settle(fixture);
    expect(overlayPane()?.querySelector('[data-testid="invite-name-error"]')?.textContent).toContain('full name');
    expect(overlayPane()?.querySelector('[data-testid="invite-email-error"]')?.textContent).toContain('work email');
    expect(overlayPane()).not.toBeNull('dialog stays open on validation failure');
    expect(host.querySelector('[data-testid="member-outcome"]')).toBeNull();

    setOverlayInput('invite-name', 'Ivy Chen');
    setOverlayInput('invite-email', 'not-an-email');
    setOverlaySelect('invite-role', 'Admin');
    overlayButton('Send invite')?.click();
    await settle(fixture);
    expect(overlayPane()?.querySelector('[data-testid="invite-email-error"]')?.textContent).toContain('valid email');

    setOverlayInput('invite-email', 'ivy.chen@example.com');
    overlayButton('Send invite')?.click();
    await settle(fixture);

    const closed = await waitForOverlayGone(fixture);
    expect(closed).withContext('invite dialog closes after a valid submit').toBeTrue();
    expect(overlayPane()).toBeNull();
    const outcomes = host.querySelectorAll('[data-testid="member-outcome"]');
    expect(outcomes.length).toBe(1);
    expect(outcomes[0].textContent).toContain('Ivy Chen invited as Admin');
    expect(outcomes[0].textContent).toContain('Invited status');
    expect(countText(host)).toContain('of 9 members');
    // The new member lands on the last page and is visible there.
    expect(host.querySelector('[data-testid^="member-row-member-ivy-chen"]')).not.toBeNull();
    expect(host.querySelector('[data-testid="undo-remove"]')).toBeNull();
  });

  it('records no invitation when the invite dialog is cancelled', async () => {
    const { fixture, host } = setup();

    (host.querySelector('[data-testid="invite-member"]') as HTMLButtonElement).click();
    await settle(fixture);

    setOverlayInput('invite-name', 'Cancelled Guest');
    overlayButton('Cancel')?.click();
    await settle(fixture);

    expect(await waitForOverlayGone(fixture))
      .withContext('cancelled invite dialog closes')
      .toBeTrue();
    expect(overlayPane()).toBeNull();
    expect(host.querySelector('[data-testid="member-outcome"]')).toBeNull();
    expect(countText(host)).toContain('of 8 members');
  });

  it('shows member details through the row menu dialog with a visible outcome', async () => {
    const { fixture, host } = setup();

    await openRowMenu(fixture, host, 'member-bo-lindqvist');
    const details = overlayButton('View details');
    expect(details).withContext('menu offers View details').not.toBeNull();
    details!.click();
    await settle(fixture);
    expect(host.querySelector('[data-testid="member-details"]')?.textContent).toContain(
      'Bo Lindqvist · bo.lindqvist@example.com · Member · Active',
    );
  });

  it('changes a role through the row menu dialog with a visible outcome', async () => {
    const { fixture, host } = setup();

    await openRowMenu(fixture, host, 'member-bo-lindqvist');
    overlayButton('Change role')!.click();
    await settle(fixture);

    const dialog = overlayPaneContaining('Change role for Bo Lindqvist');
    expect(dialog).withContext('role dialog opens from the menu').not.toBeNull();
    expect(dialog?.contains(document.activeElement)).withContext('focus is moved into the role dialog').toBeTrue();
    setOverlaySelect('role-select', 'Admin');
    overlayDialogButton('Change role for Bo Lindqvist', 'Save role')!.click();
    await settle(fixture);

    expect(overlayPaneContaining('Change role for Bo Lindqvist')).withContext('role dialog closes').toBeNull();
    const outcomes = host.querySelectorAll('[data-testid="member-outcome"]');
    expect(outcomes.length).toBe(1);
    expect(outcomes[0].textContent).toContain('Bo Lindqvist is now Admin');
    expect(host.querySelector('[data-testid="member-row-member-bo-lindqvist"]')?.textContent).toContain('Admin');
  });

  it('keeps the member when destructive confirmation is rejected', async () => {
    const { fixture, host } = setup();
    const confirmation = mockConfirmation(Promise.resolve(false));

    await openRowMenu(fixture, host, 'member-bo-lindqvist');
    overlayButton('Remove')!.click();
    await settle(fixture);

    expect(confirmation).toHaveBeenCalled();
    expect(host.querySelector('[data-testid="member-row-member-bo-lindqvist"]')).not.toBeNull(
      'rejected confirmation keeps the member',
    );
    expect(host.querySelector('[data-testid="member-outcome"]')).toBeNull();
    expect(countText(host)).toContain('of 8 members');
  });

  it('removes on confirmation with a visible single-use undo outcome', async () => {
    const { fixture, host } = setup();
    const confirmation = mockConfirmation(Promise.resolve(true));

    await openRowMenu(fixture, host, 'member-bo-lindqvist');
    overlayButton('Remove')!.click();
    await settle(fixture);

    expect(confirmation).toHaveBeenCalled();

    expect(host.querySelector('[data-testid="member-row-member-bo-lindqvist"]')).toBeNull();
    expect(countText(host)).toContain('of 7 members');
    const outcome = host.querySelector('[data-testid="member-outcome"]');
    expect(outcome?.textContent).toContain('Bo Lindqvist removed');
    expect(outcome?.textContent).toContain('Undo restores this local member once');
    expect(outcome?.textContent).not.toContain('30 days');

    (host.querySelector('[data-testid="undo-remove"]') as HTMLButtonElement).click();
    fixture.detectChanges();
    expect(host.querySelector('[data-testid="member-row-member-bo-lindqvist"]')).not.toBeNull();
    expect(countText(host)).toContain('of 8 members');
    expect(host.querySelector('[data-testid="member-outcome"]')?.textContent).toContain(
      'Bo Lindqvist restored with Member access',
    );
    expect(host.querySelector('[data-testid="undo-remove"]')).toBeNull('undo is single-use');
  });

  it('keeps empty-dataset and no-results states distinct with their own recovery', async () => {
    const { fixture, host } = setup();
    const page = fixture.componentInstance as unknown as {
      members: { set: (members: readonly unknown[]) => void };
      filterForm: { controls: { search: { setValue: (value: string) => void } } };
      reload: () => Promise<void>;
    };

    page.filterForm.controls.search.setValue('zzz-no-such-member');
    fixture.detectChanges();
    const noResults = host.querySelector('[data-testid="no-results"]');
    expect(noResults).not.toBeNull();
    expect(noResults?.textContent).toContain('No members match these filters');
    expect(host.querySelector('[data-testid="empty-members"]')).toBeNull();
    expect(countText(host)).toContain('Showing 0 members');

    (host.querySelector('[data-testid="clear-filters"]') as HTMLButtonElement).click();
    fixture.detectChanges();
    expect(host.querySelector('[data-testid="no-results"]')).toBeNull();
    expect(countText(host)).toContain('of 8 members');

    page.members.set([]);
    fixture.detectChanges();
    const empty = host.querySelector('[data-testid="empty-members"]');
    expect(empty).not.toBeNull();
    expect(empty?.textContent).toContain('Workspace member list is empty');
    expect(empty?.textContent).not.toContain('No members match these filters');
    expect(host.querySelector('[data-testid="no-results"]')).toBeNull();

    (host.querySelector('[data-testid="invite-empty"]') as HTMLButtonElement).click();
    await settle(fixture);
    expect(overlayPane()?.textContent).toContain('Invite teammate');
    overlayButton('Cancel')?.click();
    await settle(fixture);

    await page.reload();
    fixture.detectChanges();
    expect(host.querySelector('[data-testid="empty-members"]')).toBeNull();
    expect(countText(host)).toContain('of 8 members');
  });

  it('blocks every mutation path in read-only preview with an explanation', async () => {
    const { fixture, host } = setup();
    const page = fixture.componentInstance as unknown as {
      readOnly: { set: (value: boolean) => void };
      inviteMember: () => void;
      openRoleDialog: (member: { id: string }) => void;
      requestRemove: (member: { id: string }) => Promise<void>;
    };
    page.readOnly.set(true);
    fixture.detectChanges();

    expect((host.querySelector('[data-testid="invite-member"]') as HTMLButtonElement).disabled).toBeTrue();
    expect(
      (host.querySelector('[data-testid="menu-table-member-ada-okafor"]') as HTMLButtonElement).disabled,
    ).toBeFalse();
    expect(host.textContent).toContain('Read-only preview');

    // Alternate paths cannot invoke mutations even when called directly.
    page.inviteMember();
    page.openRoleDialog({ id: 'member-ada-okafor' });
    await page.requestRemove({ id: 'member-ada-okafor' });
    await settle(fixture);
    expect(overlayPane()).toBeNull('no dialog opens from a read-only mutation path');
    expect(host.querySelector('[data-testid="member-outcome"]')).toBeNull();
    expect(countText(host)).toContain('of 8 members');
  });

  it('uses one selectable roster and one pager with the same member presentation', () => {
    const { host } = setup();
    expect(host.querySelectorAll('eg-data-table').length).toBe(1);
    expect(host.querySelectorAll('nav[aria-label="Member pages"]').length).toBe(1);
    expect(host.querySelector('eg-data-table-pagination')).toBeNull();
    for (const member of EXAMPLE_MEMBERS.slice(0, 3)) {
      const card = host.querySelector(`[data-testid="member-row-${member.id}"]`);
      expect(card).withContext(`presentation for ${member.id}`).not.toBeNull();
      expect(card?.querySelector('h3')?.textContent).toContain(member.name);
      expect(card?.textContent).toContain(member.role);
      expect(card?.textContent).toContain(member.status);
      expect(host.querySelector(`[data-testid="menu-table-${member.id}"]`)).not.toBeNull();
    }
  });

  it('reloads through the deterministic simulator, honoring simulated failure', async () => {
    const { fixture, host } = setup();
    const page = fixture.componentInstance as unknown as {
      simulateFailure: { set: (value: boolean) => void };
      reload: () => Promise<void>;
    };
    page.simulateFailure.set(true);
    await page.reload();
    fixture.detectChanges();
    expect(host.querySelector('[data-testid="members-error"]')).not.toBeNull();
    expect(host.querySelector('[role="alert"]')?.textContent).toContain('Members failed to load');

    (host.querySelector('[data-testid="retry-load"]') as HTMLButtonElement).click();
    page.simulateFailure.set(false);
    await page.reload();
    fixture.detectChanges();
    expect(host.querySelector('[data-testid="member-row-member-hugo-stein"]') === null)
      .withContext('retry lands on the first page after reload')
      .toBeTrue();
    expect(host.querySelector('[data-testid="member-row-member-ada-okafor"]')).not.toBeNull();
  });
});
