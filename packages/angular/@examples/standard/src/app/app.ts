import { Component, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import {
  lucideCircleHelp,
  lucideCircleUser,
  lucideCode,
  lucideCog,
  lucideKeyboard,
  lucideLayers,
  lucideLogOut,
  lucidePlus,
  lucideUser,
} from '@ng-icons/lucide';
import {
  EgLayoutSimple,
  type FlyoutMenuGroup,
  type MenuItem,
  type UserMenuSection,
} from '@egose/shadcn-theme-ng/layout-simple';
import { catalogEntriesByKind, catalogLink, catalogMenuGroups } from './catalog/catalog';

type DemoRoute = { label: string; link: string; group: string };

// Menu groups, search options, and counts are all derived from the single
// typed registry in `catalog/catalog.ts` (ANGEX-04). Adding or renaming a
// demo touches only the registry entry. The Wave 4 `example` kind is kept
// out of this component navigation via its distinct registry kind.

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, EgLayoutSimple],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  private readonly router = inject(Router);

  readonly logoPath = 'assets/logo.png';

  readonly primaryNavigation: MenuItem[] = [
    { label: 'Home', link: '/home' },
    { label: 'Components', link: '/components', activeMatch: 'prefix' },
    { label: 'Examples', link: '/examples', activeMatch: 'prefix' },
  ];

  /**
   * Section-aware fly-out navigation, derived from the active URL:
   * hidden on Home (`[]` collapses the shell row), component groups under
   * `/components`, and example groups under `/examples`. Computed so the
   * zoneless shell refreshes on every navigation.
   */
  private readonly currentUrl = signal(this.router.url);

  constructor() {
    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntilDestroyed(),
      )
      .subscribe((event) => this.currentUrl.set(event.urlAfterRedirects));
  }

  readonly flyoutNavigationGroups = computed<FlyoutMenuGroup[]>(() => {
    const url = this.currentUrl();
    const groups = url.startsWith('/examples')
      ? catalogMenuGroups('example')
      : url.startsWith('/components')
        ? catalogMenuGroups('component')
        : [];
    return groups;
  });

  /** Examples navigation groups, derived from the `example` registry kind. */
  exampleMenuGroups = catalogMenuGroups('example');

  readonly userMenuSections: UserMenuSection[] = [
    {
      label: 'Explore',
      items: [
        { label: 'Overview', icon: lucideCircleUser, link: '/components/layout-simple' },
        { label: 'Form flows', icon: lucideLayers, link: '/components/form-field' },
        { label: 'Patterns', icon: lucideCog, link: '/components/card' },
        { label: 'Keyboard shortcuts', icon: lucideKeyboard, link: '/components/kbd' },
      ],
      separator: true,
    },
    {
      label: 'Popular',
      items: [
        { label: 'Buttons', icon: lucideUser, link: '/components/button' },
        { label: 'Forms', icon: lucidePlus, link: '/components/form-text-input' },
      ],
      separator: true,
    },
    {
      label: 'Resources',
      // GitHub is a real external resource: the layout menu model only supports
      // internal router links, so this opens the repository URL in a new tab.
      items: [
        { label: 'GitHub', icon: lucideCode, action: () => this.openRepository() },
        { label: 'Support', icon: lucideCircleHelp, link: '/components/empty' },
      ],
      separator: true,
    },
    {
      items: [{ label: 'Reset demo', icon: lucideLogOut, link: '/components/button' }],
    },
  ];

  readonly footerNavigation: MenuItem[] = [
    { label: 'Buttons', link: '/components/button' },
    { label: 'Forms', link: '/components/form-field' },
    { label: 'Tables', link: '/components/table' },
  ];

  openRepository() {
    window.open('https://github.com/egose/shadcn-theme', '_blank', 'noopener');
  }

  private readonly componentRoutes: DemoRoute[] = catalogEntriesByKind('component').map((entry) => ({
    label: entry.title,
    link: catalogLink(entry),
    group: entry.category,
  }));

  readonly searchResultLabel = (value: DemoRoute) => `${value.group} ${value.label}`;

  loadDemoRoutes = async ({ search }: { search: string }): Promise<DemoRoute[]> => {
    const query = search.trim().toLowerCase();
    if (!query) {
      return this.componentRoutes.slice(0, 8);
    }

    return this.componentRoutes
      .filter((item) => {
        const haystack = `${item.group} ${item.label}`.toLowerCase();
        return haystack.includes(query);
      })
      .slice(0, 8);
  };

  navigateToSearchResult(value: DemoRoute) {
    void this.router.navigateByUrl(value.link);
  }
}
