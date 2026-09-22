# Breadcrumb (`@egose/shadcn-theme-ng/breadcrumb`)

A wayfinding trail in the shadcn/ui Breadcrumb style ("Home / Products / Shoes"): a `nav` region
containing an ordered-feeling list of links, chevron separators, an ellipsis placeholder for
collapsed middle segments, and a current-page marker. Use it above page headers so users always
know where they are and can jump back up the hierarchy.

This is a **routing-aware styling layer with no single brain primitive**. `HlmBreadcrumbLink`
wraps Angular's `RouterLink` via `hostDirectives` (every router input is forwarded); the
remaining pieces are layout/semantic directives adding `data-slot` attributes plus shadcn classes
through `classes()`. Separators and ellipses are tiny components that render a Lucide
`chevron-right` / `ellipsis` `ng-icon` with an `<ng-content>` / screen-reader-text slot.

> **Ships as:** `@egose/shadcn-theme-ng/breadcrumb` and `@egose/shadcn-theme-ng-tw/breadcrumb`
> (the `tw:`-prefixed Tailwind variant). Both expose the identical TypeScript surface; only the
> emitted Tailwind class strings differ. See the [package README](../../README.md) for install
> steps, peer dependencies, and Tailwind setup. Do not publish this project directory independently.

## Installation

```bash
# Plain Tailwind (no prefix)
npm install @egose/shadcn-theme-ng

# tw:-prefixed Tailwind variant
npm install @egose/shadcn-theme-ng-tw
```

Peer dependencies (Angular, `@spartan-ng/brain`, `@ng-icons/*`, `rxjs`, …) are documented in the
[package README](../../README.md#peer-dependencies). This subpath additionally relies at runtime on
`@angular/router` (`RouterLink`), `@egose/shadcn-theme-ng/utils` (`classes()`), and
`@ng-icons/lucide` (`lucideChevronRight`, `lucideEllipsis`).

## Imports

All symbols are exported from the subpath root (`projects/breadcrumb/src/public-api.ts`):

```ts
import {
  HlmBreadcrumb,
  HlmBreadcrumbList,
  HlmBreadcrumbItem,
  HlmBreadcrumbLink,
  HlmBreadcrumbPage,
  HlmBreadcrumbSeparator,
  HlmBreadcrumbEllipsis,
  HlmBreadcrumbImports,
  HlmBreadcrumbModule,
} from '@egose/shadcn-theme-ng/breadcrumb';
// tw variant: replace with '@egose/shadcn-theme-ng-tw/breadcrumb'
```

Standalone component — spread the `*Imports` array:

```ts
import { Component } from '@angular/core';
import { HlmBreadcrumbImports } from '@egose/shadcn-theme-ng/breadcrumb';

@Component({
  selector: 'app-demo',
  standalone: true,
  imports: [...HlmBreadcrumbImports],
  template: `...`,
})
export class DemoComponent {}
```

NgModule-based consumer — import the module:

```ts
import { NgModule } from '@angular/core';
import { HlmBreadcrumbModule } from '@egose/shadcn-theme-ng/breadcrumb';

@NgModule({ imports: [HlmBreadcrumbModule] })
export class DemoModule {}
```

## Anatomy / Structure

```html
<nav hlmBreadcrumb aria-label="breadcrumb">
  <ol hlmBreadcrumbList>
    <li hlmBreadcrumbItem>
      <a hlmBreadcrumbLink link="/">Home</a>
    </li>
    <li hlmBreadcrumbSeparator></li>
    <li hlmBreadcrumbItem>
      <hlm-breadcrumb-ellipsis srOnlyText="More" />
    </li>
    <li hlmBreadcrumbSeparator></li>
    <li hlmBreadcrumbItem>
      <span hlmBreadcrumbPage>Current page</span>
    </li>
  </ol>
</nav>
```

Real selectors (from source):

| Class                    | Selector(s)                | Kind      |
| ------------------------ | -------------------------- | --------- |
| `HlmBreadcrumb`          | `[hlmBreadcrumb]`          | Directive |
| `HlmBreadcrumbList`      | `[hlmBreadcrumbList]`      | Directive |
| `HlmBreadcrumbItem`      | `[hlmBreadcrumbItem]`      | Directive |
| `HlmBreadcrumbLink`      | `[hlmBreadcrumbLink]`      | Directive |
| `HlmBreadcrumbPage`      | `[hlmBreadcrumbPage]`      | Directive |
| `HlmBreadcrumbSeparator` | `[hlmBreadcrumbSeparator]` | Component |
| `HlmBreadcrumbEllipsis`  | `hlm-breadcrumb-ellipsis`  | Component |

Host semantics from source: `HlmBreadcrumb` sets `role="navigation"` + `aria-label`;
`HlmBreadcrumbPage` sets `role="link"`, `aria-disabled="true"`, `aria-current="page"`;
`HlmBreadcrumbSeparator` sets `role="presentation"`, `aria-hidden="true"`;
`HlmBreadcrumbEllipsis` sets `role="presentation"` and renders its `srOnlyText` in an
`sr-only` span.

## API reference

### `HlmBreadcrumb` — `[hlmBreadcrumb]`

| Input                               | Type     | Default        | Description                               |
| ----------------------------------- | -------- | -------------- | ----------------------------------------- |
| `aria-label` (alias of `ariaLabel`) | `string` | `'breadcrumb'` | Accessible name of the navigation region. |

### `HlmBreadcrumbList` / `HlmBreadcrumbItem`

Layout-only directives, no inputs. List: wrapping muted flex row (`text-sm`, `gap-1.5/2.5`);
item: `inline-flex items-center gap-1.5` slot for one link/page/separator step.

### `HlmBreadcrumbLink` — `[hlmBreadcrumbLink]`

Wraps `RouterLink` via `hostDirectives`; every router input is forwarded.

| Input                 | Type                       | Description                                                                                                                             |
| --------------------- | -------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| `link`                | `RouterLink['routerLink']` | **Own input** and simultaneously the `routerLink` binding (`routerLink: link` mapping). Accepts a string, commands array, or `UrlTree`. |
| `target`              | forwarded to `RouterLink`  | Link target.                                                                                                                            |
| `queryParams`         | forwarded                  | Query params.                                                                                                                           |
| `fragment`            | forwarded                  | URL fragment.                                                                                                                           |
| `queryParamsHandling` | forwarded                  | `'merge' \| 'preserve' \| ''`.                                                                                                          |
| `state`               | forwarded                  | Router state extras.                                                                                                                    |
| `info`                | forwarded                  | Router info extras.                                                                                                                     |
| `relativeTo`          | forwarded                  | Base route for relative links.                                                                                                          |
| `preserveFragment`    | forwarded                  | Keep the current fragment.                                                                                                              |
| `skipLocationChange`  | forwarded                  | Navigate without pushing history.                                                                                                       |
| `replaceUrl`          | forwarded                  | Replace instead of push.                                                                                                                |

### `HlmBreadcrumbPage` — `[hlmBreadcrumbPage]`

Current-page marker. No inputs; styled `text-foreground font-normal` with
`aria-current="page"`.

### `HlmBreadcrumbSeparator` — `[hlmBreadcrumbSeparator]`

Component (attribute selector) rendering `<ng-icon name="lucideChevronRight">` by default. No
inputs — override the icon by projecting your own content:

```html
<li hlmBreadcrumbSeparator><span class="tw:px-1">/</span></li>
```

### `HlmBreadcrumbEllipsis` — `hlm-breadcrumb-ellipsis`

Collapsed-segments placeholder rendering the `ellipsis` icon plus screen-reader text.

| Input        | Type     | Default  | Description                       |
| ------------ | -------- | -------- | --------------------------------- |
| `srOnlyText` | `string` | `'More'` | Text announced to screen readers. |

## Examples

### 1. Basic trail with router links

```ts
import { Component } from '@angular/core';
import { HlmBreadcrumbImports } from '@egose/shadcn-theme-ng/breadcrumb';

@Component({
  selector: 'app-breadcrumb-basic',
  standalone: true,
  imports: [...HlmBreadcrumbImports],
  template: `
    <nav hlmBreadcrumb>
      <ol hlmBreadcrumbList>
        <li hlmBreadcrumbItem>
          <a hlmBreadcrumbLink link="/">Home</a>
        </li>
        <li hlmBreadcrumbSeparator></li>
        <li hlmBreadcrumbItem>
          <a hlmBreadcrumbLink link="/products">Products</a>
        </li>
        <li hlmBreadcrumbSeparator></li>
        <li hlmBreadcrumbItem>
          <span hlmBreadcrumbPage>Running shoes</span>
        </li>
      </ol>
    </nav>
  `,
})
export class BreadcrumbBasicComponent {}
```

```html
<app-breadcrumb-basic />
```

### 2. Collapsed middle segments with ellipsis

```ts
import { Component } from '@angular/core';
import { HlmBreadcrumbImports } from '@egose/shadcn-theme-ng/breadcrumb';

@Component({
  selector: 'app-breadcrumb-ellipsis',
  standalone: true,
  imports: [...HlmBreadcrumbImports],
  template: `
    <nav hlmBreadcrumb aria-label="File path">
      <ol hlmBreadcrumbList>
        <li hlmBreadcrumbItem><a hlmBreadcrumbLink link="/">Home</a></li>
        <li hlmBreadcrumbSeparator></li>
        <li hlmBreadcrumbItem><hlm-breadcrumb-ellipsis srOnlyText="3 collapsed folders" /></li>
        <li hlmBreadcrumbSeparator></li>
        <li hlmBreadcrumbItem><a hlmBreadcrumbLink link="/docs">Docs</a></li>
        <li hlmBreadcrumbSeparator></li>
        <li hlmBreadcrumbItem><span hlmBreadcrumbPage>Q3 report.pdf</span></li>
      </ol>
    </nav>
  `,
})
export class BreadcrumbEllipsisComponent {}
```

### 3. Data-driven trail from the router (or any segment list)

```ts
import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HlmBreadcrumbImports } from '@egose/shadcn-theme-ng/breadcrumb';

interface Crumb {
  label: string;
  link?: string[];
}

@Component({
  selector: 'app-breadcrumb-dynamic',
  standalone: true,
  imports: [...HlmBreadcrumbImports],
  template: `
    <nav hlmBreadcrumb>
      <ol hlmBreadcrumbList>
        @for (c of crumbs(); track c.label; let last = $last) {
          <li hlmBreadcrumbItem>
            @if (last || !c.link) {
              <span hlmBreadcrumbPage>{{ c.label }}</span>
            } @else {
              <a hlmBreadcrumbLink [link]="c.link">{{ c.label }}</a>
            }
          </li>
          @if (!last) {
            <li hlmBreadcrumbSeparator></li>
          }
        }
      </ol>
    </nav>
  `,
})
export class BreadcrumbDynamicComponent {
  private readonly route = inject(ActivatedRoute, { optional: true });

  // Derive from route snapshots in real apps; static here for clarity.
  readonly crumbs = computed<Crumb[]>(() => [
    { label: 'Workspace', link: ['/'] },
    { label: 'Projects', link: ['/', 'projects'] },
    { label: this.route?.snapshot.paramMap.get('id') ?? 'apollo' },
  ]);
}
```

### 4. Links with query params, fragments, and relative navigation

All `RouterLink` inputs forward, so deep-linking patterns work unchanged:

```ts
import { Component } from '@angular/core';
import { HlmBreadcrumbImports } from '@egose/shadcn-theme-ng/breadcrumb';

@Component({
  selector: 'app-breadcrumb-router',
  standalone: true,
  imports: [...HlmBreadcrumbImports],
  template: `
    <nav hlmBreadcrumb>
      <ol hlmBreadcrumbList>
        <li hlmBreadcrumbItem>
          <a hlmBreadcrumbLink link="/" queryParamsHandling="preserve">Home</a>
        </li>
        <li hlmBreadcrumbSeparator></li>
        <li hlmBreadcrumbItem>
          <a hlmBreadcrumbLink [link]="['../']" fragment="reviews">Parent section</a>
        </li>
        <li hlmBreadcrumbSeparator></li>
        <li hlmBreadcrumbItem>
          <a hlmBreadcrumbLink [link]="['/search']" [queryParams]="{ q: 'shoes' }"> Search: shoes </a>
        </li>
        <li hlmBreadcrumbSeparator></li>
        <li hlmBreadcrumbItem><span hlmBreadcrumbPage>Details</span></li>
      </ol>
    </nav>
  `,
})
export class BreadcrumbRouterComponent {}
```

### 5. Custom separator glyph

Project anything into the separator to replace the chevron:

```ts
import { Component } from '@angular/core';
import { HlmBreadcrumbImports } from '@egose/shadcn-theme-ng/breadcrumb';

@Component({
  selector: 'app-breadcrumb-custom-sep',
  standalone: true,
  imports: [...HlmBreadcrumbImports],
  template: `
    <nav hlmBreadcrumb>
      <ol hlmBreadcrumbList>
        <li hlmBreadcrumbItem><a hlmBreadcrumbLink link="/">Home</a></li>
        <li hlmBreadcrumbSeparator><span aria-hidden="true" class="tw:px-0.5">/</span></li>
        <li hlmBreadcrumbItem><a hlmBreadcrumbLink link="/blog">Blog</a></li>
        <li hlmBreadcrumbSeparator><span aria-hidden="true" class="tw:px-0.5">/</span></li>
        <li hlmBreadcrumbItem><span hlmBreadcrumbPage>Hello world</span></li>
      </ol>
    </nav>
  `,
})
export class BreadcrumbCustomSepComponent {}
```

### 6. Collapsible middle on small screens (responsive pattern)

Combine the ellipsis with a dropdown menu so hidden segments stay reachable:

```ts
import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HlmBreadcrumbImports } from '@egose/shadcn-theme-ng/breadcrumb';
import { HlmDropdownMenuImports } from '@egose/shadcn-theme-ng/dropdown-menu';

@Component({
  selector: 'app-breadcrumb-responsive',
  standalone: true,
  imports: [...HlmBreadcrumbImports, ...HlmDropdownMenuImports, RouterLink],
  template: `
    <nav hlmBreadcrumb>
      <ol hlmBreadcrumbList>
        <li hlmBreadcrumbItem><a hlmBreadcrumbLink link="/">Home</a></li>
        <li hlmBreadcrumbSeparator></li>
        <li hlmBreadcrumbItem>
          <button hlmDropdownMenuTrigger [hlmDropdownMenuTrigger]="menu" class="tw:flex tw:items-center">
            <hlm-breadcrumb-ellipsis srOnlyText="Show hidden sections" />
          </button>
          <ng-template #menu>
            <div hlmDropdownMenu>
              @for (s of hidden(); track s.label) {
                <a hlmDropdownMenuItem [routerLink]="s.link">{{ s.label }}</a>
              }
            </div>
          </ng-template>
        </li>
        <li hlmBreadcrumbSeparator></li>
        <li hlmBreadcrumbItem><span hlmBreadcrumbPage>Current report</span></li>
      </ol>
    </nav>
  `,
})
export class BreadcrumbResponsiveComponent {
  readonly hidden = signal([
    { label: '2024', link: ['/archive/2024'] },
    { label: 'Q3', link: ['/archive/2024/q3'] },
  ]);
}
```

> Exact `dropdown-menu` trigger/menu/item selectors live in
> `@egose/shadcn-theme-ng/dropdown-menu` — verify names there before pasting; the breadcrumb half
> (`hlm-breadcrumb-ellipsis` inside a trigger) is verbatim.

## Accessibility notes

- The root is `role="navigation"` with a configurable `aria-label` (default `"breadcrumb"`).
  When several breadcrumbs appear on one page, give each a distinct label.
- The current page uses `aria-current="page"` + `aria-disabled="true"` with `role="link"` — it is
  deliberately **not** a focusable link, so keyboard users skip it.
- Separators are `role="presentation"` + `aria-hidden`; the ellipsis carries `sr-only` text
  (customize via `srOnlyText`, e.g. "3 collapsed folders") so its meaning survives without sight.
- Keep crumb labels short and unique; the link text is the accessible name, so avoid "click here".

## Theming / CSS variables

Class-based styling (`text-muted-foreground` list, `hover:text-foreground` links); no
component-specific CSS variables. Override separators/ellipses by projecting content or targeting
`data-slot="breadcrumb-separator"`.

## Related subpaths

- `@egose/shadcn-theme-ng/dropdown-menu` — overflow menus for collapsed segments
- `@egose/shadcn-theme-ng/navigation-menu` — full site navigation bars
- `@egose/shadcn-theme-ng/pagination` — page-step navigation with similar link semantics
- `@egose/shadcn-theme-ng/skeleton` — breadcrumb-shaped loading placeholders
