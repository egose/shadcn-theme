import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Route, Router, provideRouter } from '@angular/router';
import { RouterOutlet } from '@angular/router';
import { routes } from './app.routes';
import {
  catalogChildRoutes,
  catalogEntriesByKind,
  catalogLink,
  catalogMenuGroups,
  duplicateValues,
} from './catalog/catalog';

/**
 * Route/menu contract for the demo catalog.
 *
 * Everything derives from the single typed registry (`catalog/catalog.ts`):
 * there is intentionally no hard-coded slug list here. Duplicating a
 * registry entry fails the duplicate specs in `catalog.spec.ts` and the
 * route/menu mirrors below; removing one fails the baseline count spec and
 * shifts the derived link set asserted here.
 */

function componentsRoute(): Route {
  const route = routes.find((candidate) => candidate.path === 'components');
  expect(route).withContext('routes must contain a "components" parent route').toBeDefined();
  return route!;
}

function componentChildRoutes(): (Route & { path: string })[] {
  return (componentsRoute().children ?? []).filter(
    (route): route is Route & { path: string } =>
      typeof route.path === 'string' && route.path.length > 0 && !route.path.includes('*'),
  );
}

describe('component gallery routes', () => {
  it('derives child routes from the registry in registry order', () => {
    expect(componentChildRoutes().map((route) => route.path)).toEqual(
      catalogEntriesByKind('component').map((entry) => entry.slug),
    );
  });

  it('resolves a component for every registry-derived lazy route', async () => {
    const lazyRoutes = componentChildRoutes().filter((route) => typeof route.loadComponent === 'function');
    // Every child route must be lazy so no demo hides from this check.
    expect(lazyRoutes.length).toEqual(componentChildRoutes().length);

    const failures: string[] = [];
    for (const route of lazyRoutes) {
      const resolved = await route.loadComponent!();
      if (typeof resolved !== 'function') {
        failures.push(route.path);
      }
    }
    expect(failures)
      .withContext(`these lazy routes resolved to no component: ${failures.join(', ')}`)
      .toEqual([]);
  });
});

describe('route/menu contract', () => {
  it('has no duplicate child route paths', () => {
    expect(duplicateValues(componentChildRoutes().map((route) => route.path))).toEqual([]);
  });

  it('has no duplicate menu links', () => {
    const links = catalogMenuGroups('component').flatMap((group) => group.items.map((item) => item.link));
    expect(duplicateValues(links.filter((link): link is string => Boolean(link)))).toEqual([]);
  });

  it('links every menu item to a real child route', () => {
    const routePaths = new Set(componentChildRoutes().map((route) => route.path));
    const orphans = catalogMenuGroups('component').flatMap((group) =>
      group.items
        .filter((item) => item.link && !routePaths.has(item.link.replace(/^\/components\//, '')))
        .map((item) => item.link),
    );
    expect(orphans)
      .withContext(`menu links without a matching route: ${orphans.join(', ')}`)
      .toEqual([]);
  });

  it('exposes every child route in the menu', () => {
    const menuLinks = new Set(
      catalogMenuGroups('component').flatMap((group) =>
        group.items.map((item) => item.link).filter((link): link is string => Boolean(link)),
      ),
    );
    const unlinked = componentChildRoutes()
      .map((route) => route.path)
      .filter((path) => !menuLinks.has(`/components/${path}`));
    expect(unlinked)
      .withContext(`routes missing from the menu: ${unlinked.join(', ')}`)
      .toEqual([]);
  });
});

describe('wildcard recovery', () => {
  @Component({ imports: [RouterOutlet], template: '<router-outlet />' })
  class RoutingHost {}

  function setup() {
    TestBed.configureTestingModule({ imports: [RoutingHost], providers: [provideRouter(routes)] });
    const fixture = TestBed.createComponent(RoutingHost);
    return { fixture, router: TestBed.inject(Router) };
  }

  it('declares an intentional child wildcard under /components', () => {
    const children = componentsRoute().children ?? [];
    expect(children.at(-1)?.path).toEqual('**');
  });

  it('declares an intentional root wildcard', () => {
    expect(routes.at(-1)?.path).toEqual('**');
  });

  it('renders the not-found page for an unknown component URL', async () => {
    const { fixture, router } = setup();
    await router.navigateByUrl('/components/not-a-demo');
    fixture.detectChanges();
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('[data-testid="not-found-page"]')).not.toBeNull();
    expect(compiled.textContent).toContain('Page not found');
    // Recovery: the page links back into the real gallery.
    const recoveryLink = compiled.querySelector<HTMLAnchorElement>('a[href="/components/button"]');
    expect(recoveryLink).not.toBeNull();
  });

  it('renders the not-found page for an unknown root URL', async () => {
    const { fixture, router } = setup();
    await router.navigateByUrl('/not-a-route');
    fixture.detectChanges();
    await fixture.whenStable();
    expect((fixture.nativeElement as HTMLElement).querySelector('[data-testid="not-found-page"]')).not.toBeNull();
  });

  it('still resolves registered component URLs to their registry routes, not the wildcard', async () => {
    // No host component: without an outlet, navigation exercises route
    // matching and lazy loading without rendering pages that need providers
    // (animations, date-picker tokens) this suite intentionally omits.
    TestBed.configureTestingModule({ providers: [provideRouter(routes)] });
    const router = TestBed.inject(Router);
    for (const entry of catalogEntriesByKind('component')) {
      await router.navigateByUrl(catalogLink(entry));
      const leafRoute = router.routerState.snapshot.root.firstChild?.firstChild;
      expect(leafRoute?.routeConfig?.path).withContext(catalogLink(entry)).toEqual(entry.slug);
    }
  });
});
