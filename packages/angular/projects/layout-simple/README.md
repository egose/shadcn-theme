# Layout Simple (`@egose/shadcn-theme-ng/layout-simple`)

Application shell (header / nav rows / mobile menu / sidebar sheet / main / footer) plus its building blocks. This is an egose-specific composition — not a one-to-one shadcn/ui port — assembled from this library's own primitives (`button`, `dropdown-menu`, `sheet`, `popover`, `input`) plus Angular CDK `BreakpointObserver` and Angular Router links. It gives you a responsive top-bar layout with desktop nav rows, a hamburger-driven mobile menu below the `md` breakpoint, an optional sidebar sheet, header search autocomplete, a user dropdown menu, and a footer.

Ships as `@egose/shadcn-theme-ng/layout-simple` and `@egose/shadcn-theme-ng-tw/layout-simple` (tw: variant). See the [package README](../../README.md) for installation, peer dependencies, Tailwind setup, and testing. Do not publish this project directory independently.

## Installation

```bash
# Plain Tailwind (no prefix):
npm install @egose/shadcn-theme-ng

# Or the tw:-prefixed variant:
npm install @egose/shadcn-theme-ng-tw
```

Peer dependencies are inherited from the package root (see [package README](../../README.md)). This subpath itself declares `@angular/common`, `@angular/core` as peers plus a `tslib` runtime dependency; at runtime it also imports `@egose/shadcn-theme-ng/button`, `.../dropdown-menu`, `.../sheet`, `.../popover`, `.../input`, `@spartan-ng/brain/sheet`, `@angular/cdk/layout`, and `@angular/router`, so install the package (which carries those sibling subpaths) and keep `RouterModule` available in your app. No extra install step is needed beyond the package install above.

## Imports

Real exported symbols (from `src/public-api.ts` → `lib/layout`, `lib/user-menu`, `lib/search`):

```ts
import {
  // layout.ts
  EgLayoutSimple, // component: eg-layout-simple
  MenuItem, // interface { label, icon?, link?, action?, class? }
  MenuGroup, // interface { label?, items: MenuItem[] }
  EG_LAYOUT_SIMPLE_MOBILE_BREAKPOINT, // '(max-width: 767.98px)'
  // user-menu.ts
  EgLayoutSimpleUserMenu, // component: eg-layout-simple-user-menu
  UserMenuItem, // interface { label, icon?, action?, link?, class? }
  UserMenuSection, // interface { label?, separator?, items?: UserMenuItem[] }
  // search.ts
  EgGenericAutocomplete, // component: eg-generic-autocomplete
  AutocompleteOption, // interface { label, value, raw? }
} from '@egose/shadcn-theme-ng/layout-simple';
```

> Surprise: unlike most subpaths, `layout-simple` exposes **no `*Imports` array and no `*Module`**. Import the standalone component classes directly.
>
> Note: `EgLayoutSimpleSidebar` (`eg-layout-simple-sidebar`) and `EgLayoutSimpleMobileMenuGroup` (`eg-layout-simple-mobile-menu-group`) exist in `src/lib/` but are **not** re-exported from `src/public-api.ts` (which only exports `lib/layout`, `lib/user-menu`, `lib/search`), so they are internal building blocks used _through_ `EgLayoutSimple` — not importable from `@egose/shadcn-theme-ng/layout-simple`.

Standalone usage:

```ts
import { Component } from '@angular/core';
import { EgLayoutSimple, type MenuItem } from '@egose/shadcn-theme-ng/layout-simple';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [EgLayoutSimple],
  template: `
    <eg-layout-simple [leftMenus]="items">
      <p>Page content</p>
    </eg-layout-simple>
  `,
})
export class ShellComponent {
  readonly items: MenuItem[] = [{ label: 'Home', link: '/' }];
}
```

For the `tw:` build, swap the specifier to `@egose/shadcn-theme-ng-tw/layout-simple`. Symbol names are identical.

## Anatomy / Structure

```html
<eg-layout-simple
  [leftMenus]="leftMenus"
  [leftMenuGroups]="leftMenuGroups"
  [rightMenus]="rightMenus"
  [topMenus]="topMenus"
  [topSecondaryMenus]="topSecondaryMenus"
  [userMenus]="userMenus"
  [sidebarEnabled]="true"
  [searchEnabled]="true"
  [footerEnabled]="true"
>
  <!-- projected page content -->
  <router-outlet />
</eg-layout-simple>

<!-- building blocks used THROUGH eg-layout-simple (EgLayoutSimpleUserMenu and EgGenericAutocomplete are also importable directly; the sidebar and mobile-menu-group are internal) -->
<eg-layout-simple-user-menu [menus]="userMenus" [menuTrigger]="triggerTpl" />
<eg-generic-autocomplete [loaderFn]="loader" [transformValueToSearch]="toLabel" (optionChange)="onPick($event)" />
```

| Class                                                    | Selector                             | Role                                                                                                                                             |
| -------------------------------------------------------- | ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `EgLayoutSimple`                                         | `eg-layout-simple`                   | Full shell: header (logo, left/right nav, search, user menu, mobile trigger), desktop top rows, mobile menu, `<main>` content projection, footer |
| `EgLayoutSimpleSidebar` (internal, not exported)         | `eg-layout-simple-sidebar`           | Sheet-based sidebar (`hlm-sheet`, `BrnSheet`); opened via shell's sidebar trigger                                                                |
| `EgLayoutSimpleUserMenu`                                 | `eg-layout-simple-user-menu`         | Avatar/dropdown user menu built on `hlmDropdownMenu`                                                                                             |
| `EgGenericAutocomplete`                                  | `eg-generic-autocomplete`            | Header search: popover + input + async option list                                                                                               |
| `EgLayoutSimpleMobileMenuGroup` (internal, not exported) | `eg-layout-simple-mobile-menu-group` | One labeled group inside the mobile menu                                                                                                         |

Single viewport contract: below Tailwind's `md` (768px) breakpoint — `EG_LAYOUT_SIMPLE_MOBILE_BREAKPOINT = '(max-width: 767.98px)'` — the hamburger trigger replaces all desktop nav rows. Both the CSS (`tw:hidden tw:md:flex`) and the runtime `isMobile()` signal derive from this one boundary, and an open mobile menu auto-closes when crossing back to desktop.

## API reference

### `MenuItem` / `MenuGroup` interfaces

| Field             | Type                    | Notes                                                                                                   |
| ----------------- | ----------------------- | ------------------------------------------------------------------------------------------------------- |
| `MenuItem.label`  | `string` (required)     | Item text; also used as `@for` track key                                                                |
| `MenuItem.icon`   | `string` (optional)     | `ng-icon` svg payload                                                                                   |
| `MenuItem.link`   | `string` (optional)     | Router link; when set the item renders as `<a [routerLink]>`, otherwise as `<button>` invoking `action` |
| `MenuItem.action` | `() => void` (optional) | Click handler for non-link items                                                                        |
| `MenuItem.class`  | `string` (optional)     | Per-item extra classes merged via `hlm()`                                                               |
| `MenuGroup.label` | `string` (optional)     | Group heading; falls back to `'Menu'` for desktop dropdown triggers                                     |
| `MenuGroup.items` | `MenuItem[]` (required) | Group children                                                                                          |

### `EgLayoutSimple` (`eg-layout-simple`, generic `<TItem, TParams extends object = { search: string }>`)

Inputs (all `input()` signals):

| Input                                       | Type / Default                          | Notes                                                                       |
| ------------------------------------------- | --------------------------------------- | --------------------------------------------------------------------------- |
| `sidebarEnabled`                            | `boolean`, `false`                      | Shows the sidebar sheet trigger                                             |
| `sidebarTitle`                              | `string`, `'Menu'`                      | Sheet title                                                                 |
| `sidebarContent`                            | `TemplateRef \| undefined`              | Sheet body; context provides `{ close }`                                    |
| `sidebarToggleLabel`                        | `string`, `'Open navigation sidebar'`   | `aria-label` of the sidebar trigger                                         |
| `mobileMenuLabel`                           | `string`, `'Open navigation menu'`      | `aria-label` of the hamburger trigger                                       |
| `userMenuTrigger`                           | `TemplateRef \| undefined`              | Custom user-menu trigger; default is a round avatar button                  |
| `leftMenus`                                 | `MenuItem[]`, `[]`                      | Desktop header-left links                                                   |
| `leftMenuGroups`                            | `MenuGroup[]`, `[]`                     | Desktop header-left hover dropdown groups                                   |
| `rightMenus`                                | `MenuItem[]`, `[]`                      | Desktop header-right links                                                  |
| `topMenus`                                  | `MenuItem[]`, `[]`                      | Desktop second-row nav (spans left+right on mobile)                         |
| `topSecondaryMenus`                         | `MenuGroup[]`, `[]`                     | Desktop third-row grouped nav                                               |
| `userMenus`                                 | `UserMenuSection[]`, `[]`               | User dropdown sections (also flattened into the mobile menu)                |
| `logo`                                      | `string`, `'assets/logo.png'`           | Logo `img src`                                                              |
| `logoLink`                                  | `string`, `'/'`                         | Logo router link                                                            |
| `logoClass` (`logoClass`)                   | `ClassValue`, `''`                      | Merged over base `tw:h-10`                                                  |
| `headerClass` (`headerClass`)               | `ClassValue`, `''`                      | Merged over header bar classes                                              |
| `contentClass` (`contentClass`)             | `ClassValue`, `''`                      | Merged over `tw:p-4 tw:flex tw:flex-col tw:flex-1`                          |
| `contentBottomClass` (`contentBottomClass`) | `ClassValue`, `''`                      | Merged over `tw:flex-1` spacer                                              |
| `leftMenuClass` (alias `leftClass`)         | `ClassValue`, `''`                      | Header-left `<nav>` container                                               |
| `rightMenuClass` (alias `rightClass`)       | `ClassValue`, `''`                      | Header-right `<nav>` container                                              |
| `topMenuClass` (alias `topClass`)           | `ClassValue`, `''`                      | Both top-row containers (secondary row reuses this input)                   |
| `leftLinkClass`                             | `ClassValue`, `''`                      | Header-left link/button                                                     |
| `rightLinkClass`                            | `ClassValue`, `''`                      | Header-right link/button                                                    |
| `topLinkClass`                              | `ClassValue`, `''`                      | Top-row link/button                                                         |
| `searchEnabled`                             | `boolean`, `false`                      | Shows `eg-generic-autocomplete` in the header                               |
| `loading`                                   | `boolean`, `false`                      | When `true`, `<ng-content>` is hidden (skeleton/spinner state owned by you) |
| `searchPlaceholderText`                     | `string`, `'Select an page'`            | Passed through as `placeholderText` (note upstream default typo "an page")  |
| `searchEmptyText`                           | `string`, `'No pages found'`            | Passed through as `emptyText`                                               |
| `searchOptionTemplate`                      | `TemplateRef \| undefined`              | Accepted but currently unused by the template                               |
| `searchLoaderFn`                            | `(params: TParams) => Promise<TItem[]>` | Passed through as `loaderFn`                                                |
| `searchTransformValueToSearch`              | `(value: TItem) => string`              | Passed through as `transformValueToSearch`                                  |
| `footerEnabled`                             | `boolean`, `false`                      | Shows the footer                                                            |
| `footerMenus`                               | `MenuItem[]`, `[]`                      | Footer links                                                                |
| `footerMenuClass`                           | `ClassValue`, `''`                      | Footer `<nav>` container                                                    |
| `footerLinkClass`                           | `ClassValue`, `''`                      | Footer link/button                                                          |
| `footerContent`                             | `string`, `'© 2024 My Company'`        | Centered footer line                                                        |
| `footerClass`                               | `ClassValue`, `''`                      | Footer container                                                            |

Outputs / state / methods:

| Member                             | Kind                                | Notes                                                                                      |
| ---------------------------------- | ----------------------------------- | ------------------------------------------------------------------------------------------ |
| `searchOptionChange`               | `output<TItem>()`                   | Re-emits the autocomplete's `optionChange`                                                 |
| `isMobile`                         | `signal<boolean>` (public, mutable) | Set by `BreakpointObserver`; mobile menu renders only when `true`                          |
| `toggleMobileMenu()`               | method                              | Flips the mobile menu                                                                      |
| `closeMobileMenu()`                | method                              | Closes the mobile menu (also wired to `Escape` and every mobile item click)                |
| `onSearchOptionChange(value)`      | method                              | Forwards to `searchOptionChange`; wire `(optionChange)` through it when composing manually |
| `openSidebar()` / `closeSidebar()` | methods                             | Delegate to the `EgLayoutSimpleSidebar` view child                                         |
| `viewchildSheetRef`                | `viewChild(EgLayoutSimpleSidebar)`  | The sidebar instance; `sidebarOpen` (protected signal) mirrors its `BrnSheet` state        |

### `EgLayoutSimpleUserMenu` (`eg-layout-simple-user-menu`)

| Input         | Type / Default             | Notes                                                                                                                                                                         |
| ------------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `menus`       | `UserMenuSection[]`, `[]`  | Sections; each renders an optional `hlmDropdownMenuLabel`, a `hlmDropdownMenuGroup` of link/button items, and an optional `hlmDropdownMenuSeparator` when `separator` is true |
| `menuTrigger` | `TemplateRef \| undefined` | Custom trigger; default is a round `hlmButton` avatar with `lucideUser`                                                                                                       |

`UserMenuSection = { label?: string; separator?: boolean; items?: UserMenuItem[] }`; `UserMenuItem = { label: string; icon?: string; action?: () => void; link?: string; class?: string }`.

### `EgGenericAutocomplete` (`eg-generic-autocomplete`, generic `<TItem, TParams extends object = { search: string }>`)

| Member                   | Kind   | Type / Default                                                                   | Notes                                                                                                                                                                |
| ------------------------ | ------ | -------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `placeholderText`        | input  | `string`, `'Select an option'`                                                   | Trigger + input placeholder                                                                                                                                          |
| `emptyText`              | input  | `string`, `'No options found'`                                                   | Empty-list text                                                                                                                                                      |
| `loaderFn`               | input  | `((params: TParams) => Promise<TItem[]>) \| undefined`, default `async () => []` | Called once in the constructor with `{ search: '' }`; result cached into `options`. Typing filters client-side only — the loader is **not** re-invoked per keystroke |
| `transformValueToSearch` | input  | `((value: TItem) => string) \| undefined`, default `String(value)`               | Maps an item to its searchable/display label                                                                                                                         |
| `search`                 | signal | `string`                                                                         | Current filter text (`ngModel`-bound)                                                                                                                                |
| `options`                | signal | `TItem[]`                                                                        | Loader result                                                                                                                                                        |
| `optionChange`           | output | `TItem`                                                                          | Emitted by `select()`; clears `search`                                                                                                                               |
| `select(opt)`            | method |                                                                                  | Emits `optionChange` and resets `search`                                                                                                                             |

### `EgLayoutSimpleSidebar` (`eg-layout-simple-sidebar`, internal — not exported, used through `EgLayoutSimple`)

| Member                         | Kind                  | Type / Default                                                          | Notes                                                  |
| ------------------------------ | --------------------- | ----------------------------------------------------------------------- | ------------------------------------------------------ |
| `side`                         | input                 | `'top' \| 'bottom' \| 'left' \| 'right' \| undefined`, default `'left'` | Forwarded to `hlm-sheet` (`[side]="side() ?? 'left'"`) |
| `title`                        | input                 | `string \| undefined`, `''`                                             | `hlmSheetTitle`; hidden when falsy                     |
| `content`                      | input                 | `TemplateRef \| undefined`                                              | Body; rendered with `contentContext()`                 |
| `contentContext`               | input                 | `object \| null`, `null`                                                | Template context (shell passes `{ close }`)            |
| `viewchildSheetRef`            | `viewChild(BrnSheet)` |                                                                         | Underlying brain sheet                                 |
| `openSheet()` / `closeSheet()` | methods               |                                                                         | `open()` / `close()` on the brain sheet                |

### `EgLayoutSimpleMobileMenuGroup` (`eg-layout-simple-mobile-menu-group`, internal — not exported, used through `EgLayoutSimple`)

| Member              | Kind   | Type / Default              | Notes                                 |
| ------------------- | ------ | --------------------------- | ------------------------------------- |
| `label`             | input  | `string \| undefined`, `''` | Section heading; hidden when falsy    |
| `items`             | input  | `MenuItem[] \| undefined`   | Nothing renders when empty            |
| `itemClick`         | output | `MenuItem`                  | Emitted after `item.action?.()` runs  |
| `handleClick(item)` | method |                             | Runs `action`, then emits `itemClick` |

## Examples

### 1. Minimal shell with router outlet

```ts
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { EgLayoutSimple, type MenuItem } from '@egose/shadcn-theme-ng/layout-simple';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [EgLayoutSimple, RouterOutlet],
  template: `
    <eg-layout-simple [leftMenus]="leftMenus" [rightMenus]="rightMenus">
      <router-outlet />
    </eg-layout-simple>
  `,
})
export class ShellComponent {
  readonly leftMenus: MenuItem[] = [
    { label: 'Dashboard', link: '/' },
    { label: 'Orders', link: '/orders' },
  ];
  readonly rightMenus: MenuItem[] = [{ label: 'Docs', link: '/docs' }];
}
```

### 2. Dropdown groups, top rows, footer

```ts
import { Component } from '@angular/core';
import { EgLayoutSimple, type MenuItem, type MenuGroup } from '@egose/shadcn-theme-ng/layout-simple';

@Component({
  selector: 'app-shell-full',
  standalone: true,
  imports: [EgLayoutSimple],
  template: `
    <eg-layout-simple
      [leftMenus]="leftMenus"
      [leftMenuGroups]="leftGroups"
      [topMenus]="topMenus"
      [topSecondaryMenus]="topSecondary"
      [footerEnabled]="true"
      [footerMenus]="footerMenus"
      footerContent="© 2026 Acme Inc."
    >
      <h1 class="tw:text-xl tw:font-semibold">Page content</h1>
    </eg-layout-simple>
  `,
})
export class ShellFullComponent {
  readonly leftMenus: MenuItem[] = [{ label: 'Home', link: '/' }];
  readonly leftGroups: MenuGroup[] = [
    {
      label: 'Products',
      items: [
        { label: 'Overview', link: '/products' },
        { label: 'Pricing', link: '/pricing' },
        { label: 'Changelog', action: () => console.log('changelog') },
      ],
    },
  ];
  readonly topMenus: MenuItem[] = [
    { label: 'Announcements', link: '/announcements' },
    { label: 'Status', link: '/status' },
  ];
  readonly topSecondary: MenuGroup[] = [
    {
      label: 'Guides',
      items: [
        { label: 'Quickstart', link: '/guides/quickstart' },
        { label: 'Migration', link: '/guides/migration' },
      ],
    },
  ];
  readonly footerMenus: MenuItem[] = [
    { label: 'Privacy', link: '/privacy' },
    { label: 'Terms', link: '/terms' },
  ];
}
```

### 3. Sidebar sheet with custom content

```ts
import { Component, TemplateRef, viewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { EgLayoutSimple, type MenuItem } from '@egose/shadcn-theme-ng/layout-simple';

@Component({
  selector: 'app-shell-sidebar',
  standalone: true,
  imports: [EgLayoutSimple, RouterLink],
  template: `
    <ng-template #sidebarBody let-close="close">
      <nav class="tw:flex tw:flex-col tw:gap-1 tw:p-4">
        <a routerLink="/" (click)="close()" class="tw:px-2 tw:py-1.5 tw:text-sm">Home</a>
        <a routerLink="/settings" (click)="close()" class="tw:px-2 tw:py-1.5 tw:text-sm">Settings</a>
        <button type="button" (click)="close()" class="tw:px-2 tw:py-1.5 tw:text-sm tw:text-left">Close</button>
      </nav>
    </ng-template>

    <eg-layout-simple
      [sidebarEnabled]="true"
      sidebarTitle="Navigation"
      [sidebarContent]="sidebarBody"
      [leftMenus]="leftMenus"
    >
      <p>Content beside a sheet sidebar.</p>
    </eg-layout-simple>
  `,
})
export class ShellSidebarComponent {
  readonly leftMenus: MenuItem[] = [{ label: 'Home', link: '/' }];
}
```

Programmatic control via the view child:

```ts
import { Component, viewChild } from '@angular/core';
import { EgLayoutSimple } from '@egose/shadcn-theme-ng/layout-simple';

@Component({
  selector: 'app-shell-programmatic',
  standalone: true,
  imports: [EgLayoutSimple],
  template: `
    <eg-layout-simple #shell [sidebarEnabled]="true">
      <button type="button" (click)="shell.openSidebar()">Open sidebar</button>
      <button type="button" (click)="shell.closeSidebar()">Close sidebar</button>
      <button type="button" (click)="shell.toggleMobileMenu()">Toggle mobile menu</button>
    </eg-layout-simple>
  `,
})
export class ShellProgrammaticComponent {
  readonly shell = viewChild.required(EgLayoutSimple);
}
```

### 4. Header search (async loader) + user menu

Note the loader runs once with `{ search: '' }`; typing filters the cached list client-side.

```ts
import { Component, signal } from '@angular/core';
import { EgLayoutSimple, type MenuItem, type UserMenuSection } from '@egose/shadcn-theme-ng/layout-simple';

interface DocPage {
  title: string;
  path: string;
}

const PAGES: DocPage[] = [
  { title: 'Getting started', path: '/docs/getting-started' },
  { title: 'Theming', path: '/docs/theming' },
  { title: 'Dark mode', path: '/docs/dark-mode' },
];

@Component({
  selector: 'app-shell-search',
  standalone: true,
  imports: [EgLayoutSimple],
  template: `
    <eg-layout-simple
      [leftMenus]="leftMenus"
      [searchEnabled]="true"
      [searchLoaderFn]="loader"
      [searchTransformValueToSearch]="toLabel"
      searchPlaceholderText="Search docs"
      searchEmptyText="No docs found"
      [userMenus]="userMenus"
      (searchOptionChange)="onPick($event)"
    >
      <p>Selected: {{ selected()?.title ?? 'nothing yet' }}</p>
    </eg-layout-simple>
  `,
})
export class ShellSearchComponent {
  readonly leftMenus: MenuItem[] = [{ label: 'Docs', link: '/docs' }];
  readonly selected = signal<DocPage | undefined>(undefined);
  readonly userMenus: UserMenuSection[] = [
    {
      label: 'ada@example.com',
      items: [{ label: 'Profile', link: '/profile' }],
      separator: true,
    },
    {
      items: [{ label: 'Log out', action: () => console.log('logout') }],
    },
  ];

  readonly loader = async () => PAGES;
  readonly toLabel = (page: DocPage) => page.title;

  onPick(page: DocPage): void {
    this.selected.set(page);
  }
}
```

Custom avatar trigger:

```html
<ng-template #avatar>
  <img src="assets/me.png" alt="Account" class="tw:h-8 tw:w-8 tw:rounded-full" />
</ng-template>

<eg-layout-simple [userMenus]="userMenus" [userMenuTrigger]="avatar">
  <p>Content</p>
</eg-layout-simple>
```

### 5. Loading state and class customization

```ts
import { Component, signal } from '@angular/core';
import { EgLayoutSimple, type MenuItem } from '@egose/shadcn-theme-ng/layout-simple';

@Component({
  selector: 'app-shell-loading',
  standalone: true,
  imports: [EgLayoutSimple],
  template: `
    <eg-layout-simple
      [leftMenus]="leftMenus"
      [loading]="loading()"
      headerClass="tw:bg-white"
      contentClass="tw:max-w-5xl tw:mx-auto tw:w-full"
      [leftLinkClass]="'tw:font-medium'"
    >
      @if (loading()) {
        <p class="tw:text-sm tw:text-muted-foreground">Loading…</p>
      } @else {
        <p>Real content (projected only when loading is false).</p>
      }
    </eg-layout-simple>
    <button type="button" (click)="loading.set(!loading())">Toggle loading</button>
  `,
})
export class ShellLoadingComponent {
  readonly loading = signal(true);
  readonly leftMenus: MenuItem[] = [{ label: 'Home', link: '/' }];
}
```

> `loading` hides `<ng-content>` but does not render a spinner itself — you own the loading UI (either inside the projected content slot boundary or outside the shell).

### 6. Using the building blocks standalone

Only the exported building blocks (`EgLayoutSimpleUserMenu`, `EgGenericAutocomplete`) can be imported directly. The sidebar and mobile-menu-group are internal to `EgLayoutSimple` and render through its inputs (`sidebarEnabled`/`sidebarContent`, `leftMenus`/`topMenus`/`userMenus`).

```ts
import { Component } from '@angular/core';
import { EgLayoutSimpleUserMenu, type UserMenuSection } from '@egose/shadcn-theme-ng/layout-simple';

@Component({
  selector: 'app-shell-pieces',
  standalone: true,
  imports: [EgLayoutSimpleUserMenu],
  template: ` <eg-layout-simple-user-menu [menus]="userMenus" /> `,
})
export class ShellPiecesComponent {
  readonly userMenus: UserMenuSection[] = [{ items: [{ label: 'Settings', link: '/settings' }] }];
}
```

## Accessibility notes

- Landmarks: the shell renders `<header>`, two/three desktop `<nav>` rows, `<main>`, and `<footer>` — keep page content inside `<main>` via content projection and give each `<nav>` an `aria-label` via the class inputs only if you restyle; by default the rows share generic navigation semantics.
- Triggers: the sidebar button exposes `aria-label` (`sidebarToggleLabel`), `aria-expanded` (bound to `sidebarOpen()`), and `aria-controls="eg-layout-simple-sidebar"`; the hamburger exposes `aria-label` (`mobileMenuLabel`), `aria-expanded`, and `aria-controls="eg-layout-simple-mobile-menu"`. Keep the defaults meaningful or override with plain language.
- Mobile menu closes on `Escape` (`keydown.escape`) and on every item activation.
- Logo `img` uses `alt="Logo"` — override the asset, and if the logo is decorative consider hiding it; if it is the only home link, the surrounding link text should disambiguate.
- Search input inherits popover/input keyboard behavior (focus the input, arrow through options, `Enter` to pick).

## Theming / CSS variables

No theming inputs beyond class overrides. Every region merges your `*Class` input over a sensible default via `hlm()`, so theme tokens (`bg-gray-100`, `text-secondary`, `text-muted-foreground`, …) and dark-mode utilities compose normally.

## Related subpaths

- `@egose/shadcn-theme-ng/button` (`HlmButton`) — header/sidebar triggers.
- `@egose/shadcn-theme-ng/dropdown-menu` — powers `EgLayoutSimpleUserMenu`.
- `@egose/shadcn-theme-ng/sheet` + `@spartan-ng/brain/sheet` — powers `EgLayoutSimpleSidebar`.
- `@egose/shadcn-theme-ng/popover`, `@egose/shadcn-theme-ng/input` — powers `EgGenericAutocomplete`.
