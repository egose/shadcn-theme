import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EgConfirmationDialogService } from '@egose/shadcn-theme-ng/confirmation-dialog';
import { SettingsExamplePage } from './settings';
import { EXAMPLE_SETTINGS, SETTINGS_SECTIONS, SETTINGS_SAVED_AT_ISO } from './settings-fixtures';

type PageApi = {
  viewState: { set: (state: 'loading' | 'empty' | 'error' | 'loaded') => void };
  readOnly: { set: (value: boolean) => void };
  simulateFailure: { set: (value: boolean) => void };
  reload: () => Promise<void>;
  save: () => Promise<void>;
  discardChanges: () => Promise<void>;
  selectSection: (id: string) => Promise<void>;
  leaveWorkspace: () => Promise<void>;
  deleteWorkspace: () => void;
};

function overlayPane(): HTMLElement | null {
  return document.querySelector<HTMLElement>('.cdk-overlay-pane');
}

function overlayButton(text: string): HTMLButtonElement | null {
  const buttons = Array.from(overlayPane()?.querySelectorAll('button') ?? []);
  return buttons.find((button) => button.textContent?.trim() === text) ?? null;
}

async function settle(fixture: ComponentFixture<unknown>): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 100));
  fixture.detectChanges();
  await fixture.whenStable();
  fixture.detectChanges();
}

function setInput(host: HTMLElement, testid: string, value: string): void {
  const input = host.querySelector<HTMLInputElement>(`[data-testid="${testid}"]`);
  expect(input).withContext(`[${testid}] should exist`).not.toBeNull();
  input!.value = value;
  input!.dispatchEvent(new Event('input', { bubbles: true }));
  input!.dispatchEvent(new Event('blur', { bubbles: true }));
}

function inputValue(host: HTMLElement, testid: string): string {
  return host.querySelector<HTMLInputElement>(`[data-testid="${testid}"]`)?.value ?? '';
}

describe('SettingsExamplePage', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] }).compileComponents();
  });

  afterEach(() => {
    document.querySelector('.cdk-overlay-container')?.remove();
  });

  function setup() {
    const fixture = TestBed.createComponent(SettingsExamplePage);
    fixture.detectChanges();
    return {
      fixture,
      host: fixture.nativeElement as HTMLElement,
      page: fixture.componentInstance as unknown as PageApi,
    };
  }

  function confirmNext(result: boolean): void {
    const service = TestBed.inject(EgConfirmationDialogService);
    const existing = service.showConfirmationDialog as unknown as jasmine.Spy | undefined;
    if (existing && typeof existing.and?.resolveTo === 'function') {
      existing.and.resolveTo(result);
    } else {
      spyOn(service, 'showConfirmationDialog').and.resolveTo(result);
    }
  }

  it('lazy-loads through the registry entry', async () => {
    const loaded = await import('./settings').then((m) => m.SettingsExamplePage);
    expect(loaded).toBe(SettingsExamplePage);
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

  it('uses a fixed UTC snapshot with stable values', () => {
    expect(EXAMPLE_SETTINGS.updatedAtIso).toBe('2026-01-20T10:00:00.000Z');
    expect(EXAMPLE_SETTINGS.updatedAtIso.endsWith('Z')).toBeTrue();
    expect(EXAMPLE_SETTINGS.workspace.slug).toBe('acme-design-system');
    expect(SETTINGS_SAVED_AT_ISO.endsWith('Z')).toBeTrue();
    expect(SETTINGS_SECTIONS.map((section) => section.id)).toEqual([
      'settings-profile',
      'settings-workspace',
      'settings-notifications',
      'settings-danger-zone',
    ]);
    const { host } = setup();
    expect(host.querySelector('[data-testid="settings-loaded"]')).not.toBeNull();
    expect(inputValue(host, 'profile-display-name')).toBe('Ada Okafor');
    expect(inputValue(host, 'workspace-slug')).toBe('acme-design-system');
  });

  it('exposes the catalog toolbar and all four preview states', () => {
    const { fixture, host, page } = setup();
    expect(host.querySelector('[data-testid="example-state-toolbar"]')).not.toBeNull();

    page.viewState.set('loading');
    fixture.detectChanges();
    expect(host.querySelector('[aria-label="Loading settings"]')).not.toBeNull();

    page.viewState.set('empty');
    fixture.detectChanges();
    expect(host.textContent).toContain('No settings found');

    page.viewState.set('error');
    fixture.detectChanges();
    expect(host.querySelector('[role="alert"]')).not.toBeNull();

    page.viewState.set('loaded');
    fixture.detectChanges();
    expect(host.querySelector('[data-testid="settings-loaded"]')).not.toBeNull();
  });

  it('reuses one local section framing across all four sections without hiding package controls', () => {
    const { host } = setup();
    const sections = Array.from(host.querySelectorAll('app-settings-section'));
    expect(sections.length).toBe(4);
    for (const id of SETTINGS_SECTIONS.map((section) => section.id)) {
      expect(host.querySelector(`[data-testid="settings-section-${id}"]`)).not.toBeNull();
    }
    // Package composition stays visible at each call site: native inputs,
    // selects, checkboxes, and buttons render inside the projected content.
    expect(host.querySelector('[data-testid="profile-email"]')).not.toBeNull();
    expect(host.querySelector('[data-testid="workspace-plan"]')).not.toBeNull();
    expect(host.querySelector('#notify-weekly-digest')).not.toBeNull();
    expect(host.querySelector('[data-testid="leave-workspace"]')).not.toBeNull();
  });

  it('exposes a keyboard and screen-reader discoverable section nav', () => {
    const { host } = setup();
    const nav = host.querySelector('[data-testid="settings-nav"]');
    expect(nav?.tagName).toBe('NAV');
    expect(nav?.getAttribute('aria-label')).toBe('Settings sections');
    const buttons = Array.from(nav?.querySelectorAll('button') ?? []);
    expect(buttons.map((button) => button.textContent?.trim())).toEqual([
      'Profile',
      'Workspace',
      'Notifications',
      'Danger zone',
    ]);
    for (const button of buttons) {
      expect(button.tabIndex).toBeGreaterThanOrEqual(0);
    }
    expect(host.querySelector('[data-testid="settings-nav-settings-profile"]')?.getAttribute('aria-current')).toBe(
      'true',
    );
    for (const id of ['settings-workspace', 'settings-notifications', 'settings-danger-zone']) {
      expect(host.querySelector(`[data-testid="settings-nav-${id}"]`)?.getAttribute('aria-current')).toBeNull();
    }
  });

  it('keeps save disabled until valid data actually changes', () => {
    const { fixture, host } = setup();
    const save = host.querySelector('[data-testid="settings-save"]') as HTMLButtonElement;
    const discard = host.querySelector('[data-testid="settings-discard"]') as HTMLButtonElement;
    expect(save.disabled).toBeTrue();
    expect(discard.disabled).toBeTrue();
    expect(host.querySelector('[data-testid="dirty-warning"]')).toBeNull();

    setInput(host, 'profile-display-name', 'Ada Okafor Updated');
    fixture.detectChanges();

    expect(save.disabled).toBeFalse();
    expect(discard.disabled).toBeFalse();
    expect(host.querySelector('[data-testid="dirty-warning"]')?.getAttribute('role')).toBe('status');
    expect(host.textContent).toContain('unsaved changes');
  });

  it('saves valid changes with pending, success, and a clean dirty state', async () => {
    const { fixture, host } = setup();
    setInput(host, 'profile-display-name', 'Ada Okafor Updated');
    fixture.detectChanges();

    (host.querySelector('[data-testid="settings-save"]') as HTMLButtonElement).click();
    fixture.detectChanges();
    expect(host.querySelector('[data-testid="settings-save-pending"]')?.textContent).toContain('Saving');

    await settle(fixture);

    const outcomes = host.querySelectorAll('[data-testid="settings-save-outcome"]');
    expect(outcomes.length).toBe(1);
    expect(outcomes[0].getAttribute('role')).toBe('status');
    expect(outcomes[0].textContent).toContain('Ada Okafor Updated');
    expect(outcomes[0].textContent).toContain('Acme Design System');
    // A successful save resets dirty state, so save disables again.
    expect((host.querySelector('[data-testid="settings-save"]') as HTMLButtonElement).disabled).toBeTrue();
    expect(host.querySelector('[data-testid="dirty-warning"]')).toBeNull();
  });

  it('shows field and form-level errors while keeping save disabled', () => {
    const { fixture, host } = setup();
    setInput(host, 'profile-email', 'not-an-email');
    fixture.detectChanges();

    expect(host.querySelector('[data-testid="profile-email-error"]')?.textContent).toContain(
      'Enter a valid email like sam@example.com',
    );
    expect(host.querySelector('[data-testid="profile-email"]')?.getAttribute('aria-invalid')).toBe('true');
    const summary = host.querySelector('[data-testid="settings-form-errors"]');
    expect(summary?.getAttribute('role')).toBe('alert');
    expect(summary?.textContent).toContain('Profile — email needs attention.');
    expect((host.querySelector('[data-testid="settings-save"]') as HTMLButtonElement).disabled).toBeTrue();
  });

  it('rejects bad workspace slugs with visible guidance', () => {
    const { fixture, host } = setup();
    setInput(host, 'workspace-slug', 'Acme Design!!');
    fixture.detectChanges();

    expect(host.querySelector('[data-testid="workspace-slug-error"]')?.textContent).toContain(
      'lowercase letters, numbers, and hyphens',
    );
    expect(host.querySelector('[data-testid="settings-form-errors"]')?.textContent).toContain(
      'Workspace — slug needs attention.',
    );
    expect((host.querySelector('[data-testid="settings-save"]') as HTMLButtonElement).disabled).toBeTrue();
  });

  it('fails a save visibly and retries to success', async () => {
    const { fixture, host, page } = setup();
    setInput(host, 'profile-display-name', 'Ada Okafor Updated');
    fixture.detectChanges();

    page.simulateFailure.set(true);
    (host.querySelector('[data-testid="settings-save"]') as HTMLButtonElement).click();
    await settle(fixture);

    const failure = host.querySelector('[data-testid="settings-save-error"]');
    expect(failure?.getAttribute('role')).toBe('alert');
    expect(failure?.textContent).toContain('failed to save');
    expect(host.querySelector('[data-testid="settings-save-outcome"]')).toBeNull();

    page.simulateFailure.set(false);
    (host.querySelector('[data-testid="settings-retry"]') as HTMLButtonElement).click();
    await settle(fixture);

    expect(host.querySelector('[data-testid="settings-save-error"]')).toBeNull();
    expect(host.querySelector('[data-testid="settings-save-outcome"]')?.textContent).toContain('Ada Okafor Updated');
  });

  it('preserves values when discarding is rejected and restores them when accepted', async () => {
    const { fixture, host, page } = setup();
    setInput(host, 'profile-display-name', 'Ada Okafor Updated');
    fixture.detectChanges();

    confirmNext(false);
    await page.discardChanges();
    fixture.detectChanges();
    expect(inputValue(host, 'profile-display-name')).toBe('Ada Okafor Updated');
    expect(host.querySelector('[data-testid="dirty-warning"]')).not.toBeNull();

    confirmNext(true);
    await page.discardChanges();
    fixture.detectChanges();
    expect(inputValue(host, 'profile-display-name')).toBe('Ada Okafor');
    expect(host.querySelector('[data-testid="dirty-warning"]')).toBeNull();
  });

  it('warns on dirty section navigation: reject stays, accept resets and moves', async () => {
    const { fixture, host, page } = setup();
    setInput(host, 'workspace-name', 'Acme Temporary Name');
    fixture.detectChanges();

    confirmNext(false);
    await page.selectSection('settings-notifications');
    fixture.detectChanges();
    expect(inputValue(host, 'workspace-name')).toBe('Acme Temporary Name');
    expect(host.querySelector('[data-testid="settings-nav-settings-profile"]')?.getAttribute('aria-current')).toBe(
      'true',
    );

    confirmNext(true);
    await page.selectSection('settings-notifications');
    fixture.detectChanges();
    expect(inputValue(host, 'workspace-name')).toBe('Acme Design System');
    expect(
      host.querySelector('[data-testid="settings-nav-settings-notifications"]')?.getAttribute('aria-current'),
    ).toBe('true');
  });

  it('moves between sections without confirmation when nothing changed', async () => {
    const { fixture, host, page } = setup();
    const service = TestBed.inject(EgConfirmationDialogService);
    const spy = spyOn(service, 'showConfirmationDialog').and.resolveTo(true);

    await page.selectSection('settings-workspace');
    fixture.detectChanges();

    expect(spy).not.toHaveBeenCalled();
    expect(host.querySelector('[data-testid="settings-nav-settings-workspace"]')?.getAttribute('aria-current')).toBe(
      'true',
    );
  });

  it('locks every mutation path in read-only preview with an explanation', async () => {
    const { fixture, host, page } = setup();
    page.readOnly.set(true);
    fixture.detectChanges();

    expect(host.querySelector('[data-testid="settings-readonly-note"]')?.textContent).toContain(
      'previewing as a workspace member',
    );
    expect((host.querySelector('[data-testid="settings-save"]') as HTMLButtonElement).disabled).toBeTrue();
    expect((host.querySelector('[data-testid="settings-discard"]') as HTMLButtonElement).disabled).toBeTrue();
    expect((host.querySelector('[data-testid="profile-display-name"]') as HTMLInputElement).disabled).toBeTrue();
    expect((host.querySelector('[data-testid="leave-workspace"]') as HTMLButtonElement).disabled).toBeTrue();
    expect((host.querySelector('[data-testid="delete-workspace"]') as HTMLButtonElement).disabled).toBeTrue();

    // Alternate programmatic paths cannot mutate either.
    await page.save();
    await page.discardChanges();
    await page.leaveWorkspace();
    page.deleteWorkspace();
    fixture.detectChanges();
    await settle(fixture);
    expect(overlayPane()).toBeNull();
    expect(host.querySelector('[data-testid="settings-save-outcome"]')).toBeNull();
    expect(host.querySelector('[data-testid="danger-outcome"]')).toBeNull();
  });

  it('keeps destructive actions separate and requires explicit confirmation to leave', async () => {
    const { fixture, host, page } = setup();
    const danger = host.querySelector('[data-testid="danger-zone"]');
    expect(danger?.getAttribute('role')).toBe('region');
    expect(danger?.getAttribute('aria-label')).toBe('Destructive workspace actions');

    confirmNext(false);
    await page.leaveWorkspace();
    fixture.detectChanges();
    expect(host.querySelector('[data-testid="danger-outcome"]')).toBeNull();

    confirmNext(true);
    await page.leaveWorkspace();
    fixture.detectChanges();
    const outcomes = host.querySelectorAll('[data-testid="danger-outcome"]');
    expect(outcomes.length).toBe(1);
    expect(outcomes[0].textContent).toContain('Leave request for Acme Design System recorded');
  });

  it('requires the typed workspace slug before deletion can run', async () => {
    const { fixture, host, page } = setup();
    page.deleteWorkspace();
    await settle(fixture);

    expect(overlayPane()?.textContent).toContain('acme-design-system');
    expect(overlayPane()?.contains(document.activeElement))
      .withContext('focus is moved into the delete dialog')
      .toBeTrue();
    const submit = overlayPane()?.querySelector<HTMLButtonElement>('[data-testid="delete-confirm-submit"]');
    expect(submit?.disabled).toBeTrue();

    const input = overlayPane()?.querySelector<HTMLInputElement>('[data-testid="delete-confirm-input"]');
    expect(input).not.toBeNull();
    input!.value = 'acme-design-system';
    input!.dispatchEvent(new Event('input', { bubbles: true }));
    await settle(fixture);
    expect(
      overlayPane()?.querySelector<HTMLButtonElement>('[data-testid="delete-confirm-submit"]')?.disabled,
    ).toBeFalse();

    overlayPane()?.querySelector<HTMLButtonElement>('[data-testid="delete-confirm-submit"]')?.click();
    await settle(fixture);

    expect(overlayPane()).toBeNull();
    const outcomes = host.querySelectorAll('[data-testid="danger-outcome"]');
    expect(outcomes.length).toBe(1);
    expect(outcomes[0].textContent).toContain('acme-design-system deleted');
  });

  it('rejects a mismatched typed slug and preserves values on cancel', async () => {
    const { fixture, host, page } = setup();
    setInput(host, 'profile-display-name', 'Ada Okafor Updated');
    fixture.detectChanges();

    page.deleteWorkspace();
    await settle(fixture);

    const input = overlayPane()?.querySelector<HTMLInputElement>('[data-testid="delete-confirm-input"]');
    input!.value = 'wrong-slug';
    input!.dispatchEvent(new Event('input', { bubbles: true }));
    await settle(fixture);
    expect(
      overlayPane()?.querySelector<HTMLButtonElement>('[data-testid="delete-confirm-submit"]')?.disabled,
    ).toBeTrue();

    overlayButton('Cancel')?.click();
    await settle(fixture);

    expect(overlayPane()).toBeNull();
    expect(host.querySelector('[data-testid="danger-outcome"]')).toBeNull();
    expect(inputValue(host, 'profile-display-name')).toBe('Ada Okafor Updated');
  });

  it('reloads through the deterministic simulator, honoring simulated failure', async () => {
    const { fixture, host, page } = setup();
    page.simulateFailure.set(true);
    await page.reload();
    fixture.detectChanges();
    expect(host.querySelector('[role="alert"]')).not.toBeNull();

    page.simulateFailure.set(false);
    await page.reload();
    fixture.detectChanges();
    expect(host.querySelector('[data-testid="settings-loaded"]')).not.toBeNull();
    expect(inputValue(host, 'profile-display-name')).toBe('Ada Okafor');
  });
});
