import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Route, Router, provideRouter } from '@angular/router';
import { RouterOutlet } from '@angular/router';
import { Component } from '@angular/core';
import { routes } from '../../app.routes';
import {
  REVIEWED_EXAMPLE_BASELINE,
  catalogChildRoutes,
  catalogEntriesByKind,
  catalogLink,
  catalogMenuGroups,
  duplicateValues,
} from '../../catalog/catalog';
import { ExamplesLayout } from './examples';

/**
 * Registry integration for the real-example surface (`/examples/<slug>`).
 *
 * Everything derives from the single typed registry (`catalog/catalog.ts`):
 * adding a flow is one registry entry plus its feature directory under
 * `pages/examples/<slug>/`. There is intentionally no hard-coded slug list
 * here.
 */

function examplesRoute(): Route {
  const route = routes.find((candidate) => candidate.path === 'examples');
  expect(route).withContext('routes must contain an "examples" parent route').toBeDefined();
  return route!;
}

function exampleChildRoutes(): (Route & { path: string })[] {
  return (examplesRoute().children ?? []).filter(
    (route): route is Route & { path: string } =>
      typeof route.path === 'string' && route.path.length > 0 && !route.path.includes('*'),
  );
}

describe('examples registry integration', () => {
  it('keeps the reviewed example baseline, so removing a flow fails', () => {
    expect(catalogEntriesByKind('example').length).toBeGreaterThanOrEqual(REVIEWED_EXAMPLE_BASELINE);
  });

  it('derives example child routes from the registry in registry order', () => {
    expect(exampleChildRoutes().map((route) => route.path)).toEqual(
      catalogEntriesByKind('example').map((entry) => entry.slug),
    );
    expect(catalogChildRoutes('example').length).toEqual(catalogEntriesByKind('example').length);
  });

  it('resolves a component for every example lazy route', async () => {
    const lazyRoutes = exampleChildRoutes().filter((route) => typeof route.loadComponent === 'function');
    expect(lazyRoutes.length).toEqual(exampleChildRoutes().length);
    const failures: string[] = [];
    for (const route of lazyRoutes) {
      const resolved = await route.loadComponent!();
      if (typeof resolved !== 'function') {
        failures.push(route.path);
      }
    }
    expect(failures)
      .withContext(`these example routes resolved to no component: ${failures.join(', ')}`)
      .toEqual([]);
  });

  it('derives example menu groups whose links match the registry exactly', () => {
    const groups = catalogMenuGroups('example');
    const menuLinks = groups.flatMap((group) => group.items.map((item) => item.link));
    const registryLinks = catalogEntriesByKind('example').map((entry) => catalogLink(entry));
    expect(menuLinks).toEqual(registryLinks);
    expect(duplicateValues(menuLinks.filter((link): link is string => Boolean(link)))).toEqual([]);
    expect(registryLinks.every((link) => link.startsWith('/examples/'))).toBeTrue();
  });

  it('keeps example entries out of the component surface', () => {
    const componentLinks = new Set(catalogEntriesByKind('component').map((entry) => catalogLink(entry)));
    for (const entry of catalogEntriesByKind('example')) {
      expect(componentLinks.has(catalogLink(entry))).toBeFalse();
    }
    expect(catalogMenuGroups('component').flatMap((group) => group.items.map((item) => item.link))).not.toContain(
      '/examples/pricing',
    );
  });

  it('declares an intentional child wildcard under /examples', () => {
    const children = examplesRoute().children ?? [];
    expect(children.at(-1)?.path).toEqual('**');
  });

  it('still resolves registered example URLs to their registry routes, not the wildcard', async () => {
    TestBed.configureTestingModule({ providers: [provideRouter(routes)] });
    const router = TestBed.inject(Router);
    for (const entry of catalogEntriesByKind('example')) {
      await router.navigateByUrl(catalogLink(entry));
      const leafRoute = router.routerState.snapshot.root.firstChild?.firstChild;
      expect(leafRoute?.routeConfig?.path).withContext(catalogLink(entry)).toEqual(entry.slug);
    }
  });
});

describe('examples wildcard recovery', () => {
  @Component({ imports: [RouterOutlet], template: '<router-outlet />' })
  class RoutingHost {}

  function setup() {
    TestBed.configureTestingModule({ imports: [RoutingHost], providers: [provideRouter(routes)] });
    const fixture = TestBed.createComponent(RoutingHost);
    return { fixture, router: TestBed.inject(Router) };
  }

  it('renders the not-found page for an unknown example URL', async () => {
    const { fixture, router } = setup();
    await router.navigateByUrl('/examples/not-a-flow');
    fixture.detectChanges();
    await fixture.whenStable();
    expect((fixture.nativeElement as HTMLElement).querySelector('[data-testid="not-found-page"]')).not.toBeNull();
  });
});

describe('ExamplesLayout catalog surface', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection(), provideRouter([])],
    }).compileComponents();
  });

  it('renders one h1, a registry-derived count, and a link per example', () => {
    const fixture = TestBed.createComponent(ExamplesLayout);
    fixture.detectChanges();
    const host = fixture.nativeElement as HTMLElement;
    expect(host.querySelectorAll('h1').length).toBe(1);
    const expected = catalogEntriesByKind('example').length;
    expect(host.querySelector('[data-testid="example-count"]')?.textContent).toContain(`${expected}`);
    const links = Array.from(host.querySelectorAll('[data-testid="example-catalog"] a')).map((anchor) =>
      anchor.getAttribute('href'),
    );
    expect(links).toEqual(catalogEntriesByKind('example').map((entry) => catalogLink(entry)));
  });
});

describe('example pages at narrow viewport width', () => {
  const entries = catalogEntriesByKind('example');

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection(), provideRouter([])],
    }).compileComponents();
  });

  for (const entry of entries) {
    it(`/examples/${entry.slug} keeps content within a 320px-wide phone viewport`, async () => {
      const componentType = await entry.load();
      const wrapper = document.createElement('div');
      wrapper.style.cssText = 'width:280px; box-sizing:border-box; position:absolute; top:0; left:0;';
      document.body.appendChild(wrapper);
      try {
        const fixture = TestBed.createComponent(componentType);
        wrapper.appendChild(fixture.nativeElement as HTMLElement);
        fixture.detectChanges();
        await fixture.whenStable();
        await fixture.whenStable();

        const wrapperRect = wrapper.getBoundingClientRect();
        let maxRight = wrapperRect.left;
        const offenders: string[] = [];
        const walk = (parent: Element): void => {
          for (const child of Array.from(parent.children)) {
            if (getComputedStyle(child).display === 'none') continue;
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
