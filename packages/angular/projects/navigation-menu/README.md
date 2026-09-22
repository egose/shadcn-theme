# Navigation Menu (`@egose/shadcn-theme-ng/navigation-menu`)

Site-navigation bar with dropdown content panels (shadcn/ui `navigation-menu` equivalent). Thin shadcn styling directives/components over the spartan-ng `BrnNavigationMenu` brain family: the bar itself plus list/item/trigger/link/content/portal pieces. Use it for marketing/docs headers where top-level entries either link somewhere or open a rich panel — as opposed to `menubar` (action menus) or `dropdown-menu` (single-button menus).

Ships as `@egose/shadcn-theme-ng/navigation-menu` and `@egose/shadcn-theme-ng-tw/navigation-menu` (tw: variant). See the [package README](../../README.md) for installation, peer dependencies, Tailwind setup, and testing. Do not publish this project directory independently.

## Installation

```bash
# Plain Tailwind (no prefix):
npm install @egose/shadcn-theme-ng

# Or the tw:-prefixed variant:
npm install @egose/shadcn-theme-ng-tw
```

Peer dependencies are inherited from the package root (see [package README](../../README.md)). This subpath itself declares `@angular/common`, `@angular/core`, `@spartan-ng/brain` as peers plus a `tslib` runtime dependency; at runtime it also uses `@ng-icons/lucide` (`lucideChevronDown`). No extra install step is needed beyond the package install above.

## Imports

Real exported symbols (from `src/public-api.ts`):

```ts
import {
  HlmNavigationMenu, // directive: nav[hlmNavigationMenu]
  HlmNavigationMenuList, // directive: ul[hlmNavigationMenuList]
  HlmNavigationMenuItem, // directive: li[hlmNavigationMenuItem]
  HlmNavigationMenuTrigger, // component: button[hlmNavigationMenuTrigger]
  HlmNavigationMenuContent, // directive: [hlmNavigationMenuContent],hlm-navigation-menu-content
  HlmNavigationMenuPortal, // directive: [hlmNavigationMenuPortal]
  HlmNavigationMenuLink, // directive: a[hlmNavigationMenuLink]
  HlmNavigationMenuImports, // all seven above
  HlmNavigationMenuModule, // NgModule wrapping HlmNavigationMenuImports
} from '@egose/shadcn-theme-ng/navigation-menu';
```

Standalone usage:

```ts
import { Component } from '@angular/core';
import { HlmNavigationMenuImports } from '@egose/shadcn-theme-ng/navigation-menu';

@Component({
  selector: 'app-demo',
  standalone: true,
  imports: [...HlmNavigationMenuImports],
  template: `
    <nav hlmNavigationMenu>
      <ul hlmNavigationMenuList>
        <li hlmNavigationMenuItem>
          <a hlmNavigationMenuLink routerLink="/">Home</a>
        </li>
      </ul>
    </nav>
  `,
})
export class DemoComponent {}
```

NgModule usage:

```ts
import { NgModule } from '@angular/core';
import { HlmNavigationMenuModule } from '@egose/shadcn-theme-ng/navigation-menu';

@NgModule({ imports: [HlmNavigationMenuModule] })
export class DemoModule {}
```

For the `tw:` build, swap the specifier to `@egose/shadcn-theme-ng-tw/navigation-menu`. Symbol names are identical.

## Anatomy / Structure

```html
<nav hlmNavigationMenu>
  <ul hlmNavigationMenuList>
    <!-- plain link -->
    <li hlmNavigationMenuItem>
      <a hlmNavigationMenuLink routerLink="/docs">Docs</a>
    </li>

    <!-- trigger + dropdown panel -->
    <li hlmNavigationMenuItem>
      <button hlmNavigationMenuTrigger>Products</button>
      <!-- panel content: style with the content directive … -->
      <div hlmNavigationMenuContent>
        <a hlmNavigationMenuLink routerLink="/products/a">Product A</a>
        <a hlmNavigationMenuLink routerLink="/products/b">Product B</a>
      </div>
      <!-- … and project it through the brain portal -->
      <ng-container *hlmNavigationMenuPortal />
    </li>
  </ul>
</nav>
```

> Check the spartan-ng `BrnNavigationMenu` docs for the exact content/portal wiring in your installed version; the selectors above are the shadcn styling layer. The common shape is: trigger toggles state, `hlmNavigationMenuContent` styles the floating panel, and `*hlmNavigationMenuPortal` outlets the brain content.

| Class                      | Selector                                                 | Element           | Role                                                       |
| -------------------------- | -------------------------------------------------------- | ----------------- | ---------------------------------------------------------- |
| `HlmNavigationMenu`        | `nav[hlmNavigationMenu]`                                 | `<nav>` only      | Root; `BrnNavigationMenu` host                             |
| `HlmNavigationMenuList`    | `ul[hlmNavigationMenuList]`                              | `<ul>` only       | Horizontal list (`BrnNavigationMenuList`)                  |
| `HlmNavigationMenuItem`    | `li[hlmNavigationMenuItem]`                              | `<li>` only       | Item wrapper (`BrnNavigationMenuItem`)                     |
| `HlmNavigationMenuTrigger` | `button[hlmNavigationMenuTrigger]`                       | `<button>` only   | Dropdown trigger with chevron (`BrnNavigationMenuTrigger`) |
| `HlmNavigationMenuLink`    | `a[hlmNavigationMenuLink]`                               | `<a>` only        | Styled nav link (`BrnNavigationMenuLink`)                  |
| `HlmNavigationMenuContent` | `[hlmNavigationMenuContent],hlm-navigation-menu-content` | any / element     | Panel styling + `--nav-offset`                             |
| `HlmNavigationMenuPortal`  | `[hlmNavigationMenuPortal]`                              | structural anchor | Projects `BrnNavigationMenuContent`                        |

## API reference

| Selector                           | Inputs (incl. host-directive passthroughs)                                                           | Outputs                                 | Notes                                                                                                                                 |
| ---------------------------------- | ---------------------------------------------------------------------------------------------------- | --------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| `nav[hlmNavigationMenu]`           | `value`, `delayDuration`, `skipDelayDuration`, `orientation`, `openOn` (all via `BrnNavigationMenu`) | `valueChange` (via `BrnNavigationMenu`) | No shadcn inputs of its own                                                                                                           |
| `ul[hlmNavigationMenuList]`        | —                                                                                                    | —                                       | `gap-0 flex flex-1 list-none items-center justify-center`; stacks when `data-[orientation=vertical]`                                  |
| `li[hlmNavigationMenuItem]`        | `id` (via `BrnNavigationMenuItem`)                                                                   | —                                       | `relative has-[:focus]:z-10 data-active:z-10`                                                                                         |
| `button[hlmNavigationMenuTrigger]` | `align` (via `BrnNavigationMenuTrigger`)                                                             | —                                       | Renders `<ng-content>` + `lucideChevronDown` that rotates when the trigger/item is open (`group-data-open` / `group-data-popup-open`) |
| `a[hlmNavigationMenuLink]`         | `active` (via `BrnNavigationMenuLink`)                                                               | —                                       | `data-[active=true]` active treatment                                                                                                 |
| `[hlmNavigationMenuContent]`       | `navOffset: number` (default `1.5`, number coercion) → `[style.--nav-offset]`                        | —                                       | Animation/motion classes keyed off `data-[motion]` + `data-[orientation]`; panel chrome (`bg-popover rounded-lg shadow ring-1`)       |
| `[hlmNavigationMenuPortal]`        | `context`, `class` (via `BrnPopoverContent`-style `BrnNavigationMenuContent` host)                   | —                                       | No shadcn inputs; pure projection directive                                                                                           |

No methods or signals are declared on any of these classes; behavior lives in the brain directives.

## Examples

### 1. Basic bar with links + one dropdown

```ts
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HlmNavigationMenuImports } from '@egose/shadcn-theme-ng/navigation-menu';

@Component({
  selector: 'app-nav-basic',
  standalone: true,
  imports: [RouterLink, ...HlmNavigationMenuImports],
  template: `
    <nav hlmNavigationMenu>
      <ul hlmNavigationMenuList>
        <li hlmNavigationMenuItem>
          <a hlmNavigationMenuLink routerLink="/">Home</a>
        </li>
        <li hlmNavigationMenuItem>
          <button hlmNavigationMenuTrigger>Products</button>
          <div hlmNavigationMenuContent>
            <a hlmNavigationMenuLink routerLink="/products/a">Product A</a>
            <a hlmNavigationMenuLink routerLink="/products/b">Product B</a>
          </div>
        </li>
        <li hlmNavigationMenuItem>
          <a hlmNavigationMenuLink routerLink="/pricing">Pricing</a>
        </li>
      </ul>
    </nav>
  `,
})
export class NavBasicComponent {}
```

### 2. Active link state

```ts
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { HlmNavigationMenuImports } from '@egose/shadcn-theme-ng/navigation-menu';

@Component({
  selector: 'app-nav-active',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, ...HlmNavigationMenuImports],
  template: `
    <nav hlmNavigationMenu>
      <ul hlmNavigationMenuList>
        <li hlmNavigationMenuItem>
          <a
            hlmNavigationMenuLink
            routerLink="/docs"
            routerLinkActive="active"
            #rla="routerLinkActive"
            [active]="rla.isActive"
          >
            Docs
          </a>
        </li>
        <li hlmNavigationMenuItem>
          <a
            hlmNavigationMenuLink
            routerLink="/blog"
            routerLinkActive="active"
            #rlb="routerLinkActive"
            [active]="rlb.isActive"
          >
            Blog
          </a>
        </li>
      </ul>
    </nav>
  `,
})
export class NavActiveComponent {}
```

> `[active]` is the brain input forwarded by `HlmNavigationMenuLink`; it drives the `data-[active=true]` treatment. `routerLinkActive` alone only adds a class — bind both.

### 3. Controlled value + orientation

```ts
import { Component, signal } from '@angular/core';
import { HlmNavigationMenuImports } from '@egose/shadcn-theme-ng/navigation-menu';

@Component({
  selector: 'app-nav-controlled',
  standalone: true,
  imports: [...HlmNavigationMenuImports],
  template: `
    <nav hlmNavigationMenu [value]="value()" orientation="horizontal" (valueChange)="value.set($event)">
      <ul hlmNavigationMenuList>
        <li hlmNavigationMenuItem id="item-docs">
          <button hlmNavigationMenuTrigger>Docs</button>
          <div hlmNavigationMenuContent>Docs panel</div>
        </li>
        <li hlmNavigationMenuItem id="item-api">
          <button hlmNavigationMenuTrigger>API</button>
          <div hlmNavigationMenuContent>API panel</div>
        </li>
      </ul>
    </nav>
    <p class="tw:text-sm tw:text-muted-foreground">Open: {{ value() ?? 'none' }}</p>
  `,
})
export class NavControlledComponent {
  readonly value = signal<string | undefined>(undefined);
}
```

`value`/`valueChange` and `orientation` are brain inputs/outputs exposed through `HlmNavigationMenu`; `id` is the brain input on each item used as the value key.

### 4. Rich mega-panel with offset tuning

```ts
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HlmNavigationMenuImports } from '@egose/shadcn-theme-ng/navigation-menu';

@Component({
  selector: 'app-nav-mega',
  standalone: true,
  imports: [RouterLink, ...HlmNavigationMenuImports],
  template: `
    <nav hlmNavigationMenu>
      <ul hlmNavigationMenuList>
        <li hlmNavigationMenuItem>
          <button hlmNavigationMenuTrigger>Solutions</button>
          <div hlmNavigationMenuContent [navOffset]="2">
            <div class="tw:grid tw:grid-cols-2 tw:gap-2 tw:p-2 tw:min-w-[28rem]">
              <a hlmNavigationMenuLink routerLink="/solutions/startups">
                <div>
                  <div class="tw:font-medium">Startups</div>
                  <p class="tw:text-xs tw:text-muted-foreground">Launch fast.</p>
                </div>
              </a>
              <a hlmNavigationMenuLink routerLink="/solutions/enterprise">
                <div>
                  <div class="tw:font-medium">Enterprise</div>
                  <p class="tw:text-xs tw:text-muted-foreground">Scale safely.</p>
                </div>
              </a>
            </div>
          </div>
        </li>
      </ul>
    </nav>
  `,
})
export class NavMegaComponent {}
```

`navOffset` sets `--nav-offset` (spacing units of gap between trigger and panel); the default `1.5` suits single-column panels, `2+` suits mega-panels.

### 5. Hover vs click + delays (brain behavior)

```ts
import { Component } from '@angular/core';
import { HlmNavigationMenuImports } from '@egose/shadcn-theme-ng/navigation-menu';

@Component({
  selector: 'app-nav-delays',
  standalone: true,
  imports: [...HlmNavigationMenuImports],
  template: `
    <nav hlmNavigationMenu openOn="hover" [delayDuration]="200" [skipDelayDuration]="300">
      <ul hlmNavigationMenuList>
        <li hlmNavigationMenuItem>
          <button hlmNavigationMenuTrigger>Features</button>
          <div hlmNavigationMenuContent>Feature panel (hover, 200ms delay)</div>
        </li>
      </ul>
    </nav>
  `,
})
export class NavDelaysComponent {}
```

`openOn`, `delayDuration`, `skipDelayDuration` are brain inputs — no shadcn wrapper logic involved.

### 6. Data-driven bar + NgModule consumer

```ts
import { NgModule, Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HlmNavigationMenuModule, HlmNavigationMenuImports } from '@egose/shadcn-theme-ng/navigation-menu';

interface NavEntry {
  label: string;
  link?: string;
  children?: { label: string; link: string }[];
}

@Component({
  selector: 'app-nav-data',
  standalone: true,
  imports: [RouterLink, ...HlmNavigationMenuImports],
  template: `
    <nav hlmNavigationMenu>
      <ul hlmNavigationMenuList>
        @for (entry of entries(); track entry.label) {
          <li hlmNavigationMenuItem>
            @if (entry.children) {
              <button hlmNavigationMenuTrigger>{{ entry.label }}</button>
              <div hlmNavigationMenuContent>
                @for (child of entry.children; track child.label) {
                  <a hlmNavigationMenuLink [routerLink]="child.link">{{ child.label }}</a>
                }
              </div>
            } @else {
              <a hlmNavigationMenuLink [routerLink]="entry.link">{{ entry.label }}</a>
            }
          </li>
        }
      </ul>
    </nav>
  `,
})
export class NavDataComponent {
  readonly entries = signal<NavEntry[]>([
    { label: 'Home', link: '/' },
    {
      label: 'Docs',
      children: [
        { label: 'Quickstart', link: '/docs/quickstart' },
        { label: 'API', link: '/docs/api' },
      ],
    },
  ]);
}

@NgModule({ imports: [HlmNavigationMenuModule, RouterLink] })
export class NavLegacyModule {}
```

## Accessibility notes

- The brain layer owns menubar/tree semantics, focus management, `Escape` handling, and arrow-key traversal — preserve the `nav > ul > li > trigger/link` nesting so roles hold.
- Triggers must stay `<button>` and links `<a>`; swapping elements breaks both selectors and semantics.
- The trigger chevron rotates on open via `group-data-*` — decorative (`ng-icon` is aria-hidden by the icon layer); the open state itself is announced by the brain directive.
- For the active page, bind `[active]` (example 2) so the current link exposes `data-[active=true]` styling in addition to `aria-current` handling by the router.

## Theming / CSS variables

No theming inputs. Panel offset is tunable per instance via `navOffset`; everything else flows from tokens (`bg-background`, `bg-muted` hover, `bg-popover` panel, `ring-foreground/10`). Motion/placement classes respond to brain `data-[motion]` / `data-[orientation]` attributes.

## Related subpaths

- `@egose/shadcn-theme-ng/menubar` — action-menu bar (File/Edit) vs this component's site-navigation bar.
- `@egose/shadcn-theme-ng/dropdown-menu` — single-trigger menu when you don't need a full nav strip.
- `@egose/shadcn-theme-ng/navigation-menu` pairs well with `@egose/shadcn-theme-ng/layout-simple` top rows for docs/marketing shells.
