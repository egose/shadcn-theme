import { provideZonelessChangeDetection, signal } from '@angular/core';
import { provideRouter } from '@angular/router';
import { BrnDialogRef } from '@spartan-ng/brain/dialog';
import { provideExposesStateProvider, provideExposedSideProvider } from '@spartan-ng/brain/core';
import { HlmDrawerContent } from '@egose/shadcn-theme-ng/drawer';
import { HlmHoverCardContent } from '@egose/shadcn-theme-ng/hover-card';
import { HlmPopoverContent } from '@egose/shadcn-theme-ng/popover';
import { TestBed } from '@angular/core/testing';
import { catalogEntriesByKind } from '../catalog/catalog';

/**
 * Heading contract for every routed component demo page:
 *
 * - the gallery renders the only `h1`;
 * - each routed page renders exactly one `h2` (its title, via
 *   `app-demo-header`) and never an `h1`;
 * - heading depth never increases by more than one level in document order
 *   (no `h2 -> h4` style skips), while deeper decorative markup from package
 *   internals stays out of scope (only the page's own template is rendered).
 *
 * Overlay titles (`hlmDialogTitle`, `hlmSheetTitle`, ...) are portaled outside
 * the page host and are therefore not part of this per-page assertion.
 */
describe('Component page heading hierarchy', () => {
  const entries = catalogEntriesByKind('component');

  beforeEach(async () => {
    // Popover/hover-card/drawer demo content injects the trigger's exposed state
    // via the node injector at creation; in tests there is no open trigger, so
    // each content directive gets a synthetic closed state (same technique as
    // the app shell spec).
    for (const directive of [HlmPopoverContent, HlmHoverCardContent]) {
      TestBed.overrideDirective(directive, {
        add: {
          providers: [
            provideExposesStateProvider({ state: signal('closed') }),
            provideExposedSideProvider({ side: signal('bottom') }),
          ],
        },
      });
    }
    TestBed.overrideComponent(HlmDrawerContent, {
      add: {
        providers: [
          provideExposesStateProvider({ state: signal('closed') }),
          provideExposedSideProvider({ side: signal('bottom') }),
        ],
      },
    });
    await TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        // Pages use `routerLink` on standalone anchors; a router context is required.
        provideRouter([]),
        // Alert-dialog/drawer demo templates inject the dialog ref for close actions.
        { provide: BrnDialogRef, useValue: { close: () => undefined, state: signal('closed') } },
      ],
    }).compileComponents();
  });

  for (const entry of entries) {
    it(`/components/${entry.slug} follows the h2-first, no-skip contract`, async () => {
      const componentType = await entry.load();
      const fixture = TestBed.createComponent(componentType);
      fixture.detectChanges();
      const host = fixture.nativeElement as HTMLElement;

      const headings = Array.from(host.querySelectorAll('h1,h2,h3,h4,h5,h6')) as HTMLElement[];
      expect(headings.length).withContext(`${entry.slug}: page must render headings`).toBeGreaterThan(0);

      const h1s = headings.filter((h) => h.tagName === 'H1');
      expect(h1s.length).withContext(`${entry.slug}: routed pages must not render h1`).toBe(0);

      const h2s = headings.filter((h) => h.tagName === 'H2');
      expect(h2s.length).withContext(`${entry.slug}: page must render exactly one h2 title`).toBe(1);
      expect(headings[0].tagName).withContext(`${entry.slug}: the first heading must be the h2 page title`).toBe('H2');

      let previous = 2;
      for (const heading of headings.slice(1)) {
        const level = Number(heading.tagName.substring(1));
        expect(level)
          .withContext(
            `${entry.slug}: heading "${heading.textContent?.trim()}" skips a level (h${previous} -> h${level})`,
          )
          .toBeLessThanOrEqual(previous + 1);
        previous = level;
      }
    });
  }
});
