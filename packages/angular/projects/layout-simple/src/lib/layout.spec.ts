import { BreakpointObserver, type BreakpointState } from '@angular/cdk/layout';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { configureLibraryTestBed } from '../../../../test/setup';
import { EG_LAYOUT_SIMPLE_MOBILE_BREAKPOINT, EgLayoutSimple } from './layout';

@Component({ template: '' })
class RoutePage {}

@Component({ imports: [EgLayoutSimple], template: '<eg-layout-simple /><eg-layout-simple />' })
class MultipleLayouts {}

describe('EgLayoutSimple', () => {
  let fixture: ComponentFixture<EgLayoutSimple>;
  let element: HTMLElement;
  let breakpoints: Subject<BreakpointState>;
  let observedQueries: (string | readonly string[])[];
  let action: jasmine.Spy;

  function mobileTrigger(): HTMLButtonElement {
    return element.querySelector<HTMLButtonElement>('button[aria-controls$="-mobile-menu"]')!;
  }
  function mobileMenu(): HTMLElement | null {
    return element.querySelector('[id$="-mobile-menu"]');
  }
  function setMobile(matches: boolean): void {
    breakpoints.next({ matches, breakpoints: {} });
    fixture.detectChanges();
  }

  beforeEach(async () => {
    breakpoints = new Subject<BreakpointState>();
    observedQueries = [];
    configureLibraryTestBed([
      {
        provide: BreakpointObserver,
        useValue: {
          observe: (queries: string | readonly string[]) => {
            observedQueries.push(queries);
            return breakpoints;
          },
        },
      },
    ]);
    await TestBed.configureTestingModule({
      imports: [EgLayoutSimple, MultipleLayouts],
      providers: [provideRouter([{ path: '**', component: RoutePage }])],
    }).compileComponents();
    fixture = TestBed.createComponent(EgLayoutSimple);
    action = jasmine.createSpy('navigation action');
    fixture.componentRef.setInput('sidebarEnabled', true);
    fixture.componentRef.setInput('footerEnabled', true);
    fixture.componentRef.setInput('primaryNavigation', [
      { label: 'Home', link: '/' },
      { label: 'Components', link: '/components', activeMatch: 'prefix' },
    ]);
    fixture.componentRef.setInput('sectionNavigation', [{ label: 'Run action', action }]);
    fixture.componentRef.setInput('navigationGroups', [{ label: 'Resources', items: [{ label: 'Guides', action }] }]);
    fixture.componentRef.setInput('secondaryNavigationGroups', [
      { label: 'Forms', items: [{ label: 'Input', link: '/components/input' }] },
    ]);
    fixture.componentRef.setInput('utilityNavigation', [{ label: 'Unavailable', disabled: true, action }]);
    fixture.detectChanges();
    element = fixture.nativeElement;
  });

  afterEach(() => fixture.destroy());

  it('observes the CSS mobile boundary and releases the subscription', () => {
    expect(observedQueries).toEqual([[EG_LAYOUT_SIMPLE_MOBILE_BREAKPOINT]]);
    expect(EG_LAYOUT_SIMPLE_MOBILE_BREAKPOINT).toBe('(max-width: 767.98px)');
    expect(breakpoints.observed).toBeTrue();
    fixture.destroy();
    expect(breakpoints.observed).toBeFalse();
  });

  it('renders named navigation, one main landmark, and a working skip link', () => {
    expect(element.querySelectorAll('main').length).toBe(1);
    expect(element.querySelector('header')).not.toBeNull();
    expect(element.querySelector('footer')).not.toBeNull();
    for (const nav of element.querySelectorAll('nav')) expect(nav.getAttribute('aria-label')).toBeTruthy();
    const main = element.querySelector('main')!;
    element.querySelector<HTMLAnchorElement>(`a[href="#${main.id}"]`)!.click();
    expect(document.activeElement).toBe(main);
  });

  it('uses unique controlled-region and content IDs for multiple shells', () => {
    const multiple = TestBed.createComponent(MultipleLayouts);
    multiple.detectChanges();
    const triggers = Array.from(
      multiple.nativeElement.querySelectorAll('button[aria-controls]'),
    ) as HTMLButtonElement[];
    const ids = triggers.map((trigger) => trigger.getAttribute('aria-controls'));
    expect(new Set(ids).size).toBe(ids.length);
    const mainIds = Array.from((multiple.nativeElement as HTMLElement).querySelectorAll('main')).map((main) => main.id);
    expect(new Set(mainIds).size).toBe(2);
    multiple.destroy();
  });

  it('shows a brand fallback without requesting an empty image URL', () => {
    expect(element.querySelector('header img')).toBeNull();
    expect(element.querySelector('header a')?.getAttribute('aria-label')).toBe('Workspace home');
  });

  it('announces loading instead of leaving an empty page', () => {
    fixture.componentRef.setInput('loading', true);
    fixture.detectChanges();
    expect(element.querySelector('main')?.getAttribute('aria-busy')).toBe('true');
    expect(element.querySelector('[role="status"]')?.textContent).toContain('Loading content');
    expect(element.querySelector<HTMLElement>('.eg-layout-simple-main-content')?.hidden).toBeTrue();
  });

  it('marks the active section and exact destination without marking Home', async () => {
    await TestBed.inject(Router).navigateByUrl('/components/input?example=1');
    fixture.detectChanges();
    await fixture.whenStable();
    const active = Array.from(element.querySelectorAll('a[aria-current="page"]')).map((link) =>
      link.textContent?.trim(),
    );
    expect(active).toContain('Components');
    expect(active).toContain('Input');
    expect(active).not.toContain('Home');
  });

  it('runs section actions and leaves disabled actions inactive', () => {
    element.querySelector<HTMLButtonElement>('nav[aria-label="Section navigation"] button')!.click();
    expect(action).toHaveBeenCalledTimes(1);
    element.querySelector<HTMLButtonElement>('nav[aria-label="Utility navigation"] button')!.click();
    expect(action).toHaveBeenCalledTimes(1);
  });

  it('opens grouped navigation using a keyboard-accessible menu trigger', async () => {
    const trigger = element.querySelector<HTMLButtonElement>('[data-slot="dropdown-menu-trigger"]')!;
    trigger.focus();
    const key = new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true });
    Object.defineProperty(key, 'keyCode', { value: 40 });
    trigger.dispatchEvent(key);
    fixture.detectChanges();
    await fixture.whenStable();
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
    expect(document.querySelector('[role="menuitem"]')?.textContent).toContain('Guides');
    (document.querySelector('[role="menuitem"]') as HTMLButtonElement).click();
    expect(action).toHaveBeenCalledTimes(1);
  });

  it('supports custom accessible trigger labels', () => {
    fixture.componentRef.setInput('sidebarToggleLabel', 'Open catalog');
    fixture.componentRef.setInput('mobileMenuLabel', 'Browse pages');
    fixture.detectChanges();
    expect(element.querySelector('[aria-controls$="-sidebar"]')?.getAttribute('aria-label')).toBe('Open catalog');
    expect(mobileTrigger().getAttribute('aria-label')).toBe('Browse pages');
  });

  it('toggles the mobile region and restores focus on Escape', () => {
    setMobile(true);
    mobileTrigger().click();
    fixture.detectChanges();
    expect(mobileTrigger().getAttribute('aria-expanded')).toBe('true');
    expect(mobileTrigger().getAttribute('aria-label')).toBe('Close navigation menu');
    expect(mobileMenu()?.id).toBe(mobileTrigger().getAttribute('aria-controls')!);
    const link = mobileMenu()!.querySelector('a')!;
    link.focus();
    link.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    fixture.detectChanges();
    expect(mobileMenu()).toBeNull();
    expect(document.activeElement).toBe(mobileTrigger());
  });

  it('closes after a mobile action and invokes it exactly once', () => {
    setMobile(true);
    mobileTrigger().click();
    fixture.detectChanges();
    mobileMenu()!.querySelector<HTMLButtonElement>('button')!.click();
    fixture.detectChanges();
    expect(action).toHaveBeenCalledTimes(1);
    expect(mobileMenu()).toBeNull();
  });

  it('keeps search available in mobile navigation', () => {
    fixture.componentRef.setInput('searchEnabled', true);
    setMobile(true);
    mobileTrigger().click();
    fixture.detectChanges();
    expect(mobileMenu()?.querySelector('eg-layout-search')).not.toBeNull();
    expect(element.querySelectorAll('eg-layout-search').length).toBe(1);
  });

  it('supports fly-out and secondary navigation together and adapts fly-outs on mobile', () => {
    fixture.componentRef.setInput('flyoutNavigationGroups', [
      { label: 'Build', items: [{ label: 'Fly-out action', action }] },
    ]);
    fixture.detectChanges();
    expect(element.querySelector('eg-layout-flyout-navbar')).not.toBeNull();
    expect(element.querySelector('nav[aria-label="Secondary navigation"]')?.textContent).toContain('Input');
    element.querySelector<HTMLButtonElement>('eg-layout-flyout-navbar nav > button')!.click();
    fixture.detectChanges();
    expect(element.querySelector('[data-slot="flyout-panel"]')).not.toBeNull();
    setMobile(true);
    expect(element.querySelector('eg-layout-flyout-navbar')).toBeNull();
    mobileTrigger().click();
    fixture.detectChanges();
    const details = mobileMenu()!.querySelector('details')!;
    expect(details.open).toBeFalse();
    details.querySelector('summary')!.click();
    expect(details.open).toBeTrue();
    details.querySelector<HTMLButtonElement>('button')!.click();
    fixture.detectChanges();
    expect(action).toHaveBeenCalledTimes(1);
    expect(mobileMenu()).toBeNull();
    setMobile(false);
    expect(element.querySelector('[data-slot="flyout-panel"]')).toBeNull();
  });

  it('closes mobile navigation when crossing the desktop breakpoint', () => {
    setMobile(true);
    mobileTrigger().click();
    fixture.detectChanges();
    setMobile(false);
    setMobile(true);
    expect(mobileMenu()).toBeNull();
    expect(mobileTrigger().getAttribute('aria-expanded')).toBe('false');
  });

  it('closes mobile navigation after programmatic routing', async () => {
    setMobile(true);
    mobileTrigger().click();
    fixture.detectChanges();
    await TestBed.inject(Router).navigateByUrl('/elsewhere');
    fixture.detectChanges();
    expect(mobileMenu()).toBeNull();
  });

  it('follows the sidebar sheet open and close state', async () => {
    const trigger = element.querySelector<HTMLButtonElement>('button[aria-controls$="-sidebar"]')!;
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    trigger.click();
    await fixture.whenStable();
    fixture.detectChanges();
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
    const escape = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true });
    Object.defineProperty(escape, 'keyCode', { value: 27 });
    document.body.dispatchEvent(escape);
    await fixture.whenStable();
    await new Promise((resolve) => setTimeout(resolve, 100));
    fixture.detectChanges();
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
  });
});
