import { Component, provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { BreakpointObserver } from '@angular/cdk/layout';
import { of } from 'rxjs';
import { App } from './app';
import { CATALOG_ENTRIES, catalogLink } from './catalog/catalog';

@Component({
  template: '<h1>Routed component gallery</h1>',
})
class RoutedTestPage {}

describe('App', () => {
  beforeEach(async () => {
    // No synthetic overlay providers here: the shell (including the header
    // search popover) must construct from its real imports. ANGEX-08 fixed a
    // missing popover-portal composition that crashed shell creation.
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        provideZonelessChangeDetection(),
        provideRouter([
          { path: '', redirectTo: 'gallery', pathMatch: 'full' },
          { path: 'gallery', component: RoutedTestPage },
          { path: 'components/:slug', component: RoutedTestPage },
          { path: 'examples/:slug', component: RoutedTestPage },
          { path: 'home', component: RoutedTestPage },
        ]),
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('searches both catalog kinds by title, category and description, trimmed and case-insensitive', async () => {
    const app = TestBed.createComponent(App).componentInstance;
    for (const [search, link] of [
      [' SUPPORT ', '/examples/support-inbox'],
      ['pricing', '/examples/pricing'],
      ['signup', '/examples/signup-flow'],
      ['onboarding', '/examples/signup-flow'],
      ['ticket-owned', '/examples/support-inbox'],
      ['integer seat', '/examples/pricing'],
      ['stable-ID', '/examples/team-management'],
      ['newer drafts', '/examples/settings'],
      ['raw or formatted', '/components/phone-input'],
      ['product flows', '/examples/settings'],
      ['buttons & indicators', '/components/button'],
    ]) {
      expect((await app.loadDemoRoutes({ search })).map((entry) => entry.link))
        .withContext(search)
        .toContain(link);
    }
    expect(await app.loadDemoRoutes({ search: 'no-such-capability-zzzz' })).toEqual([]);
  });

  it('bounds results to eight in registry order, including blank queries, and keeps kind context', async () => {
    const app = TestBed.createComponent(App).componentInstance;
    const first = await app.loadDemoRoutes({ search: '  ' });
    expect(first.map((entry) => entry.link)).toEqual(CATALOG_ENTRIES.slice(0, 8).map(catalogLink));
    const broad = await app.loadDemoRoutes({ search: 'a' });
    expect(broad.length).toBe(8);
    expect(await app.loadDemoRoutes({ search: 'a' })).toEqual(broad);
    expect(app.searchResultLabel(first[0])).toContain('Component · Buttons & Indicators · Button');
    const workflow = (await app.loadDemoRoutes({ search: 'signup' }))[0];
    expect(app.searchResultLabel(workflow)).toBe('Business example · Product Flows · Signup Flow');
  });

  for (const [query, title, context, link] of [
    ['support', 'Support Inbox', 'Business example', '/examples/support-inbox'],
    ['pricing', 'Pricing', 'Business example', '/examples/pricing'],
    ['onboarding', 'Signup Flow', 'Business example', '/examples/signup-flow'],
    ['raw or formatted', 'Phone Input', 'Component', '/components/phone-input'],
  ]) {
    it(`renders search context and navigates the selected ${title} result`, async () => {
      TestBed.overrideProvider(BreakpointObserver, {
        useValue: { observe: () => of({ matches: false, breakpoints: {} }) },
      });
      const fixture = TestBed.createComponent(App);
      fixture.detectChanges();
      fixture.nativeElement.querySelector('eg-layout-search button').click();
      fixture.detectChanges();
      await fixture.whenStable();
      const input = document.querySelector<HTMLInputElement>('input[type="search"]')!;
      input.value = 'no-such-capability-zzzz';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      fixture.detectChanges();
      await new Promise((resolve) => setTimeout(resolve, 220));
      fixture.detectChanges();
      expect(document.querySelector('hlm-popover-content')?.textContent).toContain(
        'No matching components or workflows',
      );
      input.value = query;
      input.dispatchEvent(new Event('input', { bubbles: true }));
      fixture.detectChanges();
      await new Promise((resolve) => setTimeout(resolve, 220));
      fixture.detectChanges();
      const result = Array.from(document.querySelectorAll<HTMLButtonElement>('hlm-popover-content button')).find(
        (button) => button.textContent?.includes(title),
      )!;
      expect(result.textContent).toContain(context);
      expect(result.textContent).toContain(CATALOG_ENTRIES.find((entry) => catalogLink(entry) === link)!.description);
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true, cancelable: true }));
      const results = Array.from(document.querySelectorAll<HTMLButtonElement>('hlm-popover-content button'));
      expect(document.activeElement).toBe(results[0]);
      for (let index = 0; index < results.indexOf(result); index++) {
        results[index].dispatchEvent(
          new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true, cancelable: true }),
        );
      }
      expect(document.activeElement).toBe(result);
      result.click();
      fixture.detectChanges();
      await fixture.whenStable();
      expect(TestBed.inject(Router).url).toBe(link);
    });
  }

  it('renders the accessible shell and routed content', async () => {
    const fixture = TestBed.createComponent(App);
    await TestBed.inject(Router).navigateByUrl('/gallery');
    fixture.detectChanges();
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('main')).not.toBeNull();
    expect(compiled.querySelector('router-outlet')).not.toBeNull();
    expect(compiled.querySelector('h1')?.textContent).toContain('Routed component gallery');
  });

  it('renders exactly one main landmark with header and footer', async () => {
    const fixture = TestBed.createComponent(App);
    await TestBed.inject(Router).navigateByUrl('/gallery');
    fixture.detectChanges();
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelectorAll('main').length).toBe(1);
    expect(compiled.querySelector('header')).not.toBeNull();
    expect(compiled.querySelector('footer')).not.toBeNull();
  });

  it('names the icon-only shell triggers and tracks mobile menu expansion', async () => {
    const fixture = TestBed.createComponent(App);
    await TestBed.inject(Router).navigateByUrl('/gallery');
    fixture.detectChanges();
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;

    const sidebarTrigger = compiled.querySelector<HTMLButtonElement>('button[aria-controls$="-sidebar"]');
    const mobileTrigger = compiled.querySelector<HTMLButtonElement>('button[aria-controls$="-mobile-menu"]');
    expect(sidebarTrigger?.getAttribute('aria-label')).withContext('sidebar trigger').toBeTruthy();
    expect(mobileTrigger?.getAttribute('aria-label')).withContext('mobile trigger').toBeTruthy();
    expect(sidebarTrigger!.getAttribute('aria-label')).not.toBe(mobileTrigger!.getAttribute('aria-label'));
    expect(sidebarTrigger?.getAttribute('aria-expanded')).toBe('false');
    expect(mobileTrigger?.getAttribute('aria-expanded')).toBe('false');
  });

  it('moves route-aware catalog groups into the fly-out navbar', async () => {
    TestBed.overrideProvider(BreakpointObserver, {
      useValue: { observe: () => of({ matches: false, breakpoints: {} }) },
    });
    const fixture = TestBed.createComponent(App);
    const router = TestBed.inject(Router);
    await router.navigateByUrl('/components/button');
    fixture.detectChanges();
    await fixture.whenStable();
    expect(
      fixture.componentInstance.flyoutNavigationGroups().some((group) => group.label === 'Forms & Inputs'),
    ).toBeTrue();
    const element: HTMLElement = fixture.nativeElement;
    expect(element.querySelector('eg-layout-flyout-navbar')).not.toBeNull();
    expect(element.querySelector('[aria-label="Secondary navigation"]')).toBeNull();
    await router.navigateByUrl('/examples/pricing');
    fixture.detectChanges();
    expect(fixture.componentInstance.flyoutNavigationGroups().map((group) => group.label)).toEqual(['Product Flows']);
    await router.navigateByUrl('/home');
    fixture.detectChanges();
    expect(fixture.componentInstance.flyoutNavigationGroups()).toEqual([]);
    expect(element.querySelector('eg-layout-flyout-navbar')).toBeNull();
  });
});
