import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MenuPage } from './menu';

/**
 * Focused behavior coverage for the public menu demo: standard items with
 * shortcuts, groups and separators, checkbox/radio state, the disabled item,
 * and the submenu. Every choice must produce a deterministic visible outcome.
 */
describe('Menu page', () => {
  let fixture: ComponentFixture<MenuPage>;

  async function settle(): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 100));
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  }

  function overlayButtons(): HTMLButtonElement[] {
    return Array.from(document.querySelectorAll('.cdk-overlay-pane button'));
  }

  function overlayButtonContaining(text: string): HTMLButtonElement | null {
    return (
      (overlayButtons().find((button) => button.textContent?.includes(text)) as HTMLButtonElement | undefined) ?? null
    );
  }

  async function openMenu(): Promise<void> {
    const host = fixture.nativeElement as HTMLElement;
    const trigger = Array.from(host.querySelectorAll('button')).find(
      (button) => button.textContent?.trim() === 'Open account menu',
    ) as HTMLButtonElement;
    expect(trigger).withContext('menu trigger is rendered').not.toBeNull();
    trigger.click();
    await settle();
    expect(document.querySelector('.cdk-overlay-pane [role="menu"]'))
      .withContext('menu panel opens in the overlay')
      .not.toBeNull();
  }

  function statusText(): string {
    return ((fixture.nativeElement as HTMLElement).querySelector('[role="status"]')?.textContent ?? '').trim();
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuPage],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();
    fixture = TestBed.createComponent(MenuPage);
    fixture.detectChanges();
  });

  afterEach(() => {
    document.querySelector('.cdk-overlay-container')?.remove();
    TestBed.resetTestingModule();
  });

  it('chooses a standard item and announces the outcome', async () => {
    await openMenu();
    overlayButtonContaining('Profile')!.click();
    await settle();
    expect(statusText()).toContain('Profile selected from the account menu.');
  });

  it('toggles checkbox items with visible state and outcomes', async () => {
    await openMenu();
    const bookmarks = overlayButtonContaining('Show bookmarks bar')!;
    expect(bookmarks.getAttribute('role')).toEqual('menuitemcheckbox');
    expect(bookmarks.getAttribute('aria-checked')).toEqual('true');
    bookmarks.click();
    await settle();
    expect(statusText()).toContain('Bookmarks bar hidden.');

    await openMenu();
    const reopened = overlayButtonContaining('Show bookmarks bar')!;
    expect(reopened.getAttribute('aria-checked')).toEqual('false');
    reopened.click();
    await settle();
    expect(statusText()).toContain('Bookmarks bar shown.');
  });

  it('selects exactly one radio item at a time', async () => {
    await openMenu();
    const privateOption = overlayButtonContaining('Private')!;
    expect(privateOption.getAttribute('role')).toEqual('menuitemradio');
    privateOption.click();
    await settle();
    expect(statusText()).toContain('Profile visibility set to private.');

    await openMenu();
    expect(overlayButtonContaining('Private')!.getAttribute('aria-checked')).toEqual('true');
    expect(overlayButtonContaining('Public')!.getAttribute('aria-checked')).toEqual('false');
  });

  it('opens the submenu and chooses a nested item', async () => {
    await openMenu();
    overlayButtonContaining('Share')!.click();
    await settle();
    const nested = overlayButtonContaining('Copy invite link');
    expect(nested).withContext('submenu item is rendered').not.toBeNull();
    nested!.click();
    await settle();
    expect(statusText()).toContain('Copy invite link selected from the account menu.');
  });

  it('keeps the disabled item non-interactive with an explanatory title', async () => {
    await openMenu();
    const billing = overlayButtonContaining('Manage billing')!;
    expect(billing.disabled).withContext('billing item is disabled').toBeTrue();
    expect(billing.getAttribute('title')).toContain('Disabled demo item');
    billing.click();
    await settle();
    expect(statusText()).withContext('disabled choice records no outcome').toEqual('');
  });

  it('renders groups, separators, and shortcuts in the open menu', async () => {
    await openMenu();
    const panel = document.querySelector('.cdk-overlay-pane [role="menu"]') as HTMLElement;
    // HlmMenuSeparator renders as a structural `hlm-menu-separator` element
    // without an ARIA role, so count the package element itself.
    expect(panel.querySelectorAll('hlm-menu-separator').length).toBeGreaterThanOrEqual(3);
    expect(panel.textContent).toContain('⌘S');
    expect(panel.textContent).toContain('Preferences');
    expect(panel.textContent).toContain('Profile visibility');
  });
});
