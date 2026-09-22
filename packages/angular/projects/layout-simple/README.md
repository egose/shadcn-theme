# Simple application layout

A responsive Angular shell with branded header, keyboard-accessible navigation, async page search, optional sidebar, and footer. Colors use the consumer's `background`, `foreground`, `border`, and `ring` theme tokens. Navigation has visible active and focus states, and controls have 44px minimum touch targets.

Import standalone components from `@egose/shadcn-theme-ng/layout-simple`, or `@egose/shadcn-theme-ng-tw/layout-simple` for Tailwind's `tw:` prefix. See the [package README](../../README.md) for installation and styling setup. Configure Angular Router (`provideRouter`) before using the shell.

## Basic usage

```ts
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { EgLayoutSimple, type MenuItem } from '@egose/shadcn-theme-ng/layout-simple';

@Component({
  imports: [EgLayoutSimple, RouterOutlet],
  template: `
    <eg-layout-simple
      brandName="Acme workspace"
      [primaryNavigation]="navigation"
      [footerEnabled]="true"
      footerText="Acme workspace"
    >
      <router-outlet />
    </eg-layout-simple>
  `,
})
export class App {
  readonly navigation: MenuItem[] = [
    { label: 'Home', link: '/' },
    { label: 'Projects', link: '/projects', activeMatch: 'prefix' },
    { label: 'Reports', disabled: true },
  ];
}
```

## Navigation model

`MenuItem` is shared by every navigation surface, including `UserMenuItem`:

| Field                               | Meaning                                                           |
| ----------------------------------- | ----------------------------------------------------------------- |
| `label: string`                     | Visible link/action text                                          |
| `description?: string`              | Supporting text in desktop and mobile fly-out cards               |
| `link?: string`                     | Internal router URL; takes precedence over `action`               |
| `action?: () => void`               | Button callback when there is no link                             |
| `icon?: string`                     | SVG data such as `lucideHome` from `@ng-icons/lucide`             |
| `activeMatch?: 'exact' \| 'prefix'` | Exact path by default; query parameters and fragments are ignored |
| `disabled?: boolean`                | Prevents navigation and activation                                |
| `class?: string`                    | Per-item classes                                                  |

An item without a link or action renders as disabled. `MenuGroup` contains an optional `label` and required readonly `items`. `UserMenuSection` has optional `label`, `items`, and `separator` (a desktop dropdown separator).

### Shell inputs

| Input                                               | Default / purpose                                                         |
| --------------------------------------------------- | ------------------------------------------------------------------------- |
| `primaryNavigation`                                 | `[]`; main header destinations                                            |
| `navigationGroups`                                  | `[]`; header dropdown groups, operated by click or keyboard               |
| `utilityNavigation`                                 | `[]`; header utility actions                                              |
| `sectionNavigation`                                 | `[]`; navigation row below the header                                     |
| `secondaryNavigationGroups`                         | `[]`; horizontally scrollable grouped navigation                          |
| `flyoutNavigationGroups`                            | `[]`; category navbar with wide card panels; `readonly FlyoutMenuGroup[]` |
| `flyoutNavigationLabel` / `flyoutCloseLabel`        | `'Fly-out navigation'` / `'Close navigation panel'`; accessible labels    |
| `userMenuSections`                                  | `[]`; desktop account dropdown and mobile account section                 |
| `brandName`                                         | `'Workspace'`; visible name and accessible home-link label                |
| `logo` / `logoLink`                                 | `''` / `'/'`; optional decorative image and brand destination             |
| `fullHeight`                                        | `true`; minimum viewport height; set `false` for embedded previews        |
| `loading` / `loadingText`                           | `false` / `'Loading content…'`; busy state with visible status            |
| `skipLinkText`                                      | `'Skip to content'`; keyboard shortcut to the main landmark               |
| `sidebarEnabled`                                    | `false`; adds a sidebar trigger                                           |
| `sidebarTitle`                                      | `'Navigation'`                                                            |
| `sidebarContent`                                    | `TemplateRef<unknown>` with a `close` context function                    |
| `sidebarToggleLabel`                                | `'Open navigation sidebar'`                                               |
| `mobileMenuLabel` / `mobileMenuCloseLabel`          | `'Open navigation menu'` / `'Close navigation menu'`                      |
| `userMenuTrigger` / `userMenuLabel`                 | Optional trigger template / `'Open account menu'`                         |
| `footerEnabled` / `footerText` / `footerNavigation` | `false` / `''` / `[]`                                                     |

Style hooks accept `ClassValue`: `logoClass`, `headerClass`, `contentClass`, `primaryNavigationClass`, `utilityNavigationClass`, `sectionNavigationClass`, `secondaryNavigationClass`, `flyoutNavigationClass`, `flyoutPanelClass`, `navigationItemClass`, and `footerClass`. Per-item classes also work on mobile.

Below 768px, desktop navigation is replaced by a scrollable mobile disclosure. It includes page search and all navigation destinations. Escape and item selection close it and return focus to its trigger; routing and resizing to desktop also close it. Multiple shells generate distinct content and panel IDs. `EG_LAYOUT_SIMPLE_MOBILE_BREAKPOINT` exposes the breakpoint contract; Tailwind's `md` breakpoint must match it.

The sidebar is a modal sheet with focus handling from Spartan/CDK. Its body scrolls independently of its header and close button. Use `#shell` with `shell.openSidebar()` / `shell.closeSidebar()` for programmatic control:

```html
<eg-layout-simple [sidebarEnabled]="true" [sidebarContent]="sidebar">
  <h1>Dashboard</h1>
</eg-layout-simple>
<ng-template #sidebar let-close="close">
  <a routerLink="/projects" (click)="close()">Projects</a>
</ng-template>
```

## Dropdown / fly-out navbar

`flyoutNavigationGroups` adds a category navbar below the header/section navigation. Each trigger opens a shell-width panel with a responsive two- or three-column grid of cards. Cards support the same routes, actions, disabled state, and active matching as other navigation, plus optional icons and descriptions.

```ts
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { lucideLayers, lucideTable } from '@ng-icons/lucide';
import { EgLayoutSimple, type FlyoutMenuGroup } from '@egose/shadcn-theme-ng/layout-simple';

@Component({
  imports: [EgLayoutSimple, RouterOutlet],
  template: `
    <eg-layout-simple brandName="Acme" [flyoutNavigationGroups]="groups">
      <router-outlet />
    </eg-layout-simple>
  `,
})
export class App {
  readonly groups: FlyoutMenuGroup[] = [
    {
      label: 'Explore',
      description: 'Find the right tools for your next project.',
      items: [
        { label: 'Projects', description: 'Plan and organize your work.', icon: lucideLayers, link: '/projects' },
        { label: 'Reports', description: 'Turn your data into useful insights.', icon: lucideTable, link: '/reports' },
      ],
    },
  ];
}
```

`FlyoutMenuGroup` extends `MenuGroup` with a required `label`, optional `description`, and optional trigger `icon`. `secondaryNavigationGroups` is still the independent scrollable link strip; both inputs can be used together. `navigationGroups` remains the compact header dropdown. The example app derives its fly-out groups from the active component/example catalog section and hides the row on Home.

- **Pointer:** click a category to open or toggle it; opening another category replaces the panel. Click outside or use the close button to dismiss.
- **Keyboard:** Enter/Space toggles a trigger; Left/Right/Home/End move among enabled category triggers. Down/Up opens the panel and focuses its first/last enabled card. Tab follows normal document order. Escape returns focus to the trigger. Moving focus outside closes the panel.
- **Mobile:** below 768px the categories become native expandable sections inside the mobile navigation, retaining icons and descriptions.
- **State:** selection, route changes, group replacement, and resizing to mobile dismiss the desktop panel. Current categories and destination links have active styling. Empty categories are disabled.
- **Sizing:** panels overlay page content, are bounded to the shell width, and scroll internally for large catalogs. Avoid `overflow: hidden` on containing elements if the panel should extend past an embedded preview.

## Async search

```ts
type Page = { title: string; url: string };

// Members of the consuming component:
readonly pages: Page[] = [
  { title: 'Dashboard', url: '/' },
  { title: 'Projects', url: '/projects' },
];
readonly loadPages = async ({ search }: { search: string }): Promise<Page[]> =>
  this.pages.filter((page) => page.title.toLowerCase().includes(search.toLowerCase()));
readonly pageLabel = (page: Page) => page.title;
// Handle selection by navigating with your injected Router.
```

```html
<eg-layout-simple
  [searchEnabled]="true"
  [searchLoader]="loadPages"
  [searchResultLabel]="pageLabel"
  [searchResultTemplate]="result"
  (searchResultSelected)="router.navigateByUrl($event.url)"
>
  <router-outlet />
</eg-layout-simple>
<ng-template #result let-page>{{ page.title }}</ng-template>
```

`LayoutSearchLoader<TItem>` receives `{ search: string }` and resolves to a readonly array. It runs on opening (empty query) and after a 180ms debounce when typing. The loader owns filtering; the component does not filter results a second time. Changing the query, closing, or destroying the search invalidates old responses. Loading, empty, and error states are distinct, with a retry button on failure. Arrow keys move between the search field and result buttons; Enter selects; Escape closes the popover.

Shell search inputs: `searchEnabled`, `searchLoader`, `searchResultLabel`, `searchResultTemplate`, `searchPlaceholder`, `searchEmptyText`, and `searchErrorText`. Selection emits `searchResultSelected`. The template context is `LayoutSearchResultContext<TItem>` (`$implicit: TItem`). Always supply a result label or template for object results.

### Standalone building blocks

- `EgLayoutSearch` (`eg-layout-search`): `loader`, `resultLabel`, `resultTemplate`, `placeholder`, `emptyText`, `errorText`, `loadingText`, `retryText`; emits `resultSelected`.
- `EgLayoutSimpleUserMenu` (`eg-layout-simple-user-menu`): `sections`, `triggerTemplate`, `triggerLabel`. Custom trigger templates supply non-interactive content; the component provides the button.
- The sidebar, fly-out navbar, navigation-item renderer, and mobile group are internal components, not public imports.

## Migration from the positional API

| Previous name                                       | New name                                                                       |
| --------------------------------------------------- | ------------------------------------------------------------------------------ |
| `leftMenus` / `leftMenuGroups`                      | `primaryNavigation` / `navigationGroups`                                       |
| `rightMenus`                                        | `utilityNavigation`                                                            |
| `topMenus` / `topSecondaryMenus`                    | `sectionNavigation` / `secondaryNavigationGroups`                              |
| `userMenus`                                         | `userMenuSections`                                                             |
| `footerMenus` / `footerContent`                     | `footerNavigation` / `footerText`                                              |
| `leftClass` / `rightClass` / `topClass`             | `primaryNavigationClass` / `utilityNavigationClass` / `sectionNavigationClass` |
| `leftLinkClass` / `rightLinkClass` / `topLinkClass` | `navigationItemClass` or per-item `class`                                      |
| `searchLoaderFn`                                    | `searchLoader`                                                                 |
| `searchTransformValueToSearch`                      | `searchResultLabel`                                                            |
| `searchPlaceholderText`                             | `searchPlaceholder`                                                            |
| `searchOptionTemplate` / `searchOptionChange`       | `searchResultTemplate` / `searchResultSelected`                                |
| `EgGenericAutocomplete`                             | `EgLayoutSearch`                                                               |
| User menu `menus` / `menuTrigger`                   | `sections` / `triggerTemplate`                                                 |

`contentBottomClass` and the empty content spacer were removed; use `contentClass` for content sizing. Footer-specific menu/link class inputs were replaced by per-item `class`. The unsupported generic search-parameter cast and unused `AutocompleteOption` type were removed. Search now has a single generic item type. Use public `openSidebar()` / `closeSidebar()` methods instead of reaching into the sheet query.

## Verification

From `packages/angular`: `pnpm test:library layout-simple`. The example at `@examples/standard` exercises source imports and custom search templates; its `pnpm build` also checks prerendering.
