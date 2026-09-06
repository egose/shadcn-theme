import { BreakpointObserver, type BreakpointState } from '@angular/cdk/layout';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Subject } from 'rxjs';
import { configureLibraryTestBed } from '../../../../test/setup';
import { EG_LAYOUT_SIMPLE_MOBILE_BREAKPOINT, EgLayoutSimple } from './layout';

@Component({
  imports: [EgLayoutSimple],
  template: '<eg-layout-simple />',
})
class LayoutHost {}

@Component({
  imports: [EgLayoutSimple],
  template: `
    <eg-layout-simple
      [sidebarEnabled]="true"
      [footerEnabled]="true"
      [rightMenus]="rightMenus"
      [topSecondaryMenus]="groups"
      [userMenus]="userMenus"
    />
  `,
})
class NavigationHost {
  rightMenus = [{ label: 'Settings', action: () => {} }];
  groups = [
    {
      label: 'Observables',
      items: [
        { label: 'Signals', link: '/signals' },
        { label: 'Streams', action: () => {} },
      ],
    },
  ];
  userMenus = [{ label: 'Account', items: [{ label: 'Profile', link: '/profile' }] }];
}

@Component({
  imports: [EgLayoutSimple],
  template: `
    <eg-layout-simple
      [sidebarEnabled]="true"
      [sidebarToggleLabel]="'Open the catalog'"
      [mobileMenuLabel]="'Toggle main menu'"
    />
  `,
})
class CustomLabelHost {}

function installBreakpointSubject(): { breakpoints: Subject<BreakpointState>; observedQueries: string[][] } {
  const breakpoints = new Subject<BreakpointState>();
  const observedQueries: string[][] = [];
  configureLibraryTestBed([
    {
      provide: BreakpointObserver,
      useValue: {
        observe: (queries: string | readonly string[]) => {
          observedQueries.push(Array.isArray(queries) ? [...queries] : [String(queries)]);
          return breakpoints;
        },
      },
    },
  ]);
  return { breakpoints, observedQueries };
}

function setBreakpoint(breakpoints: Subject<BreakpointState>, matches: boolean): void {
  breakpoints.next({ matches, breakpoints: {} });
}

describe('EgLayoutSimple', () => {
  let fixture: ComponentFixture<unknown> | undefined;

  afterEach(() => {
    fixture?.destroy();
    fixture = undefined;
  });

  it('releases its breakpoint subscription on destruction', async () => {
    const { breakpoints } = installBreakpointSubject();
    await TestBed.configureTestingModule({ imports: [LayoutHost], providers: [provideRouter([])] }).compileComponents();
    fixture = TestBed.createComponent(LayoutHost);
    fixture.detectChanges();

    expect(breakpoints.observed).toBeTrue();
    fixture.destroy();
    fixture = undefined;
    expect(breakpoints.observed).toBeFalse();
  });

  it('observes a single mobile breakpoint aligned with the Tailwind md boundary', async () => {
    const { observedQueries } = installBreakpointSubject();
    await TestBed.configureTestingModule({ imports: [LayoutHost], providers: [provideRouter([])] }).compileComponents();
    fixture = TestBed.createComponent(LayoutHost);
    fixture.detectChanges();

    expect(observedQueries).toEqual([[EG_LAYOUT_SIMPLE_MOBILE_BREAKPOINT]]);
    expect(EG_LAYOUT_SIMPLE_MOBILE_BREAKPOINT).toBe('(max-width: 767.98px)');
  });

  describe('landmarks and trigger contracts', () => {
    let breakpoints: Subject<BreakpointState>;
    let element: HTMLElement;

    beforeEach(async () => {
      ({ breakpoints } = installBreakpointSubject());
      await TestBed.configureTestingModule({
        imports: [NavigationHost],
        providers: [provideRouter([])],
      }).compileComponents();
      fixture = TestBed.createComponent(NavigationHost);
      fixture.detectChanges();
      setBreakpoint(breakpoints, false);
      fixture.detectChanges();
      element = (fixture as ComponentFixture<unknown>).nativeElement;
    });

    it('renders exactly one main landmark plus header and footer landmarks', () => {
      expect(element.querySelectorAll('main').length).toBe(1);
      expect(element.querySelectorAll('header').length).toBeGreaterThanOrEqual(1);
      expect(element.querySelectorAll('footer').length).toBeGreaterThanOrEqual(1);
      expect(element.querySelector('.eg-layout-simple-main-content')).not.toBeNull();
    });

    it('gives the icon-only shell triggers distinct accessible names and collapsed state by default', () => {
      const sidebarTrigger = element.querySelector<HTMLButtonElement>(
        'button[aria-controls="eg-layout-simple-sidebar"]',
      );
      const mobileTrigger = element.querySelector<HTMLButtonElement>(
        'button[aria-controls="eg-layout-simple-mobile-menu"]',
      );

      expect(sidebarTrigger?.getAttribute('aria-label')).toBe('Open navigation sidebar');
      expect(mobileTrigger?.getAttribute('aria-label')).toBe('Open navigation menu');
      expect(sidebarTrigger?.getAttribute('aria-expanded')).toBe('false');
      expect(mobileTrigger?.getAttribute('aria-expanded')).toBe('false');
    });

    it('keeps desktop-only navigation rows hidden below the md boundary', () => {
      const topRows = Array.from(element.querySelectorAll('header + nav, header ~ nav'));
      expect(topRows.length).toBeGreaterThan(0);
      for (const row of topRows) {
        const classes = row.className + ' ';
        expect(classes).toContain('tw:hidden');
        expect(classes).toContain('tw:md:flex');
      }
    });
  });

  describe('consumer-overridable trigger labels', () => {
    it('uses the consumer-provided accessible names', async () => {
      installBreakpointSubject();
      await TestBed.configureTestingModule({
        imports: [CustomLabelHost],
        providers: [provideRouter([])],
      }).compileComponents();
      fixture = TestBed.createComponent(CustomLabelHost);
      fixture.detectChanges();
      const element: HTMLElement = fixture.nativeElement;

      expect(
        element.querySelector('button[aria-controls="eg-layout-simple-sidebar"]')?.getAttribute('aria-label'),
      ).toBe('Open the catalog');
      expect(
        element.querySelector('button[aria-controls="eg-layout-simple-mobile-menu"]')?.getAttribute('aria-label'),
      ).toBe('Toggle main menu');
    });
  });

  describe('mobile menu behavior at the viewport boundary', () => {
    let breakpoints: Subject<BreakpointState>;
    let element: HTMLElement;

    function mobileTrigger(): HTMLButtonElement {
      const trigger = element.querySelector<HTMLButtonElement>('button[aria-controls="eg-layout-simple-mobile-menu"]');
      if (!trigger) throw new Error('Mobile menu trigger not found');
      return trigger;
    }

    beforeEach(async () => {
      ({ breakpoints } = installBreakpointSubject());
      await TestBed.configureTestingModule({
        imports: [NavigationHost],
        providers: [provideRouter([])],
      }).compileComponents();
      fixture = TestBed.createComponent(NavigationHost);
      fixture.detectChanges();
      setBreakpoint(breakpoints, true);
      fixture.detectChanges();
      element = (fixture as ComponentFixture<unknown>).nativeElement;
    });

    it('toggles expanded state and renders the controlled region with matching id', () => {
      const trigger = mobileTrigger();
      trigger.click();
      fixture!.detectChanges();

      expect(trigger.getAttribute('aria-expanded')).toBe('true');
      const menu = element.querySelector('#eg-layout-simple-mobile-menu');
      expect(menu).not.toBeNull();

      trigger.click();
      fixture!.detectChanges();
      expect(trigger.getAttribute('aria-expanded')).toBe('false');
      expect(element.querySelector('#eg-layout-simple-mobile-menu')).toBeNull();
    });

    it('closes on Escape and reports the collapsed state', () => {
      const trigger = mobileTrigger();
      trigger.click();
      fixture!.detectChanges();

      const menu = element.querySelector('#eg-layout-simple-mobile-menu')!;
      menu.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
      fixture!.detectChanges();

      expect(trigger.getAttribute('aria-expanded')).toBe('false');
      expect(element.querySelector('#eg-layout-simple-mobile-menu')).toBeNull();
    });

    it('closes after selecting a menu item', () => {
      const trigger = mobileTrigger();
      trigger.click();
      fixture!.detectChanges();

      const item = element.querySelector<HTMLElement>('#eg-layout-simple-mobile-menu button');
      expect(item).not.toBeNull();
      item!.click();
      fixture!.detectChanges();

      expect(trigger.getAttribute('aria-expanded')).toBe('false');
      expect(element.querySelector('#eg-layout-simple-mobile-menu')).toBeNull();
    });

    it('closes an open menu when the viewport crosses from mobile to desktop', () => {
      const trigger = mobileTrigger();
      trigger.click();
      fixture!.detectChanges();
      expect(element.querySelector('#eg-layout-simple-mobile-menu')).not.toBeNull();

      setBreakpoint(breakpoints, false);
      fixture!.detectChanges();

      expect(trigger.getAttribute('aria-expanded')).toBe('false');
      expect(element.querySelector('#eg-layout-simple-mobile-menu')).toBeNull();
    });

    it('does not render the mobile menu region at desktop widths even when toggled previously on mobile', () => {
      const trigger = mobileTrigger();
      trigger.click();
      fixture!.detectChanges();
      setBreakpoint(breakpoints, false);
      fixture!.detectChanges();
      setBreakpoint(breakpoints, true);
      fixture!.detectChanges();

      expect(trigger.getAttribute('aria-expanded')).toBe('false');
      expect(element.querySelector('#eg-layout-simple-mobile-menu')).toBeNull();
    });
  });

  describe('sidebar trigger state', () => {
    it('follows open and close state of the sheet', async () => {
      const { breakpoints } = installBreakpointSubject();
      await TestBed.configureTestingModule({
        imports: [NavigationHost],
        providers: [provideRouter([])],
      }).compileComponents();
      fixture = TestBed.createComponent(NavigationHost);
      fixture.detectChanges();
      setBreakpoint(breakpoints, false);
      fixture.detectChanges();
      await fixture.whenStable();
      const element: HTMLElement = fixture.nativeElement;

      const trigger = element.querySelector<HTMLButtonElement>('button[aria-controls="eg-layout-simple-sidebar"]')!;
      expect(trigger.getAttribute('aria-expanded')).toBe('false');

      trigger.click();
      await fixture.whenStable();
      fixture.detectChanges();
      expect(trigger.getAttribute('aria-expanded')).toBe('true');
      expect(document.querySelector('#eg-layout-simple-sidebar')).not.toBeNull();

      // CDK's dialog keyboard handling listens on body keydown and checks keyCode,
      // which KeyboardEventInit cannot set.
      const escape = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true });
      Object.defineProperty(escape, 'keyCode', { value: 27 });
      document.body.dispatchEvent(escape);
      await fixture.whenStable();
      // BrnDialog closes through afterNextRender; give the overlay a frame to finish.
      await new Promise((resolve) => setTimeout(resolve, 100));
      fixture.detectChanges();
      expect(trigger.getAttribute('aria-expanded')).toBe('false');
    });
  });
});
