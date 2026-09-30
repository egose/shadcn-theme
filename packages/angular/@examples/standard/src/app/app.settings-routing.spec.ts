import { Component, provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Router, RouterOutlet, provideRouter } from '@angular/router';
import { HlmDialogService } from '@egose/shadcn-theme-ng/dialog';
import { routes } from './app.routes';
import { SettingsExamplePage } from './pages/examples/settings/settings';

describe('Settings real route departure', () => {
  @Component({ imports: [RouterOutlet], template: '<router-outlet />' })
  class RoutingHost {}

  async function setup() {
    TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection(), provideRouter(routes)] });
    const fixture = TestBed.createComponent(RoutingHost);
    const router = TestBed.inject(Router);
    await router.navigateByUrl('/examples/settings');
    fixture.detectChanges();
    await fixture.whenStable();
    const host = fixture.nativeElement as HTMLElement;
    const draft = () => host.querySelector<HTMLInputElement>('#profile-display-name')!;
    const edit = (value: string) => {
      draft().value = value;
      draft().dispatchEvent(new Event('input', { bubbles: true }));
      fixture.detectChanges();
    };
    const page = fixture.debugElement.query(By.directive(SettingsExamplePage)).componentInstance as {
      confirm(context: { title: string; description: string }): Promise<boolean>;
    };
    return { fixture, router, host, draft, edit, page };
  }

  afterEach(() => document.querySelector('.cdk-overlay-container')?.remove());

  it('allows departure from a recognized settings route with no activated outlet or draft', async () => {
    TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection(), provideRouter(routes)] });
    const router = TestBed.inject(Router);
    const confirm = spyOn(TestBed.inject(HlmDialogService), 'open').and.callThrough();
    expect(await router.navigateByUrl('/examples/settings')).toBeTrue();
    expect(await router.navigateByUrl('/home')).toBeTrue();
    expect(router.url).toBe('/home');
    expect(confirm).not.toHaveBeenCalled();
  });

  it('allows clean departure without confirmation', async () => {
    const ui = await setup();
    const confirm = spyOn(ui.page, 'confirm').and.resolveTo(false);
    expect(await ui.router.navigateByUrl('/home')).toBeTrue();
    expect(confirm).not.toHaveBeenCalled();
  });

  it('rejects departure preserving the actual routed draft, then explicitly accepts and starts fresh on return', async () => {
    const ui = await setup();
    ui.edit('Routed unsaved Ada');
    const confirm = spyOn(ui.page, 'confirm').and.resolveTo(false);
    expect(await ui.router.navigateByUrl('/home')).toBeFalse();
    ui.fixture.detectChanges();
    expect(ui.router.url).toBe('/examples/settings');
    expect(ui.draft().value).toBe('Routed unsaved Ada');
    expect(confirm.calls.mostRecent().args[0].description).toContain('discards all unsaved edits');
    confirm.and.resolveTo(true);
    expect(await ui.router.navigateByUrl('/home')).toBeTrue();
    ui.fixture.detectChanges();
    expect(ui.host.querySelector('#profile-display-name')).toBeNull();
    await ui.router.navigateByUrl('/examples/settings');
    ui.fixture.detectChanges();
    expect(ui.draft().value).toBe('Ada Okafor');
  });

  it('protects readonly drafts when navigating to another example', async () => {
    const ui = await setup();
    ui.edit('Readonly preserved draft');
    const checkbox = ui.host.querySelector<HTMLInputElement>('[data-testid="example-state-readonly"]')!;
    checkbox.checked = true;
    checkbox.dispatchEvent(new Event('change', { bubbles: true }));
    ui.fixture.detectChanges();
    const confirm = spyOn(ui.page, 'confirm').and.resolveTo(false);
    expect(await ui.router.navigateByUrl('/examples/pricing')).toBeFalse();
    expect(ui.draft().value).toBe('Readonly preserved draft');
    confirm.and.resolveTo(true);
    expect(await ui.router.navigateByUrl('/examples/pricing')).toBeTrue();
  });

  it('invalidates a departure decision if the draft changes while the dialog is open', async () => {
    const ui = await setup();
    ui.edit('Original draft');
    let resolve!: (value: boolean) => void;
    const confirm = spyOn(ui.page, 'confirm').and.returnValue(
      new Promise((done) => {
        resolve = done;
      }),
    );
    const departure = ui.router.navigateByUrl('/home');
    await new Promise((done) => setTimeout(done, 0));
    expect(confirm).toHaveBeenCalledTimes(1);
    ui.edit('New draft since dialog opened');
    resolve(true);
    expect(await departure).toBeFalse();
    expect(ui.router.url).toBe('/examples/settings');
    expect(ui.draft().value).toBe('New draft since dialog opened');
  });

  it('cancels a pending save on accepted departure without leaking its result on return', async () => {
    const ui = await setup();
    ui.edit('Pending submission');
    ui.host.querySelector<HTMLButtonElement>('[data-testid="settings-save"]')!.click();
    spyOn(ui.page, 'confirm').and.resolveTo(true);
    expect(await ui.router.navigateByUrl('/home')).toBeTrue();
    await new Promise((done) => setTimeout(done, 30));
    await ui.router.navigateByUrl('/examples/settings');
    ui.fixture.detectChanges();
    expect(ui.draft().value).toBe('Ada Okafor');
    expect(ui.host.querySelector('[data-testid="settings-save-outcome"]')).toBeNull();
  });

  it('rejecting departure lets the submitted save settle while retaining newer routed edits', async () => {
    const ui = await setup();
    ui.edit('Submitted routed draft');
    ui.host.querySelector<HTMLButtonElement>('[data-testid="settings-save"]')!.click();
    ui.edit('Newer routed draft');
    spyOn(ui.page, 'confirm').and.resolveTo(false);
    expect(await ui.router.navigateByUrl('/home')).toBeFalse();
    await new Promise((done) => setTimeout(done, 30));
    ui.fixture.detectChanges();
    expect(ui.draft().value).toBe('Newer routed draft');
    expect(ui.host.querySelector('[data-testid="settings-save-outcome"]')?.textContent).toContain(
      'Submitted routed draft',
    );
    expect(ui.host.querySelector('[data-testid="dirty-warning"]')).not.toBeNull();
  });

  it('uses the real confirmation overlay and restores focus on rejected departure', async () => {
    const ui = await setup();
    ui.edit('Keep editing');
    ui.draft().focus();
    const departure = ui.router.navigateByUrl('/home');
    await new Promise((done) => setTimeout(done, 100));
    ui.fixture.detectChanges();
    const pane = document.querySelector<HTMLElement>('.cdk-overlay-pane')!;
    expect(pane.textContent).toContain('Leave settings with unsaved changes?');
    expect(pane.contains(document.activeElement)).toBeTrue();
    Array.from(pane.querySelectorAll('button'))
      .find((button) => button.textContent?.trim() === 'Cancel')!
      .click();
    expect(await departure).toBeFalse();
    await new Promise((done) => setTimeout(done, 100));
    expect(ui.draft().value).toBe('Keep editing');
    expect(document.activeElement).toBe(ui.draft());
  });
});
