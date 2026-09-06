import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
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
import { EgLayoutSimple, MenuItem } from '@egose/shadcn-theme-ng/layout-simple';
import { catalogEntriesByKind, catalogLink, catalogMenuGroups } from './catalog/catalog';

type DemoRoute = { label: string; link: string; group: string };

/** First registered real example, so shell navigation never hard-codes an example slug. */
function firstExampleLink(): string {
  const first = catalogEntriesByKind('example')[0];
  return first ? catalogLink(first) : '/examples/pricing';
}

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

  protected title = 'angular';

  iconPath = 'assets/logo.png';

  leftMenus: MenuItem[] = [
    { label: 'Home', link: '/' },
    { label: 'Components', link: '/components/button' },
    { label: 'Examples', link: firstExampleLink() },
  ];

  topSecondaryMenus = catalogMenuGroups('component');

  /** Examples navigation groups, derived from the `example` registry kind. */
  exampleMenuGroups = catalogMenuGroups('example');

  rightMenus: MenuItem[] = [];

  menus = [
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

  footerMenus = [
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

  demoToSearch = (value: DemoRoute) => `${value.group} ${value.label}`;

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

  onSearchOptionChange(value: DemoRoute) {
    void this.router.navigateByUrl(value.link);
  }
}
