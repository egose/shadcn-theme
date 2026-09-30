import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Subject } from 'rxjs';
import { HlmDialogService } from '@egose/shadcn-theme-ng/dialog';
import { SettingsExamplePage } from './settings';
import { EXAMPLE_SETTINGS } from './settings-fixtures';
import type { SettingsSnapshot } from './settings-types';

type PageActions = {
  confirm(context: { title: string; description: string }): Promise<boolean>;
  save(): Promise<void>;
  reload(): Promise<void>;
  recover(): void;
  discardChanges(): Promise<void>;
  leaveWorkspace(): Promise<void>;
  deleteWorkspace(): void;
  canDeactivate(): Promise<boolean>;
  snapshot(): SettingsSnapshot;
  saveState(): string;
  terminal(): string | null;
  viewState(): string;
};

describe('Settings rendered session interleavings', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] }).compileComponents();
  });
  afterEach(() => document.querySelector('.cdk-overlay-container')?.remove());

  function setup() {
    const fixture = TestBed.createComponent(SettingsExamplePage);
    const host = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
    const element = <T extends HTMLElement = HTMLElement>(selector: string): T => {
      const result = host.querySelector<T>(selector);
      expect(result).withContext(selector).not.toBeNull();
      return result!;
    };
    const input = (id: string, value: string) => {
      const control = element<HTMLInputElement | HTMLSelectElement>(`#${id}`);
      control.value = value;
      control.dispatchEvent(new Event(control.tagName === 'SELECT' ? 'change' : 'input', { bubbles: true }));
      control.dispatchEvent(new Event('blur'));
      fixture.detectChanges();
    };
    const click = (id: string) => {
      const button = element<HTMLButtonElement>(`[data-testid="${id}"]`);
      expect(button.disabled).withContext(id).toBeFalse();
      button.click();
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
      input,
      click,
      checkbox,
      settle,
      page: fixture.componentInstance as unknown as PageActions,
      draft: () => element<HTMLInputElement>('#profile-display-name').value,
    };
  }

  function delayedConfirmation(page: PageActions) {
    let resolve!: (value: boolean) => void;
    const answer = new Promise<boolean>((done) => {
      resolve = done;
    });
    const spy = spyOn(page, 'confirm').and.returnValue(answer);
    return { resolve, spy };
  }

  function delayedDeletion() {
    const closed = new Subject<string | null>();
    const close = jasmine.createSpy('close');
    const spy = spyOn(TestBed.inject(HlmDialogService), 'open').and.returnValue({
      closed$: closed.asObservable(),
      close,
    } as unknown as ReturnType<HlmDialogService['open']>);
    return { closed, close, spy };
  }

  it('merges normalized saved fields without losing newer edits across all three forms or focus', async () => {
    const ui = setup();
    ui.input('profile-display-name', '  Submitted Ada  ');
    ui.input('workspace-name', '  Submitted Workspace  ');
    ui.input('profile-timezone', 'Europe/Berlin');
    ui.click('settings-save');
    ui.input('workspace-name', 'Newer workspace');
    ui.input('profile-timezone', 'Asia/Tokyo');
    ui.element<HTMLButtonElement>('#notify-mention-alerts').click();
    ui.element('#workspace-name').focus();
    await ui.settle();
    expect(ui.page.snapshot().profile.displayName).toBe('Submitted Ada');
    expect(ui.page.snapshot().profile.timezone).toBe('Europe/Berlin');
    expect(ui.page.snapshot().workspace.workspaceName).toBe('Submitted Workspace');
    expect(ui.page.snapshot().notifications.mentionAlerts).toBeFalse();
    expect(ui.draft()).toBe('Submitted Ada');
    expect(ui.element<HTMLInputElement>('#workspace-name').value).toBe('Newer workspace');
    expect(ui.element<HTMLSelectElement>('#profile-timezone').value).toBe('Asia/Tokyo');
    expect(ui.element('#notify-mention-alerts').getAttribute('aria-checked')).toBe('true');
    expect(document.activeElement).toBe(ui.element('#workspace-name'));
    expect(ui.element('[data-testid="dirty-warning"]')).toBeTruthy();
    ui.click('settings-save');
    await ui.settle();
    expect(ui.page.snapshot().workspace.workspaceName).toBe('Newer workspace');
    expect(ui.page.snapshot().notifications.mentionAlerts).toBeTrue();
    expect(ui.host.querySelector('[data-testid="dirty-warning"]')).toBeNull();
  });

  it('preserves edits back to the submitted padded text instead of resetting that control', async () => {
    const ui = setup();
    ui.input('profile-display-name', '  Ada Saved  ');
    ui.click('settings-save');
    ui.input('profile-display-name', 'Something newer');
    ui.input('profile-display-name', '  Ada Saved  ');
    await ui.settle();
    expect(ui.page.snapshot().profile.displayName).toBe('Ada Saved');
    expect(ui.draft()).toBe('  Ada Saved  ');
    expect(ui.host.querySelector('[data-testid="dirty-warning"]')).not.toBeNull();
  });

  it('retains a newer invalid draft and its errors after a successful save', async () => {
    const ui = setup();
    ui.input('profile-display-name', 'Submitted Ada');
    ui.click('settings-save');
    ui.input('profile-display-name', ' ');
    await ui.settle();
    expect(ui.page.snapshot().profile.displayName).toBe('Submitted Ada');
    expect(ui.draft()).toBe(' ');
    expect(ui.element('#profile-display-name-error').textContent).toContain('Enter a display name');
    expect(ui.element<HTMLButtonElement>('[data-testid="settings-save"]').disabled).toBeTrue();
  });

  for (const field of ['profile-display-name', 'workspace-name']) {
    it(`validates ${field} at normalized zero, one and two character boundaries with associated errors`, async () => {
      const ui = setup();
      for (const value of ['', '   ', ' x ']) {
        ui.input(field, value);
        expect(ui.element(`#${field}`).getAttribute('aria-invalid')).toBe('true');
        expect(ui.element(`#${field}`).getAttribute('aria-describedby')).toContain(`${field}-error`);
        expect(ui.element(`#${field}-error`).textContent).toContain(value.trim() ? 'at least 2' : 'Enter a');
        await ui.page.save();
        expect(ui.page.snapshot()).toEqual(EXAMPLE_SETTINGS);
      }
      ui.input(field, ' AB ');
      expect(ui.element(`#${field}`).getAttribute('aria-invalid')).not.toBe('true');
      expect(ui.host.querySelector(`#${field}-error`)).toBeNull();
      ui.click('settings-save');
      await ui.settle();
      expect(ui.element<HTMLInputElement>(`#${field}`).value).toBe('AB');
      expect(ui.host.querySelector(`#${field}-error`)).toBeNull();
    });
  }

  it('rejects duplicate saves and retries current values after failure, without changing the saved snapshot early', async () => {
    const ui = setup();
    ui.checkbox('example-state-simulate-failure', true);
    ui.input('profile-display-name', 'Failed submission');
    ui.click('settings-save');
    expect(ui.element<HTMLButtonElement>('[data-testid="settings-save"]').disabled).toBeTrue();
    ui.input('profile-display-name', 'Current retry draft');
    ui.checkbox('example-state-simulate-failure', false);
    await ui.page.save();
    await ui.settle();
    expect(ui.page.snapshot()).toEqual(EXAMPLE_SETTINGS);
    expect(ui.draft()).toBe('Current retry draft');
    expect(ui.host.querySelector('[data-testid="settings-save-error"]')).not.toBeNull();
    ui.click('settings-retry');
    await ui.settle();
    expect(ui.page.snapshot().profile.displayName).toBe('Current retry draft');
    expect(ui.host.querySelector('[data-testid="settings-save-error"]')).toBeNull();
  });

  for (const boundary of ['readonly', 'preview', 'reload', 'recovery'] as const) {
    for (const failure of [false, true]) {
      it(`suppresses old save ${failure ? 'failure' : 'success'} across ${boundary} and allows a new session save`, async () => {
        const ui = setup();
        ui.checkbox('example-state-simulate-failure', failure);
        ui.input('profile-display-name', 'Old submission');
        ui.click('settings-save');
        if (boundary === 'readonly') {
          ui.checkbox('example-state-readonly', true);
          ui.checkbox('example-state-readonly', false);
        } else if (boundary === 'preview') {
          ui.click('example-state-empty');
          ui.click('example-state-loaded');
        } else if (boundary === 'reload') {
          ui.click('settings-reload');
          ui.click('example-state-loaded');
        } else {
          ui.page.recover();
          ui.fixture.detectChanges();
        }
        expect(ui.draft()).toBe(boundary === 'readonly' || boundary === 'preview' ? 'Old submission' : 'Ada Okafor');
        ui.checkbox('example-state-simulate-failure', false);
        ui.input('profile-display-name', 'New session submission');
        ui.click('settings-save');
        await ui.settle();
        expect(ui.page.snapshot().profile.displayName).toBe('New session submission');
        expect(ui.host.querySelector('[data-testid="settings-save-error"]')).toBeNull();
        expect(ui.element('[data-testid="settings-save-outcome"]').textContent).toContain('New session submission');
      });
    }
  }

  for (const failure of [false, true]) {
    it(`suppresses save ${failure ? 'failure' : 'success'} after destruction`, async () => {
      const ui = setup();
      ui.checkbox('example-state-simulate-failure', failure);
      ui.input('profile-display-name', 'Destroyed session');
      const saving = ui.page.save();
      ui.fixture.destroy();
      await saving;
      expect(ui.page.snapshot()).toEqual(EXAMPLE_SETTINGS);
      expect(ui.page.saveState()).toBe('idle');
    });
  }

  it('keeps only the latest reload result and ignores reload settlement after destruction', async () => {
    const ui = setup();
    ui.checkbox('example-state-simulate-failure', true);
    const first = ui.page.reload();
    ui.checkbox('example-state-simulate-failure', false);
    const second = ui.page.reload();
    await Promise.all([first, second]);
    ui.fixture.detectChanges();
    expect(ui.page.viewState()).toBe('loaded');
    const destroyed = ui.page.reload();
    ui.fixture.destroy();
    await destroyed;
    expect(ui.page.viewState()).toBe('loading');
  });

  for (const action of ['discardChanges', 'leaveWorkspace'] as const) {
    for (const boundary of ['readonly', 'reload', 'preview', 'edit', 'destroy'] as const) {
      it(`rejects stale ${action} completion after ${boundary}`, async () => {
        const ui = setup();
        ui.input('profile-display-name', 'Preserved draft');
        const dialog = delayedConfirmation(ui.page);
        const pending = ui.page[action]();
        expect(dialog.spy).toHaveBeenCalledTimes(1);
        await ui.page[action]();
        expect(dialog.spy).toHaveBeenCalledTimes(1);
        if (boundary === 'readonly') ui.checkbox('example-state-readonly', true);
        if (boundary === 'reload') await ui.page.reload();
        if (boundary === 'preview') {
          ui.click('example-state-empty');
          ui.click('example-state-loaded');
        }
        if (boundary === 'edit') ui.input('profile-display-name', 'A still newer draft');
        if (boundary === 'destroy') ui.fixture.destroy();
        dialog.resolve(true);
        await pending;
        expect(ui.page.terminal()).toBeNull();
        expect(ui.page.snapshot()).toEqual(EXAMPLE_SETTINGS);
        if (boundary !== 'destroy') {
          ui.fixture.detectChanges();
          expect(ui.draft()).toBe(
            boundary === 'reload' ? 'Ada Okafor' : boundary === 'edit' ? 'A still newer draft' : 'Preserved draft',
          );
        }
      });
    }
  }

  for (const boundary of ['readonly', 'reload', 'preview', 'edit', 'destroy'] as const) {
    it(`rejects stale typed deletion after ${boundary}`, async () => {
      const ui = setup();
      ui.input('profile-display-name', 'Preserved draft');
      const dialog = delayedDeletion();
      ui.click('delete-workspace');
      ui.page.deleteWorkspace();
      expect(dialog.spy).toHaveBeenCalledTimes(1);
      if (boundary === 'readonly') ui.checkbox('example-state-readonly', true);
      if (boundary === 'reload') await ui.page.reload();
      if (boundary === 'preview') {
        ui.click('example-state-empty');
        ui.click('example-state-loaded');
      }
      if (boundary === 'edit') ui.input('profile-display-name', 'Newer draft');
      if (boundary === 'destroy') ui.fixture.destroy();
      dialog.closed.next('acme-design-system');
      expect(ui.page.terminal()).toBeNull();
      if (boundary !== 'edit') expect(dialog.close).toHaveBeenCalled();
      if (boundary !== 'destroy') {
        ui.fixture.detectChanges();
        expect(ui.draft()).toBe(
          boundary === 'reload' ? 'Ada Okafor' : boundary === 'edit' ? 'Newer draft' : 'Preserved draft',
        );
      }
    });
  }

  it('guards the captured saved workspace identity and slug at deletion completion', async () => {
    const ui = setup();
    ui.input('workspace-slug', 'new-workspace');
    ui.click('settings-save');
    await ui.settle();
    const dialog = delayedDeletion();
    ui.click('delete-workspace');
    expect(dialog.spy.calls.mostRecent().args[1]?.context).toEqual({ expectedSlug: 'new-workspace' });
    dialog.closed.next('acme-design-system');
    ui.fixture.detectChanges();
    expect(ui.page.terminal()).toBeNull();
    expect(ui.page.snapshot().workspace.slug).toBe('new-workspace');
  });

  for (const action of ['delete', 'leave'] as const) {
    for (const failure of [false, true]) {
      it(`${action} cancels pending save ${failure ? 'failure' : 'success'} and stays terminal until explicit recovery`, async () => {
        const ui = setup();
        const deletion = action === 'delete' ? delayedDeletion() : null;
        const leaving = action === 'leave' ? delayedConfirmation(ui.page) : null;
        ui.input('profile-display-name', 'Unsaved terminal draft');
        ui.checkbox('example-state-simulate-failure', failure);
        ui.click('settings-save');
        if (deletion) {
          ui.click('delete-workspace');
          deletion.closed.next('acme-design-system');
        } else {
          const pending = ui.page.leaveWorkspace();
          leaving!.resolve(true);
          await pending;
        }
        await ui.settle();
        expect(ui.page.terminal()).toBe(action === 'delete' ? 'deleted' : 'left');
        expect(ui.page.snapshot()).toEqual(EXAMPLE_SETTINGS);
        expect(ui.host.querySelector('[data-testid="settings-loaded"]')).toBeNull();
        expect(ui.host.querySelector('[data-testid="example-state-toolbar"]')).toBeNull();
        expect(ui.host.querySelector('[data-testid="settings-save-outcome"]')).toBeNull();
        expect(document.activeElement).toBe(ui.element('#settings-terminal-title'));
        await ui.page.reload();
        await ui.page.save();
        expect(ui.page.terminal()).not.toBeNull();
        ui.click('settings-recover');
        await ui.settle();
        expect(ui.page.terminal()).toBeNull();
        expect(ui.draft()).toBe('Ada Okafor');
        expect(document.activeElement).toBe(ui.element('#settings-profile-title'));
      });
    }
  }

  it('cancelling deletion cancels the old save but preserves drafts for deliberate retry', async () => {
    const ui = setup();
    const dialog = delayedDeletion();
    ui.input('profile-display-name', 'Keep this draft');
    ui.click('settings-save');
    ui.click('delete-workspace');
    dialog.closed.next(null);
    await ui.settle();
    expect(ui.page.snapshot()).toEqual(EXAMPLE_SETTINGS);
    expect(ui.draft()).toBe('Keep this draft');
    expect(ui.element('[data-testid="settings-session-notice"]').textContent).toContain('Save cancelled');
    ui.click('settings-save');
    await ui.settle();
    expect(ui.page.snapshot().profile.displayName).toBe('Keep this draft');
  });

  it('keeps pending, invalid, failure, success, readonly and terminal states usable at phone width', async () => {
    const ui = setup();
    ui.host.style.cssText = 'display:block; width:280px; position:absolute; top:0; left:0;';
    const checkWidth = () => {
      expect(ui.host.scrollWidth).toBeLessThanOrEqual(281);
      expect(ui.host.querySelectorAll('h2').length).toBe(1);
    };
    ui.input('profile-display-name', ' ');
    checkWidth();
    ui.input('profile-display-name', 'Phone preview draft');
    ui.checkbox('example-state-simulate-failure', true);
    ui.click('settings-save');
    checkWidth();
    await ui.settle();
    checkWidth();
    ui.checkbox('example-state-simulate-failure', false);
    ui.click('settings-retry');
    await ui.settle();
    checkWidth();
    ui.checkbox('example-state-readonly', true);
    ui.click('settings-nav-settings-notifications');
    expect(document.activeElement).toBe(ui.element('#settings-notifications-title'));
    checkWidth();
    ui.checkbox('example-state-readonly', false);
    spyOn(ui.page, 'confirm').and.resolveTo(true);
    await ui.page.leaveWorkspace();
    await ui.settle();
    checkWidth();
  });

  for (const action of ['discardChanges', 'leaveWorkspace', 'canDeactivate'] as const) {
    for (const boundary of ['readonly', 'recovery', 'destroy'] as const) {
      it(`closes the real ${action} overlay on ${boundary} without retaining a stale confirmation`, async () => {
        const ui = setup();
        ui.input('profile-display-name', 'Keep this draft');
        const pending = ui.page[action]();
        await ui.settle();
        expect(document.querySelector('.cdk-overlay-pane')).not.toBeNull();
        if (boundary === 'readonly') ui.checkbox('example-state-readonly', true);
        if (boundary === 'recovery') ui.page.recover();
        if (boundary === 'destroy') ui.fixture.destroy();
        await new Promise((resolve) => setTimeout(resolve, 180));
        expect(document.querySelector('.cdk-overlay-pane')).toBeNull();
        // Clean up even on a regression so one failed assertion cannot leak an overlay.
        document.querySelector<HTMLButtonElement>('.cdk-overlay-pane button')?.click();
        await pending;
        expect(ui.page.terminal()).toBeNull();
        expect(ui.page.snapshot()).toEqual(EXAMPLE_SETTINGS);
      });
    }
  }
});
