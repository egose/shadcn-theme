import { BreakpointObserver, type BreakpointState } from '@angular/cdk/layout';
import { provideZonelessChangeDetection, type WritableSignal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';
import { BehaviorSubject, Subject, of } from 'rxjs';
import { HlmDialogService } from '@egose/shadcn-theme-ng/dialog';
import { TeamManagementExamplePage } from './team-management';
import { EXAMPLE_MEMBERS } from './team-management-fixtures';
import type { InviteMemberResult, MemberRole, RoleChangeResult, TeamMember } from './team-management-types';
import type { ExampleViewState } from '../../../shared/real-examples/example-view-state';

interface PageActions {
  members: WritableSignal<readonly TeamMember[]>;
  readOnly: WritableSignal<boolean>;
  viewState: WritableSignal<ExampleViewState>;
  simulateFailure: WritableSignal<boolean>;
  bulkRole: FormControl<MemberRole>;
  filterForm: FormGroup<{ search: FormControl<string> }>;
  selectedMembers(): readonly TeamMember[];
  inviteMember(): void;
  openRoleDialog(member: TeamMember): void;
  requestRemove(member: TeamMember): Promise<void>;
  undoRemove(): void;
  showDetails(member: TeamMember): void;
  changeSelectedRoles(): Promise<void>;
  retryBulk(): Promise<void>;
  reload(): Promise<void>;
  resetFixtures(): void;
  setReadOnly(value: boolean): void;
  setViewState(value: ExampleViewState): void;
}

describe('Team member sessions and stable-ID bulk workflows', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection(), provideRouter([])],
    }).compileComponents();
  });
  afterEach(() => document.querySelector('.cdk-overlay-container')?.remove());

  function setup(narrow = false) {
    const layout = new BehaviorSubject<BreakpointState>({ matches: narrow, breakpoints: {} });
    spyOn(TestBed.inject(BreakpointObserver), 'observe').and.returnValue(layout);
    const fixture = TestBed.createComponent(TeamManagementExamplePage);
    const host = fixture.nativeElement as HTMLElement;
    const page = fixture.componentInstance as unknown as PageActions;
    fixture.detectChanges();
    const element = <T extends HTMLElement = HTMLElement>(selector: string): T => {
      const result = host.querySelector<T>(selector);
      expect(result).withContext(selector).not.toBeNull();
      return result!;
    };
    const render = async () => {
      fixture.detectChanges();
      await fixture.whenStable();
      fixture.detectChanges();
    };
    const settle = async () => {
      await new Promise((resolve) => setTimeout(resolve, 180));
      await render();
    };
    const click = async (id: string) => {
      element<HTMLButtonElement>(`[data-testid="${id}"]`).click();
      await render();
    };
    const select = async (index = 0) => {
      const boxes = host.querySelectorAll<HTMLElement>('eg-table-row-selection [role="checkbox"]');
      expect(boxes.length).toBeGreaterThan(index);
      boxes[index].click();
      await render();
    };
    const search = async (value: string) => {
      const input = element<HTMLInputElement>('#member-search');
      input.value = value;
      input.dispatchEvent(new Event('input', { bubbles: true }));
      await render();
    };
    const role = (id: string) => page.members().find((member) => member.id === id)?.role;
    return { fixture, host, page, layout, element, render, settle, click, select, search, role };
  }

  function confirmation() {
    const modal = dialog<boolean>();
    return { ...modal, resolve: (value: boolean) => modal.closed.next(value) };
  }

  function acceptConfirmation() {
    return spyOn(TestBed.inject(HlmDialogService), 'open').and.returnValue({
      closed$: of(true),
      close: jasmine.createSpy('close'),
    } as unknown as ReturnType<HlmDialogService['open']>);
  }

  function dialog<T>() {
    const closed = new Subject<T | null>();
    const close = jasmine.createSpy('close');
    const spy = spyOn(TestBed.inject(HlmDialogService), 'open').and.returnValue({
      closed$: closed.asObservable(),
      close,
    } as unknown as ReturnType<HlmDialogService['open']>);
    return { closed, close, spy };
  }

  const invited: InviteMemberResult = { name: '  Ivy Chen  ', email: '  IVY@example.com  ', role: 'Admin' };
  const boundaries = ['readonly', 'preview', 'reset', 'reload', 'destroy'] as const;
  function boundary(ui: ReturnType<typeof setup>, kind: (typeof boundaries)[number]) {
    if (kind === 'readonly') {
      ui.page.setReadOnly(true);
      ui.page.setReadOnly(false);
    }
    if (kind === 'preview') {
      ui.page.setViewState('empty');
      ui.page.setViewState('loaded');
    }
    if (kind === 'reset') ui.page.resetFixtures();
    if (kind === 'reload') void ui.page.reload();
    if (kind === 'destroy') ui.fixture.destroy();
  }

  for (const kind of boundaries) {
    for (const mutation of ['invite', 'role', 'remove'] as const) {
      it(`ignores delayed ${mutation} results after ${kind}, including permission/preview round trips`, async () => {
        const ui = setup();
        const modal = mutation === 'remove' ? null : dialog<InviteMemberResult | RoleChangeResult>();
        const confirm = mutation === 'remove' ? confirmation() : null;
        let pending: Promise<void> | undefined;
        if (mutation === 'invite') ui.page.inviteMember();
        if (mutation === 'role') ui.page.openRoleDialog(EXAMPLE_MEMBERS[1]);
        if (mutation === 'remove') pending = ui.page.requestRemove(EXAMPLE_MEMBERS[1]);
        boundary(ui, kind);
        modal?.closed.next(mutation === 'invite' ? invited : { role: 'Admin' });
        confirm?.resolve(true);
        await pending;
        await new Promise((resolve) => setTimeout(resolve, 180));
        expect(ui.page.members()).toEqual(EXAMPLE_MEMBERS);
        if (modal) expect(modal.close).toHaveBeenCalled();
        if (kind !== 'destroy') {
          await ui.render();
          expect(ui.host.querySelector('[data-testid="member-outcome"]')).toBeNull();
        }
      });
    }
  }

  it('serializes dialogs, takes one result, normalizes at commit, and rejects a forged duplicate', async () => {
    const ui = setup();
    const modal = dialog<InviteMemberResult>();
    ui.page.inviteMember();
    ui.page.inviteMember();
    ui.page.openRoleDialog(EXAMPLE_MEMBERS[0]);
    expect(modal.spy).toHaveBeenCalledTimes(1);
    modal.closed.next(invited);
    modal.closed.next(invited);
    await ui.render();
    expect(ui.page.members().length).toBe(9);
    expect(ui.page.members().at(-1)).toEqual(jasmine.objectContaining({ name: 'Ivy Chen', email: 'ivy@example.com' }));
    ui.page.inviteMember();
    modal.closed.next({ ...invited, email: ' ADA.OKAFOR@EXAMPLE.COM ' });
    expect(ui.page.members().length).toBe(9);
  });

  for (const mutation of ['role', 'remove'] as const) {
    it(`rejects a stale ${mutation} confirmation when the target was replaced`, async () => {
      const ui = setup();
      const modal = mutation === 'role' ? dialog<RoleChangeResult>() : null;
      const confirm = mutation === 'remove' ? confirmation() : null;
      const pending = mutation === 'remove' ? ui.page.requestRemove(EXAMPLE_MEMBERS[1]) : undefined;
      if (modal) ui.page.openRoleDialog(EXAMPLE_MEMBERS[1]);
      ui.page.members.set(
        EXAMPLE_MEMBERS.map((member) => (member.id === EXAMPLE_MEMBERS[1].id ? { ...member, role: 'Viewer' } : member)),
      );
      modal?.closed.next({ role: 'Admin' });
      confirm?.resolve(true);
      await pending;
      await ui.render();
      expect(ui.role(EXAMPLE_MEMBERS[1].id)).toBe('Viewer');
      expect(ui.host.querySelector('[data-testid="member-outcome"]')).toBeNull();
    });
  }

  it('clamps the last page after removal, preserves filters and uses single-use local undo', async () => {
    const ui = setup();
    acceptConfirmation();
    await ui.click('members-page-3');
    await ui.page.requestRemove(EXAMPLE_MEMBERS[7]);
    await ui.page.requestRemove(EXAMPLE_MEMBERS[6]);
    await ui.render();
    expect(ui.element('[data-testid="member-count"]').textContent).toContain('Page 2 of 2');
    ui.page.showDetails(EXAMPLE_MEMBERS[0]);
    ui.page.undoRemove();
    ui.page.undoRemove();
    await ui.render();
    expect(ui.page.members().length).toBe(7);
    expect(ui.page.members().filter((member) => member.id === EXAMPLE_MEMBERS[6].id).length).toBe(1);
    expect(ui.host.querySelector('[data-testid="undo-remove"]')).toBeNull();
    await ui.search('ada');
    await ui.page.requestRemove(EXAMPLE_MEMBERS[0]);
    ui.page.undoRemove();
    await ui.render();
    expect(ui.element<HTMLInputElement>('#member-search').value).toBe('ada');
    expect(ui.element('[data-testid="member-count"]').textContent).toContain('of 1 members');
  });

  for (const kind of boundaries) {
    it(`expires undo on ${kind}`, async () => {
      const ui = setup();
      acceptConfirmation();
      await ui.page.requestRemove(EXAMPLE_MEMBERS[1]);
      boundary(ui, kind);
      const before = ui.page.members();
      ui.page.undoRemove();
      expect(ui.page.members()).toBe(before);
    });
  }

  it('does not duplicate an ID or email via undo after a conflicting refresh', async () => {
    const ui = setup();
    acceptConfirmation();
    await ui.page.requestRemove(EXAMPLE_MEMBERS[1]);
    ui.page.members.set([
      ...ui.page.members(),
      { ...EXAMPLE_MEMBERS[1], id: 'replacement', email: EXAMPLE_MEMBERS[1].email.toUpperCase() },
    ]);
    ui.page.undoRemove();
    expect(ui.page.members().length).toBe(8);
    expect(ui.page.members().some((member) => member.id === EXAMPLE_MEMBERS[1].id)).toBeFalse();
  });

  it('keeps details available in readonly menus while mutation items are disabled', async () => {
    const ui = setup(true);
    ui.page.setReadOnly(true);
    await ui.render();
    await ui.click(`menu-table-${EXAMPLE_MEMBERS[0].id}`);
    await ui.settle();
    const buttons = Array.from(document.querySelectorAll<HTMLButtonElement>('.cdk-overlay-pane button'));
    const details = buttons.find((button) => button.textContent?.trim() === 'View details')!;
    expect(details.disabled).toBeFalse();
    expect(buttons.find((button) => button.textContent?.trim() === 'Change role')!.disabled).toBeTrue();
    expect(buttons.find((button) => button.textContent?.trim() === 'Remove')!.disabled).toBeTrue();
    details.click();
    await ui.settle();
    expect(ui.element('[data-testid="member-details"]').textContent).toContain('Ada Okafor');
    expect(ui.page.members()).toEqual(EXAMPLE_MEMBERS);
  });

  it('selects stable IDs across sorting, source reordering, immutable refresh and table/grid layouts', async () => {
    const ui = setup();
    await ui.select(1);
    expect(ui.page.selectedMembers().map((member) => member.id)).toEqual([EXAMPLE_MEMBERS[1].id]);
    ui.element<HTMLButtonElement>('button[aria-label="Sort by name"]').click();
    await ui.render();
    ui.element<HTMLButtonElement>('button[aria-label="Sort by name"]').click();
    await ui.render();
    ui.page.members.set(
      [EXAMPLE_MEMBERS[2], EXAMPLE_MEMBERS[0], EXAMPLE_MEMBERS[1], ...EXAMPLE_MEMBERS.slice(3)].map((member) => ({
        ...member,
      })),
    );
    await ui.render();
    expect(ui.page.selectedMembers().map((member) => member.id)).toEqual([EXAMPLE_MEMBERS[1].id]);
    expect(ui.element('[data-state="selected"]').textContent).toContain('Bo Lindqvist');
    ui.layout.next({ matches: true, breakpoints: {} });
    await ui.render();
    expect(ui.host.querySelector('table')).toBeNull();
    expect(ui.element('[data-state="selected"]').textContent).toContain('Bo Lindqvist');
    const confirm = confirmation();
    const pending = ui.page.changeSelectedRoles();
    confirm.resolve(true);
    await pending;
    await ui.render();
    expect(ui.role(EXAMPLE_MEMBERS[1].id)).toBe('Viewer');
    expect(ui.role(EXAMPLE_MEMBERS[0].id)).toBe('Admin');
    expect(ui.role(EXAMPLE_MEMBERS[2].id)).toBe('Member');
    expect(ui.page.selectedMembers()).toEqual([]);
    expect(ui.element(`[data-testid="member-row-${EXAMPLE_MEMBERS[1].id}"]`).textContent).toContain('Viewer');
  });

  it('drops filtered/paged-out IDs instead of transferring or restoring their selection', async () => {
    const ui = setup();
    await ui.select(0);
    await ui.select(1);
    await ui.search('bo');
    expect(ui.page.selectedMembers().map((member) => member.id)).toEqual([EXAMPLE_MEMBERS[1].id]);
    await ui.search('');
    expect(ui.page.selectedMembers().map((member) => member.id)).toEqual([EXAMPLE_MEMBERS[1].id]);
    await ui.click('members-next');
    expect(ui.page.selectedMembers()).toEqual([]);
    await ui.click('members-previous');
    expect(ui.page.selectedMembers()).toEqual([]);
    expect(ui.host.querySelector('[data-state="selected"]')).toBeNull();
  });

  it('requires a nonempty selection and preserves it on cancelled confirmation', async () => {
    const ui = setup();
    const confirm = confirmation();
    await ui.page.changeSelectedRoles();
    expect(confirm.spy).not.toHaveBeenCalled();
    expect(ui.element<HTMLButtonElement>('[data-testid="bulk-change"]').disabled).toBeTrue();
    await ui.select();
    const pending = ui.page.changeSelectedRoles();
    expect((confirm.spy.calls.mostRecent().args[1]?.context as { description: string }).description).toContain(
      EXAMPLE_MEMBERS[0].id,
    );
    confirm.resolve(false);
    await pending;
    await ui.render();
    expect(ui.page.members()).toEqual(EXAMPLE_MEMBERS);
    expect(ui.page.selectedMembers()).toEqual([EXAMPLE_MEMBERS[0]]);
    expect(ui.host.querySelector('[data-testid="member-outcome"]')).toBeNull();
  });

  it('fails without partial writes, retries the exact confirmed IDs once and displays refreshed roles', async () => {
    const ui = setup();
    const confirm = acceptConfirmation();
    await ui.select(0);
    await ui.select(1);
    ui.page.simulateFailure.set(true);
    const pending = ui.page.changeSelectedRoles();
    await Promise.resolve();
    await ui.render();
    expect(ui.host.querySelector('[data-testid="bulk-pending"]')).not.toBeNull();
    await ui.page.changeSelectedRoles();
    await ui.page.retryBulk();
    expect(confirm).toHaveBeenCalledTimes(1);
    await pending;
    await ui.render();
    expect(ui.page.members()).toEqual(EXAMPLE_MEMBERS);
    expect(ui.element('[data-testid="bulk-error"]').textContent).toContain('No members changed');
    expect(ui.page.selectedMembers().length).toBe(2);
    ui.page.simulateFailure.set(false);
    await ui.click('bulk-retry');
    await ui.page.retryBulk();
    await ui.settle();
    expect(confirm).toHaveBeenCalledTimes(1);
    expect(ui.role(EXAMPLE_MEMBERS[0].id)).toBe('Viewer');
    expect(ui.role(EXAMPLE_MEMBERS[1].id)).toBe('Viewer');
    expect(ui.page.members().slice(2)).toEqual(EXAMPLE_MEMBERS.slice(2));
    expect(ui.host.querySelectorAll('[data-testid="member-outcome"]').length).toBe(1);
    expect(ui.element('[data-testid="member-outcome"]').textContent).toContain('2 selected members');
    expect(ui.host.querySelector('[data-testid="bulk-retry"]')).toBeNull();
    await ui.page.retryBulk();
    expect(ui.page.selectedMembers()).toEqual([]);
  });

  for (const phase of ['confirmation', 'save-success', 'save-failure'] as const) {
    for (const kind of boundaries) {
      it(`suppresses bulk ${phase} after ${kind}`, async () => {
        const ui = setup();
        const confirm = confirmation();
        await ui.select(1);
        ui.page.simulateFailure.set(phase === 'save-failure');
        const pending = ui.page.changeSelectedRoles();
        if (phase !== 'confirmation') {
          confirm.resolve(true);
          await Promise.resolve();
          await ui.render();
        }
        boundary(ui, kind);
        if (phase === 'confirmation') confirm.resolve(true);
        await pending;
        await new Promise((resolve) => setTimeout(resolve, 180));
        expect(ui.page.members()).toEqual(EXAMPLE_MEMBERS);
        if (kind !== 'destroy') {
          await ui.render();
          expect(ui.host.querySelector('[data-testid="member-outcome"]')).toBeNull();
          expect(ui.host.querySelector('[data-testid="bulk-error"]')).toBeNull();
          expect(ui.page.selectedMembers()).toEqual([]);
        }
      });
    }
  }

  for (const change of ['selection', 'filter', 'page', 'role', 'refresh'] as const) {
    for (const phase of ['confirmation', 'save'] as const) {
      it(`rejects bulk ${phase} after a ${change} change`, async () => {
        const ui = setup();
        const confirm = confirmation();
        await ui.select(1);
        const pending = ui.page.changeSelectedRoles();
        if (phase === 'save') {
          confirm.resolve(true);
          await Promise.resolve();
          await ui.render();
        }
        if (change === 'selection') await ui.select(0);
        if (change === 'filter') await ui.search('bo');
        if (change === 'page') await ui.click('members-next');
        if (change === 'role') ui.page.bulkRole.setValue('Admin');
        if (change === 'refresh') {
          ui.page.members.set(EXAMPLE_MEMBERS.map((member) => ({ ...member })));
          await ui.render();
        }
        if (phase === 'confirmation') confirm.resolve(true);
        await pending;
        await ui.render();
        if (phase === 'confirmation' && change !== 'refresh') expect(confirm.close).toHaveBeenCalled();
        expect(ui.page.members()).toEqual(EXAMPLE_MEMBERS);
        expect(ui.host.querySelector('[data-testid="member-outcome"]')).toBeNull();
        expect(ui.host.querySelector('[data-testid="bulk-retry"]')).toBeNull();
      });
    }
  }

  it('invalidates failed retries when the confirmed selection changes', async () => {
    const ui = setup();
    acceptConfirmation();
    await ui.select(1);
    ui.page.simulateFailure.set(true);
    await ui.page.changeSelectedRoles();
    ui.page.simulateFailure.set(false);
    await ui.select(0);
    await ui.page.retryBulk();
    await ui.render();
    expect(ui.page.members()).toEqual(EXAMPLE_MEMBERS);
    expect(ui.host.querySelector('[data-testid="bulk-retry"]')).toBeNull();
  });

  it('makes reload latest-wins and suppresses both stale reload success and failure', async () => {
    const ui = setup();
    await ui.select();
    ui.page.simulateFailure.set(true);
    const first = ui.page.reload();
    ui.page.simulateFailure.set(false);
    const second = ui.page.reload();
    await Promise.all([first, second]);
    await ui.render();
    expect(ui.page.viewState()).toBe('loaded');
    expect(ui.page.selectedMembers()).toEqual([]);
    const stale = ui.page.reload();
    ui.page.resetFixtures();
    ui.page.members.set(EXAMPLE_MEMBERS.slice(1));
    await stale;
    await ui.render();
    expect(ui.page.members()).toEqual(EXAMPLE_MEMBERS.slice(1));
  });

  for (const failure of [false, true]) {
    it(`cancels reload ${failure ? 'failure' : 'success'} on readonly without leaving a false loading state`, async () => {
      const ui = setup();
      ui.page.members.set(EXAMPLE_MEMBERS.slice(1));
      ui.page.simulateFailure.set(failure);
      const pending = ui.page.reload();
      ui.page.setReadOnly(true);
      await pending;
      await ui.render();
      expect(ui.page.members()).toEqual(EXAMPLE_MEMBERS.slice(1));
      expect(ui.page.viewState()).toBe('loaded');
      expect(ui.host.querySelector('[data-testid="members-loading"]')).toBeNull();
      expect(ui.element('[data-testid="member-session-notice"]').textContent).toContain('cancelled');
    });
  }

  it('keeps phone selection, pending, failure, retry, readonly details and one pager operable', async () => {
    const ui = setup(true);
    ui.host.style.cssText = 'display:block;width:280px;position:absolute;top:0;left:0;';
    const check = () => {
      expect(ui.host.scrollWidth).toBeLessThanOrEqual(281);
      expect(ui.host.querySelectorAll('h2').length).toBe(1);
      expect(ui.host.querySelector('table')).toBeNull();
      expect(ui.host.querySelectorAll('nav[aria-label="Member pages"]').length).toBe(1);
      expect(ui.host.querySelector('eg-data-table-pagination')).toBeNull();
    };
    await ui.render();
    check();
    await ui.select(2);
    check();
    acceptConfirmation();
    ui.page.simulateFailure.set(true);
    const pending = ui.page.changeSelectedRoles();
    await Promise.resolve();
    await ui.render();
    check();
    await pending;
    await ui.render();
    check();
    ui.page.simulateFailure.set(false);
    await ui.page.retryBulk();
    await ui.settle();
    check();
    expect(document.activeElement).toBe(ui.element('[data-testid="member-outcome"]'));
    ui.page.setReadOnly(true);
    await ui.render();
    ui.page.showDetails(ui.page.members()[2]);
    await ui.render();
    check();
    expect(ui.element('[data-testid="member-details"]').textContent).toContain('Catarina');
    await ui.click('members-next');
    check();
  });
});
