import { ApplicationRef, provideZonelessChangeDetection, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { BrnDialogRef } from '@spartan-ng/brain/dialog';
import { provideExposesStateProvider, provideExposedSideProvider } from '@spartan-ng/brain/core';
import { HlmDrawerContent } from '@egose/shadcn-theme-ng/drawer';
import { HlmHoverCardContent } from '@egose/shadcn-theme-ng/hover-card';
import { HlmPopoverContent } from '@egose/shadcn-theme-ng/popover';
import { App } from './app';
import { InputPage } from './pages/components/input/input';
import { InputGroupPage } from './pages/components/input-group/input-group';
import { SelectPage } from './pages/components/select/select';
import { SliderPage } from './pages/components/slider/slider';
import { SwitchPage } from './pages/components/switch/switch';
import { InputOtpPage } from './pages/components/input-otp/input-otp';
import { ComboboxPage } from './pages/components/combobox/combobox';
import { AutocompletePage } from './pages/components/autocomplete/autocomplete';
import { CommandPage } from './pages/components/command/command';
import { SearchableMultiselectPage } from './pages/components/searchable-multiselect/searchable-multiselect';
import { DatePickerPage } from './pages/components/date-picker/date-picker';
import { TogglePage } from './pages/components/toggle/toggle';
import { DrawerPage } from './pages/components/drawer/drawer';
import { AlertDialogPage } from './pages/components/alert-dialog/alert-dialog';
import { NavigationMenuPage } from './pages/components/navigation-menu/navigation-menu';
import { SidebarPage } from './pages/components/sidebar/sidebar';
import { BreadcrumbPage } from './pages/components/breadcrumb/breadcrumb';
import { PaginationPage } from './pages/components/pagination/pagination';
import { DropdownMenuPage } from './pages/components/dropdown-menu/dropdown-menu';
import { TablePage } from './pages/components/table/table';
import { CardPage } from './pages/components/card/card';
import { EmptyPage } from './pages/components/empty/empty';
import { ItemPage } from './pages/components/item/item';
import { TextareaPage } from './pages/components/textarea/textarea';
import { NativeSelectPage } from './pages/components/native-select/native-select';
import { ButtonPage } from './pages/components/button/button';
import { HoverCardPage } from './pages/components/hover-card/hover-card';
import { MenubarPage } from './pages/components/menubar/menubar';

async function settle(fixture: ComponentFixture<unknown>): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 100));
  fixture.detectChanges();
  await fixture.whenStable();
  fixture.detectChanges();
}

/**
 * Polls `probe` until it passes instead of sleeping a fixed delay, so specs
 * stay green on loaded runners (CI) where overlays and focus traps mount
 * slower than locally. Resolves true when the probe passed in time.
 */
async function waitForCondition(
  probe: () => boolean,
  fixture: ComponentFixture<unknown>,
  attempts = 100,
  intervalMs = 50,
): Promise<boolean> {
  const appRef = TestBed.inject(ApplicationRef);
  for (let attempt = 0; attempt < attempts; attempt++) {
    // Tick the whole application: overlay content (dialog/drawer panels)
    // attaches to the ApplicationRef outside the fixture subtree, so
    // fixture.detectChanges() alone never re-checks it — and the scheduled
    // zoneless ticks it relies on starve under CPU contention (CI).
    appRef.tick();
    if (probe()) {
      return true;
    }
    await new Promise((resolve) => setTimeout(resolve, intervalMs));
  }
  appRef.tick();
  return probe();
}

function buttonByText(
  host: { querySelectorAll(selectors: string): NodeListOf<Element> },
  text: string,
): HTMLButtonElement | null {
  const buttons = Array.from(host.querySelectorAll('button'));
  return (buttons.find((button) => button.textContent?.trim() === text) as HTMLButtonElement | undefined) ?? null;
}

function overlayButton(text: string): HTMLButtonElement | null {
  const buttons = Array.from(document.querySelectorAll('.cdk-overlay-pane button'));
  return (buttons.find((button) => button.textContent?.trim() === text) as HTMLButtonElement | undefined) ?? null;
}

/** Every enabled input/textarea/select in the host must have a label or aria name. */
function expectAllControlsNamed(host: HTMLElement, context: string): void {
  const controls = Array.from(
    host.querySelectorAll('input:not([disabled]), textarea:not([disabled]), select:not([disabled])'),
  );
  expect(controls.length).withContext(`${context}: expected demo controls`).toBeGreaterThan(0);
  for (const control of controls) {
    const el = control as HTMLInputElement;
    const named =
      (el.labels?.length ?? 0) > 0 ||
      Boolean(el.getAttribute('aria-label')) ||
      Boolean(el.getAttribute('aria-labelledby'));
    expect(named)
      .withContext(`${context}: control ${el.outerHTML.slice(0, 120)} has no accessible name`)
      .toBeTrue();
  }
}

function expectNoPlaceholderAnchors(host: HTMLElement, context: string): void {
  expect(host.querySelector('a[href="#"]')).withContext(`${context}: placeholder href="#"`).toBeNull();
}

describe('ANGEX-06 semantics audit', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection(), provideRouter([])],
    }).compileComponents();
  });

  afterEach(() => {
    // Overlay panes (drawer, dialog, menus) render outside the fixture host;
    // drop the shared container so later specs start from a clean document.
    document.querySelector('.cdk-overlay-container')?.remove();
    TestBed.resetTestingModule();
  });

  describe('form controls carry accessible names', () => {
    it('labels every input on the Input page and drives save/discard outcomes', async () => {
      TestBed.configureTestingModule({ imports: [InputPage] });
      const fixture = TestBed.createComponent(InputPage);
      fixture.detectChanges();
      const host = fixture.nativeElement as HTMLElement;

      expectAllControlsNamed(host, 'input page');
      expectNoPlaceholderAnchors(host, 'input page');

      buttonByText(host, 'Save changes')!.click();
      fixture.detectChanges();
      expect(host.querySelector('[role="status"]')?.textContent).toContain('jane@egose.dev');

      buttonByText(host, 'Cancel')!.click();
      fixture.detectChanges();
      expect(host.querySelector('[role="status"]')?.textContent).toContain('discarded');

      const first = host.querySelector('input') as HTMLInputElement;
      first.focus();
      expect(document.activeElement).withContext('input receives keyboard focus').toBe(first);
    });

    it('names input-group fields and records apply/send outcomes', async () => {
      TestBed.configureTestingModule({ imports: [InputGroupPage] });
      const fixture = TestBed.createComponent(InputGroupPage);
      fixture.detectChanges();
      const host = fixture.nativeElement as HTMLElement;

      expectAllControlsNamed(host, 'input-group page');

      buttonByText(host, 'Apply')!.click();
      fixture.detectChanges();
      expect(host.textContent).toContain('Monthly budget of $249 applied');

      buttonByText(host, 'Send')!.click();
      fixture.detectChanges();
      expect(host.textContent).toContain('Message sent to #design-review');
    });

    it('associates composite control labels with their inner fields', async () => {
      for (const page of [ComboboxPage, AutocompletePage, CommandPage, DatePickerPage, InputOtpPage]) {
        TestBed.resetTestingModule();
        await TestBed.configureTestingModule({
          imports: [page],
          providers: [provideZonelessChangeDetection(), provideRouter([])],
        }).compileComponents();
        const fixture = TestBed.createComponent(page);
        fixture.detectChanges();
        const host = fixture.nativeElement as HTMLElement;
        const label = host.querySelector('label') as HTMLLabelElement;
        expect(label).withContext(`${page.name} renders a label`).not.toBeNull();
        const target = label?.htmlFor ? host.querySelector(`#${CSS.escape(label.htmlFor)}`) : null;
        expect(target).withContext(`${page.name}: label for="${label?.htmlFor}" resolves`).not.toBeNull();
      }
    });

    it('names the searchable-multiselect, select, slider, and switch controls', async () => {
      for (const page of [SearchableMultiselectPage, SelectPage]) {
        TestBed.resetTestingModule();
        await TestBed.configureTestingModule({
          imports: [page],
          providers: [provideZonelessChangeDetection(), provideRouter([])],
        }).compileComponents();
        const fixture = TestBed.createComponent(page);
        fixture.detectChanges();
        expect((fixture.nativeElement as HTMLElement).querySelector('label'))
          .withContext(`${page.name} renders a visible label`)
          .not.toBeNull();
      }

      TestBed.resetTestingModule();
      await TestBed.configureTestingModule({
        imports: [SliderPage],
        providers: [provideZonelessChangeDetection(), provideRouter([])],
      }).compileComponents();
      const sliderFixture = TestBed.createComponent(SliderPage);
      sliderFixture.detectChanges();
      const sliderHost = sliderFixture.nativeElement as HTMLElement;
      const thumb = sliderHost.querySelector('[role="slider"]');
      expect(thumb?.getAttribute('aria-labelledby')).toBe('volume-label');
      expect(sliderHost.querySelector('#volume-label')?.textContent).toContain('Volume');

      TestBed.resetTestingModule();
      await TestBed.configureTestingModule({
        imports: [SwitchPage],
        providers: [provideZonelessChangeDetection(), provideRouter([])],
      }).compileComponents();
      const switchFixture = TestBed.createComponent(SwitchPage);
      switchFixture.detectChanges();
      const switchHost = switchFixture.nativeElement as HTMLElement;
      const labelledBy = switchHost.querySelector('[aria-labelledby]')?.getAttribute('aria-labelledby');
      expect(labelledBy).withContext('switch exposes aria-labelledby').toBe('notifications-label');
      expect(switchHost.querySelector(`#${labelledBy}`)?.textContent).toContain('Enable notifications');
    });

    it('saves native-select settings through a real form submit/reset', async () => {
      TestBed.resetTestingModule();
      await TestBed.configureTestingModule({
        imports: [NativeSelectPage],
        providers: [provideZonelessChangeDetection(), provideRouter([])],
      }).compileComponents();
      const fixture = TestBed.createComponent(NativeSelectPage);
      fixture.detectChanges();
      const host = fixture.nativeElement as HTMLElement;

      expect(host.querySelectorAll('label').length).toBeGreaterThanOrEqual(3);
      buttonByText(host, 'Save settings')!.click();
      fixture.detectChanges();
      expect(host.querySelector('[role="status"]')?.textContent).toContain('saved');
    });

    it('flips toggle pressed state with a visible outcome', async () => {
      TestBed.resetTestingModule();
      await TestBed.configureTestingModule({
        imports: [TogglePage],
        providers: [provideZonelessChangeDetection(), provideRouter([])],
      }).compileComponents();
      const fixture = TestBed.createComponent(TogglePage);
      fixture.detectChanges();
      const host = fixture.nativeElement as HTMLElement;

      const toggle = buttonByText(host, 'Bold')!;
      expect(toggle.getAttribute('aria-pressed')).toBe('false');
      toggle.focus();
      expect(document.activeElement).withContext('toggle receives keyboard focus').toBe(toggle);
      toggle.click();
      fixture.detectChanges();
      expect(toggle.getAttribute('aria-pressed')).toBe('true');
      expect(host.querySelector('[role="status"]')?.textContent).toContain('Bold formatting is on');
    });
  });

  describe('overlays open, trap focus, and report outcomes', () => {
    it('opens the drawer, keeps focus inside, and submits visibly', async () => {
      TestBed.resetTestingModule();
      await TestBed.configureTestingModule({
        imports: [DrawerPage],
        providers: [provideZonelessChangeDetection(), provideRouter([])],
      }).compileComponents();
      const fixture = TestBed.createComponent(DrawerPage);
      fixture.detectChanges();
      const host = fixture.nativeElement as HTMLElement;

      const trigger = buttonByText(host, 'Open drawer')!;
      trigger.focus();
      expect(document.activeElement).toBe(trigger);
      trigger.click();
      await fixture.whenStable();
      // The overlay subtree (dialog/drawer panels) attaches to the
      // ApplicationRef outside the fixture tree, and the zoneless ticks that
      // would re-check its OnPush host bindings starve under CPU contention
      // (CI). So probe state the overlay writes synchronously via the DOM
      // (spartan sets data-state on the pane in the dialog-ref constructor)
      // instead of the content host binding, which needs a subtree check.
      const opened = await waitForCondition(
        () =>
          document
            .querySelector('[data-slot="drawer-content"]')
            ?.closest('.cdk-overlay-pane')
            ?.getAttribute('data-state') === 'open',
        fixture,
        300,
        50,
      );
      await fixture.whenStable();
      fixture.detectChanges();
      const openContent = document.querySelector('[data-slot="drawer-content"]');
      expect(opened).withContext('drawer reports open state').toBeTrue();
      expect(openContent).withContext('drawer content renders in the overlay').not.toBeNull();
      const drawerFocused = await waitForCondition(
        () => openContent?.contains(document.activeElement) ?? false,
        fixture,
      );
      expect(drawerFocused).withContext('focus moves into the drawer').toBeTrue();

      const submit = Array.from(document.querySelectorAll('[data-slot="drawer-content"] button')).find(
        (button) => button.textContent?.trim() === 'Submit',
      ) as HTMLButtonElement;
      submit.click();
      await settle(fixture);
      expect(host.querySelector('[role="status"]')?.textContent).toContain('Task moved');

      const cancel = Array.from(document.querySelectorAll('[data-slot="drawer-content"] button')).find(
        (button) => button.textContent?.trim() === 'Cancel',
      ) as HTMLButtonElement;
      cancel.click();
      // Close tears down through exit animations, which also starve under
      // load; poll for removal instead of a fixed sleep.
      const closed = await waitForCondition(
        () => document.querySelector('[data-slot="drawer-content"]') === null,
        fixture,
      );
      expect(closed).withContext('drawer closes').toBeTrue();
      // Polling above can legitimately exceed jasmine's 5s default timeout on
      // loaded runners; the suite still fails fast on real regressions.
    }, 60000);

    it('confirms alert-dialog deletion with a visible outcome', async () => {
      TestBed.resetTestingModule();
      await TestBed.configureTestingModule({
        imports: [AlertDialogPage],
        providers: [
          provideZonelessChangeDetection(),
          provideRouter([]),
          { provide: BrnDialogRef, useValue: { close: () => undefined, state: signal('closed') } },
        ],
      }).compileComponents();
      const fixture = TestBed.createComponent(AlertDialogPage);
      fixture.detectChanges();
      const host = fixture.nativeElement as HTMLElement;

      buttonByText(host, 'Delete account')!.click();
      // The overlay mounts asynchronously; poll instead of a fixed sleep so
      // loaded runners (CI) don't flap.
      const paneOpened = await waitForCondition(() => document.querySelector('.cdk-overlay-pane') !== null, fixture);
      await fixture.whenStable();
      fixture.detectChanges();
      const dialogPane = document.querySelector('.cdk-overlay-pane');
      expect(paneOpened).withContext('alert dialog opens an overlay').toBeTrue();
      expect(dialogPane).withContext('alert dialog opens an overlay').not.toBeNull();
      const dialogFocused = await waitForCondition(
        () => dialogPane?.contains(document.activeElement) ?? false,
        fixture,
      );
      expect(dialogFocused).withContext('focus moves into the dialog').toBeTrue();

      overlayButton('Delete')!.click();
      await settle(fixture);
      expect(host.querySelector('[role="status"]')?.textContent).toContain('deletion confirmed');
    }, 30000);
  });

  describe('navigation uses real routes and operable controls', () => {
    it('expands the navigation menu by keyboard/pointer with real local links', async () => {
      TestBed.resetTestingModule();
      await TestBed.configureTestingModule({
        imports: [NavigationMenuPage],
        providers: [provideZonelessChangeDetection(), provideRouter([])],
      }).compileComponents();
      const fixture = TestBed.createComponent(NavigationMenuPage);
      fixture.detectChanges();
      const host = fixture.nativeElement as HTMLElement;

      expectNoPlaceholderAnchors(host, 'navigation menu');

      const trigger = buttonByText(host, 'Getting Started')!;
      trigger.focus();
      expect(document.activeElement).toBe(trigger);
      trigger.click();
      await settle(fixture);

      expect(trigger.getAttribute('aria-expanded')).toBe('true');
      const links = Array.from(document.querySelectorAll('.cdk-overlay-pane a, a[href]')).concat(
        Array.from(host.querySelectorAll('a')),
      );
      const hrefs = links.map((link) => link.getAttribute('href')).filter(Boolean) as string[];
      expect(hrefs.length).withContext('menu exposes links').toBeGreaterThan(0);
      expect(hrefs.every((href) => href !== '#'))
        .withContext(`no placeholder links: ${hrefs}`)
        .toBeTrue();
      expect(hrefs.some((href) => href.includes('/components/')))
        .withContext(`links resolve locally: ${hrefs}`)
        .toBeTrue();
      trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
      await settle(fixture);
    });

    it('names sidebar icon-only controls and records selection', async () => {
      TestBed.resetTestingModule();
      // The sidebar renders its navigation inside a mobile sheet below its
      // breakpoint (the headless suite runs narrow); force the desktop branch
      // so the demo navigation is in the DOM for these assertions.
      spyOn(window, 'matchMedia').and.returnValue({
        matches: false,
        addEventListener: () => {},
        removeEventListener: () => {},
      } as unknown as MediaQueryList);
      await TestBed.configureTestingModule({
        imports: [SidebarPage],
        providers: [provideZonelessChangeDetection(), provideRouter([])],
      }).compileComponents();
      const fixture = TestBed.createComponent(SidebarPage);
      fixture.detectChanges();
      const host = fixture.nativeElement as HTMLElement;

      const triggers = Array.from(host.querySelectorAll('button[data-slot="sidebar-trigger"]'));
      expect(triggers.length).toBeGreaterThanOrEqual(2);
      const names = triggers.map((trigger) => trigger.textContent?.trim());
      names.forEach((name) => expect(name).withContext('sidebar trigger has a name').toBeTruthy());
      expect(new Set(names).size).withContext('sidebar triggers are distinct').toBe(names.length);

      const groupAction = host.querySelector('button[data-slot="sidebar-group-action"]');
      expect(groupAction?.getAttribute('aria-label')).toContain('Primary');

      expectAllControlsNamed(host, 'sidebar search');
      expectNoPlaceholderAnchors(host, 'sidebar');

      const components = buttonByText(host, 'Components')!;
      components.focus();
      expect(document.activeElement).toBe(components);
      components.click();
      fixture.detectChanges();
      expect(host.querySelector('[role="status"]')?.textContent).toContain('Components is selected');
    });

    it('keeps breadcrumb and pagination on real, operable targets', async () => {
      TestBed.resetTestingModule();
      await TestBed.configureTestingModule({
        imports: [BreadcrumbPage],
        providers: [provideZonelessChangeDetection(), provideRouter([])],
      }).compileComponents();
      const crumbFixture = TestBed.createComponent(BreadcrumbPage);
      crumbFixture.detectChanges();
      const crumbHost = crumbFixture.nativeElement as HTMLElement;
      const crumbHrefs = Array.from(crumbHost.querySelectorAll('a')).map((link) => link.getAttribute('href'));
      expect(crumbHrefs).toEqual(['/', '/components']);
      expectNoPlaceholderAnchors(crumbHost, 'breadcrumb');

      TestBed.resetTestingModule();
      await TestBed.configureTestingModule({
        imports: [PaginationPage],
        providers: [provideZonelessChangeDetection(), provideRouter([])],
      }).compileComponents();
      const pageFixture = TestBed.createComponent(PaginationPage);
      pageFixture.detectChanges();
      const pageHost = pageFixture.nativeElement as HTMLElement;

      const pageTwo = buttonByText(pageHost, '2')!;
      pageTwo.focus();
      expect(document.activeElement).toBe(pageTwo);
      pageTwo.click();
      pageFixture.detectChanges();
      expect(buttonByText(pageHost, '2')?.getAttribute('aria-current')).toBe('page');
      expect(pageHost.querySelector('[role="status"]')?.textContent).toContain('Showing page 2 of 3');
    });

    it('records dropdown-menu choices as visible outcomes', async () => {
      TestBed.resetTestingModule();
      await TestBed.configureTestingModule({
        imports: [DropdownMenuPage],
        providers: [provideZonelessChangeDetection(), provideRouter([])],
      }).compileComponents();
      const fixture = TestBed.createComponent(DropdownMenuPage);
      fixture.detectChanges();
      const host = fixture.nativeElement as HTMLElement;

      const trigger = buttonByText(host, 'Open')!;
      trigger.focus();
      expect(document.activeElement).toBe(trigger);
      trigger.click();
      await settle(fixture);

      const item = overlayButton('Profile') ?? buttonByText(document as unknown as HTMLElement, 'Profile');
      expect(item).withContext('menu item is reachable').not.toBeNull();
      item!.click();
      await settle(fixture);
      expect(host.querySelector('[role="status"]')?.textContent).toContain('Profile selected');
    });

    it('links the button anchor and hover-card trigger to real destinations', async () => {
      TestBed.resetTestingModule();
      TestBed.overrideDirective(HlmHoverCardContent, {
        add: {
          providers: [
            provideExposesStateProvider({ state: signal('closed') }),
            provideExposedSideProvider({ side: signal('bottom') }),
          ],
        },
      });
      await TestBed.configureTestingModule({
        imports: [ButtonPage, HoverCardPage],
        providers: [provideZonelessChangeDetection(), provideRouter([])],
      }).compileComponents();

      const buttonFixture = TestBed.createComponent(ButtonPage);
      buttonFixture.detectChanges();
      const buttonHost = buttonFixture.nativeElement as HTMLElement;
      const docs = buttonHost.querySelector('a');
      expect(docs?.getAttribute('href')).withContext('Documentation anchor has a destination').not.toBeNull();
      expect(docs?.getAttribute('href')).not.toBe('#');

      const hoverFixture = TestBed.createComponent(HoverCardPage);
      hoverFixture.detectChanges();
      const hoverHost = hoverFixture.nativeElement as HTMLElement;
      expectNoPlaceholderAnchors(hoverHost, 'hover card');
      expect(hoverHost.querySelector('a')?.getAttribute('href')).toContain('https://');
    });

    it('marks menubar triggers as explicitly demo-only', async () => {
      TestBed.resetTestingModule();
      await TestBed.configureTestingModule({
        imports: [MenubarPage],
        providers: [provideZonelessChangeDetection(), provideRouter([])],
      }).compileComponents();
      const fixture = TestBed.createComponent(MenubarPage);
      fixture.detectChanges();
      const host = fixture.nativeElement as HTMLElement;
      const triggers = Array.from(host.querySelectorAll('button'));
      expect(triggers.length).toBe(3);
      for (const trigger of triggers) {
        expect(trigger.disabled).withContext(`${trigger.textContent} is explicitly disabled`).toBeTrue();
        expect(trigger.getAttribute('title')).toContain('Demo only');
      }
      expect(host.textContent).toContain('Demo-only');
    });
  });

  describe('data-display actions change visible state', () => {
    it('exports/creates invoices, notes cards, and clears filters visibly', async () => {
      TestBed.resetTestingModule();
      await TestBed.configureTestingModule({
        imports: [TablePage, CardPage, EmptyPage],
        providers: [provideZonelessChangeDetection(), provideRouter([])],
      }).compileComponents();

      const tableFixture = TestBed.createComponent(TablePage);
      tableFixture.detectChanges();
      const tableHost = tableFixture.nativeElement as HTMLElement;
      buttonByText(tableHost, 'Export')!.click();
      tableFixture.detectChanges();
      expect(tableHost.querySelector('[role="status"]')?.textContent).toContain('Export started');
      buttonByText(tableHost, 'Create invoice')!.click();
      tableFixture.detectChanges();
      expect(tableHost.querySelector('[role="status"]')?.textContent).toContain('INV-2407');

      const cardFixture = TestBed.createComponent(CardPage);
      cardFixture.detectChanges();
      const cardHost = cardFixture.nativeElement as HTMLElement;
      buttonByText(cardHost, 'Ship changes')!.click();
      cardFixture.detectChanges();
      expect(cardHost.querySelector('[role="status"]')?.textContent).toContain('shipped');

      const emptyFixture = TestBed.createComponent(EmptyPage);
      emptyFixture.detectChanges();
      const emptyHost = emptyFixture.nativeElement as HTMLElement;
      buttonByText(emptyHost, 'Clear filters')!.click();
      emptyFixture.detectChanges();
      expect(emptyHost.querySelector('[role="status"]')?.textContent).toContain('filters cleared');
      const browse = Array.from(emptyHost.querySelectorAll('a')).find((link) =>
        link.textContent?.includes('Browse components'),
      );
      expect(browse?.getAttribute('href')).withContext('browse navigates locally').toContain('/components');
    });

    it('opens item rows and sends textarea/native replies with outcomes', async () => {
      TestBed.resetTestingModule();
      await TestBed.configureTestingModule({
        imports: [ItemPage, TextareaPage],
        providers: [provideZonelessChangeDetection(), provideRouter([])],
      }).compileComponents();

      const itemFixture = TestBed.createComponent(ItemPage);
      itemFixture.detectChanges();
      const itemHost = itemFixture.nativeElement as HTMLElement;
      const reviews = Array.from(itemHost.querySelectorAll('button')).filter(
        (button) => button.textContent?.trim() === 'Review',
      );
      expect(reviews.length).toBeGreaterThan(0);
      reviews[0].focus();
      expect(document.activeElement).toBe(reviews[0]);
      reviews[0].click();
      itemFixture.detectChanges();
      expect(itemHost.querySelector('[role="status"]')?.textContent).toContain('Review started');

      const textareaFixture = TestBed.createComponent(TextareaPage);
      textareaFixture.detectChanges();
      const textareaHost = textareaFixture.nativeElement as HTMLElement;
      expectAllControlsNamed(textareaHost, 'textarea page');
      buttonByText(textareaHost, 'Send reply')!.click();
      textareaFixture.detectChanges();
      expect(textareaHost.querySelector('[role="status"]')?.textContent).toContain('sent');
    });
  });

  describe('app shell menus resolve to real destinations', () => {
    it('opens GitHub externally and keeps every menu target local', async () => {
      TestBed.resetTestingModule();
      TestBed.overrideDirective(HlmPopoverContent, {
        add: { providers: [provideExposesStateProvider({ state: signal('closed') })] },
      });
      await TestBed.configureTestingModule({
        imports: [App],
        providers: [provideZonelessChangeDetection(), provideRouter([])],
      }).compileComponents();
      const fixture = TestBed.createComponent(App);
      fixture.detectChanges();
      const app = fixture.componentInstance;
      const legacy = app as unknown as Record<string, unknown>;

      expect(legacy['onBilling']).withContext('miswired billing handler removed').toBeUndefined();
      expect(legacy['onSupport']).withContext('console-only support handler removed').toBeUndefined();
      expect(legacy['logout']).withContext('dead logout handler removed').toBeUndefined();

      const openSpy = spyOn(window, 'open').and.stub();
      app.openRepository();
      expect(openSpy).toHaveBeenCalledWith('https://github.com/egose/shadcn-theme', '_blank', 'noopener');

      const sections = app.menus;
      const github = sections.flatMap((section) => section.items).find((item) => item.label === 'GitHub');
      expect(typeof github?.action)
        .withContext('GitHub keeps an external action')
        .toBe('function');
      const linked = sections
        .flatMap((section) => section.items)
        .filter((item) => item.link)
        .map((item) => item.link as string);
      expect(linked.length).toBeGreaterThan(0);
      for (const link of linked) {
        expect(link.startsWith('/components/')).withContext(`shell link is local: ${link}`).toBeTrue();
      }
    });
  });
});
