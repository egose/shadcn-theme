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
 * Narrow-viewport contract: every component demo must lay out inside a
 * 320 px-wide phone viewport without forcing page-level horizontal overflow.
 *
 * The gallery shell wraps the routed page in `p-5` padding, so the content
 * box at 320 px is ~280 px wide; the check renders each page inside a
 * 280 px-wide wrapper and asserts no horizontal overflow.
 */
describe('Component pages at narrow viewport width', () => {
  const entries = catalogEntriesByKind('component');

  beforeEach(async () => {
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
        provideRouter([]),
        { provide: BrnDialogRef, useValue: { close: () => undefined, state: signal('closed') } },
      ],
    }).compileComponents();
  });

  for (const entry of entries) {
    it(`/components/${entry.slug} keeps content within a 320px-wide phone viewport`, async () => {
      const componentType = await entry.load();
      const wrapper = document.createElement('div');
      // 320px viewport minus the gallery's horizontal padding on each side.
      wrapper.style.cssText = 'width:280px; box-sizing:border-box; position:absolute; top:0; left:0;';
      document.body.appendChild(wrapper);
      try {
        const fixture = TestBed.createComponent(componentType);
        wrapper.appendChild(fixture.nativeElement as HTMLElement);
        fixture.detectChanges();
        await fixture.whenStable();
        await fixture.whenStable();
        // Measure page-level horizontal overflow. Subtrees hidden by the user agent
        // or clipped by their own scroll container do not overflow the page.
        // `hlm-select-content` subtrees list the closed select's options; this is
        // package-internal overlay plumbing, not page layout.
        const skipSubtree = (el: Element): boolean =>
          el.tagName === 'HLM-SELECT-CONTENT' || getComputedStyle(el).display === 'none';

        const wrapperRect = wrapper.getBoundingClientRect();
        let maxRight = wrapperRect.left;
        const offenders: string[] = [];

        const walk = (parent: Element): void => {
          for (const child of Array.from(parent.children)) {
            if (skipSubtree(child)) continue;
            const style = getComputedStyle(child);
            const clipsHorizontally =
              child.scrollWidth > child.clientWidth + 1 && ['auto', 'scroll', 'hidden'].includes(style.overflowX);
            const right = child.getBoundingClientRect().right;
            if (right > maxRight) {
              maxRight = right;
              if (right > wrapperRect.right + 1 && offenders.length < 12) {
                offenders.push(
                  `${child.tagName.toLowerCase()}.${(child.getAttribute('class') ?? '').slice(0, 60)}` +
                    `[w=${Math.round(child.getBoundingClientRect().width)},x=${Math.round(child.getBoundingClientRect().left)}]`,
                );
              }
            }
            // A clipping container (e.g. `hlmTableContainer`'s overflow-x-auto or
            // a demo app-shell with overflow-hidden) visually crops its subtree, so
            // descendants cannot cause page-level overflow; measure the container
            // itself but do not descend.
            if (clipsHorizontally) continue;
            walk(child);
          }
        };
        walk(wrapper);

        const overflow = Math.max(0, Math.round(maxRight - wrapperRect.right));
        expect(overflow)
          .withContext(
            `${entry.slug}: content overflows a narrow viewport by ${overflow}px; offenders: ${offenders.join(' | ')}`,
          )
          .toBeLessThanOrEqual(1);
      } finally {
        wrapper.remove();
      }
    });
  }
});
