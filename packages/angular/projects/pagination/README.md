# Pagination (`@egose/shadcn-theme-ng/pagination`)

Paging controls in two flavors (shadcn/ui `pagination` equivalent): composable primitives (`hlm-pagination` shell + content/item/link/previous/next/ellipsis) for hand-rolled pagers, and two drop-in numbered pagers (`hlm-numbered-pagination` for client-side `[(currentPage)]`/`[(itemsPerPage)]` state, `hlm-numbered-pagination-query-params` for router `?page=`-driven state). Page-window math (`createPageArray`, `outOfBoundCorrection`) is exported for custom UIs. No brain primitive underneath — state is local signals/models plus Angular `RouterLink`.

Ships as `@egose/shadcn-theme-ng/pagination` and `@egose/shadcn-theme-ng-tw/pagination` (tw: variant). See the [package README](../../README.md) for installation, peer dependencies, Tailwind setup, and testing. Do not publish this project directory independently.

## Installation

```bash
# Plain Tailwind (no prefix):
npm install @egose/shadcn-theme-ng

# Or the tw:-prefixed variant:
npm install @egose/shadcn-theme-ng-tw
```

Peer dependencies are inherited from the package root (see [package README](../../README.md)). This subpath itself declares `@angular/common`, `@angular/core`, `@spartan-ng/brain` as peers plus a `tslib` runtime dependency; at runtime the numbered pagers also import `@egose/shadcn-theme-ng/select`, and links use `@angular/router`. No extra install step is needed beyond the package install above.

## Imports

Real exported symbols (from `src/public-api.ts`):

```ts
import {
  HlmPagination, // directive: [hlmPagination],hlm-pagination
  HlmPaginationContent, // directive: ul[hlmPaginationContent]
  HlmPaginationItem, // directive: li[hlmPaginationItem]
  HlmPaginationLink, // directive: [hlmPaginationLink]
  HlmPaginationPrevious, // component: hlm-pagination-previous
  HlmPaginationNext, // component: hlm-pagination-next
  HlmPaginationEllipsis, // component: hlm-pagination-ellipsis
  HlmNumberedPagination, // component: hlm-numbered-pagination
  HlmNumberedPaginationQueryParams, // component: hlm-numbered-pagination-query-params
  outOfBoundCorrection, // (totalItems, itemsPerPage, currentPage) => number
  createPageArray, // (currentPage, itemsPerPage, totalItems, range) => (number | '...')[]
  HlmPaginationImports, // all nine components above
  HlmPaginationModule, // NgModule wrapping HlmPaginationImports
} from '@egose/shadcn-theme-ng/pagination';
```

Standalone usage:

```ts
import { Component } from '@angular/core';
import { HlmPaginationImports } from '@egose/shadcn-theme-ng/pagination';

@Component({
  selector: 'app-demo',
  standalone: true,
  imports: [...HlmPaginationImports],
  template: ` <hlm-numbered-pagination [(currentPage)]="page" [(itemsPerPage)]="pageSize" [totalItems]="230" /> `,
})
export class DemoComponent {
  page = 1;
  pageSize = 10;
}
```

NgModule usage:

```ts
import { NgModule } from '@angular/core';
import { HlmPaginationModule } from '@egose/shadcn-theme-ng/pagination';

@NgModule({ imports: [HlmPaginationModule] })
export class DemoModule {}
```

For the `tw:` build, swap the specifier to `@egose/shadcn-theme-ng-tw/pagination`. Symbol names are identical.

## Anatomy / Structure

```html
<!-- Hand-rolled pager -->
<nav hlmPagination aria-label="Search results pages">
  <ul hlmPaginationContent>
    <li hlmPaginationItem>
      <hlm-pagination-previous />
    </li>
    <li hlmPaginationItem>
      <a hlmPaginationLink [isActive]="true">1</a>
    </li>
    <li hlmPaginationItem>
      <a hlmPaginationLink link="/items" [queryParams]="{ page: 2 }">2</a>
    </li>
    <li hlmPaginationItem>
      <hlm-pagination-ellipsis />
    </li>
    <li hlmPaginationItem>
      <hlm-pagination-next [iconOnly]="true" />
    </li>
  </ul>
</nav>

<!-- Drop-in numbered pager (client state) -->
<hlm-numbered-pagination
  [(currentPage)]="page"
  [(itemsPerPage)]="pageSize"
  [totalItems]="total"
  [maxSize]="7"
  [showEdges]="true"
  [pageSizes]="[10, 20, 50, 100]"
/>

<!-- Drop-in pager bound to router ?page= -->
<hlm-numbered-pagination-query-params
  [(currentPage)]="page"
  [(itemsPerPage)]="pageSize"
  [totalItems]="total"
  link="."
/>
```

| Class                              | Selector                               | Role                                                                           |
| ---------------------------------- | -------------------------------------- | ------------------------------------------------------------------------------ |
| `HlmPagination`                    | `[hlmPagination],hlm-pagination`       | `<nav role="navigation">` shell                                                |
| `HlmPaginationContent`             | `ul[hlmPaginationContent]`             | Row list (`flex items-center gap-1`)                                           |
| `HlmPaginationItem`                | `li[hlmPaginationItem]`                | Item wrapper (slot only, no styling)                                           |
| `HlmPaginationLink`                | `[hlmPaginationLink]`                  | Page link (`RouterLink` host; active → `outline` button, else `ghost`)         |
| `HlmPaginationPrevious`            | `hlm-pagination-previous`              | Chevron-left + "Previous" link                                                 |
| `HlmPaginationNext`                | `hlm-pagination-next`                  | "Next" + chevron-right link                                                    |
| `HlmPaginationEllipsis`            | `hlm-pagination-ellipsis`              | `…` gap marker + sr-only text                                                  |
| `HlmNumberedPagination`            | `hlm-numbered-pagination`              | Full pager: count summary + nav + page-size `hlm-select`                       |
| `HlmNumberedPaginationQueryParams` | `hlm-numbered-pagination-query-params` | Same, but every link navigates with `queryParamsHandling="merge"` and `?page=` |

## API reference

### Primitives

| Selector                                           | Inputs                                                                                                                                                                                                                                                                                                                                                                                                                                          | Notes                                                                                                                                             |
| -------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| `[hlmPagination],hlm-pagination` (`HlmPagination`) | `ariaLabel` (alias `aria-label`): `string`, default `'pagination'`                                                                                                                                                                                                                                                                                                                                                                              | `role="navigation"` + `aria-label` binding                                                                                                        |
| `ul[hlmPaginationContent]`                         | —                                                                                                                                                                                                                                                                                                                                                                                                                                               | Layout only                                                                                                                                       |
| `li[hlmPaginationItem]`                            | —                                                                                                                                                                                                                                                                                                                                                                                                                                               | Slot only                                                                                                                                         |
| `[hlmPaginationLink]` (`HlmPaginationLink`)        | `isActive: boolean` (default `false`, boolean coercion) → `data-active` + `aria-current="page"`; `size: ButtonVariants['size']` (default `'icon'`); `link: RouterLink['routerLink']` (optional — no `link` renders a `cursor-pointer` span-like anchor); plus full `RouterLink` host inputs (`queryParams`, `fragment`, `queryParamsHandling`, `state`, `info`, `relativeTo`, `preserveFragment`, `skipLocationChange`, `replaceUrl`, `target`) | Styling: `buttonVariants({ variant: isActive ? 'outline' : 'ghost', size })`                                                                      |
| `hlm-pagination-previous`                          | `class`, `link`, `queryParams`, `queryParamsHandling` (all `RouterLink` types); `ariaLabel` (alias `aria-label`, default `'Go to previous page'`); `text` (default `'Previous'`); `iconOnly: boolean` (default `false`)                                                                                                                                                                                                                         | Label hidden on small screens unless `iconOnly` (`sr-only` vs `hidden sm:block`); size collapses to `icon` when `iconOnly`; non-icon adds `ps-2!` |
| `hlm-pagination-next`                              | Same shape; defaults `'Go to next page'` / `'Next'`; non-icon adds `pe-2!`                                                                                                                                                                                                                                                                                                                                                                      | Mirrored; chevron flips in RTL (`rtl:rotate-180`)                                                                                                 |
| `hlm-pagination-ellipsis`                          | `srOnlyText: string` (default `'More pages'`)                                                                                                                                                                                                                                                                                                                                                                                                   | `size-9` centered `lucideEllipsis` + sr-only text                                                                                                 |

### `HlmNumberedPagination` (`hlm-numbered-pagination`)

| Member         | Kind                 | Type / Default                               | Notes                                                                                                        |
| -------------- | -------------------- | -------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| `currentPage`  | **model (required)** | `number`                                     | Two-way: `[(currentPage)]`. Clicks set it; out-of-range values are auto-corrected via `outOfBoundCorrection` |
| `itemsPerPage` | **model (required)** | `number`                                     | Two-way: `[(itemsPerPage)]`, bound to the page-size `hlm-select`                                             |
| `totalItems`   | input (required)     | `number` (number coercion)                   | Server or client total; `0`/negative collapses to a single empty page                                        |
| `maxSize`      | input                | `number`, default `7` (number coercion)      | Max page links in the window (ellipsis logic from `ngx-pagination`)                                          |
| `showEdges`    | input                | `boolean`, default `true` (boolean coercion) | Shows prev/next edge buttons (hidden on first/last page respectively)                                        |
| `pageSizes`    | input                | `number[]`, default `[10, 20, 50, 100]`      | Page-size menu; the current size is merged in + sorted if missing                                            |

Layout: `flex justify-between` row — left count summary (`<b>total</b> total items | <b>pages</b> pages`), center pager, right `hlm-select` page-size picker. Previous/next are plain click handlers (`goToPrevious/goToNext`); page links set `currentPage` directly without routing.

### `HlmNumberedPaginationQueryParams` (`hlm-numbered-pagination-query-params`)

Same models/inputs as `HlmNumberedPagination` **plus**:

| Member | Kind  | Type / Default          | Notes                                                    |
| ------ | ----- | ----------------------- | -------------------------------------------------------- |
| `link` | input | `string`, default `'.'` | Base path for every page link (current route by default) |

Every link (prev/numbered/next) navigates via `RouterLink` with `[queryParams]="{ page }"` and `queryParamsHandling="merge"`. The active page renders with `link === undefined` (no navigation) + `isActive`.

### Helpers

| Symbol                                                                    | Signature                                                 | Notes                                                                                                    |
| ------------------------------------------------------------------------- | --------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| `outOfBoundCorrection(totalItems, itemsPerPage, currentPage)`             | `(number, number, number) => number`                      | Clamps to `[1, totalPages]` (from `ngx-pagination`)                                                      |
| `createPageArray(currentPage, itemsPerPage, totalItems, paginationRange)` | `(number, number, number, number) => (number \| '...')[]` | Window with `'...'` gaps; powers both numbered pagers                                                    |
| `Page`                                                                    | `type Page = number \| '...'`                             | Not exported from public-api (internal to the pager file) — redeclare locally if you type custom windows |

## Examples

### 1. Hand-rolled pager with router links

```ts
import { Component, signal } from '@angular/core';
import { HlmPaginationImports } from '@egose/shadcn-theme-ng/pagination';

@Component({
  selector: 'app-pager-basic',
  standalone: true,
  imports: [...HlmPaginationImports],
  template: `
    <nav hlmPagination aria-label="Article pages">
      <ul hlmPaginationContent>
        <li hlmPaginationItem>
          <hlm-pagination-previous link="/articles" [queryParams]="{ page: page() - 1 }" />
        </li>
        @for (p of [1, 2, 3]; track p) {
          <li hlmPaginationItem>
            <a hlmPaginationLink link="/articles" [queryParams]="{ page: p }" [isActive]="p === page()">
              {{ p }}
            </a>
          </li>
        }
        <li hlmPaginationItem>
          <hlm-pagination-next link="/articles" [queryParams]="{ page: page() + 1 }" />
        </li>
      </ul>
    </nav>
  `,
})
export class PagerBasicComponent {
  readonly page = signal(1);
}
```

### 2. Drop-in client-side pager + sliced list

```ts
import { Component, signal, computed } from '@angular/core';
import { HlmPaginationImports } from '@egose/shadcn-theme-ng/pagination';

@Component({
  selector: 'app-pager-client',
  standalone: true,
  imports: [...HlmPaginationImports],
  template: `
    <ul class="tw:grid tw:gap-1 tw:py-2">
      @for (item of visible(); track item) {
        <li class="tw:border tw:rounded tw:px-2 tw:py-1 tw:text-sm">{{ item }}</li>
      }
    </ul>

    <hlm-numbered-pagination
      [(currentPage)]="page"
      [(itemsPerPage)]="pageSize"
      [totalItems]="items().length"
      [maxSize]="5"
      [pageSizes]="[5, 10, 25]"
    />
  `,
})
export class PagerClientComponent {
  readonly items = signal(Array.from({ length: 42 }, (_, i) => `Item ${i + 1}`));
  readonly page = signal(1);
  readonly pageSize = signal(10);

  readonly visible = computed(() => {
    const start = (this.page() - 1) * this.pageSize();
    return this.items().slice(start, start + this.pageSize());
  });
}
```

### 3. Router `?page=` pager (server-driven)

```ts
import { Component, signal, effect } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HlmPaginationImports } from '@egose/shadcn-theme-ng/pagination';

@Component({
  selector: 'app-pager-query',
  standalone: true,
  imports: [...HlmPaginationImports],
  template: `
    <hlm-numbered-pagination-query-params
      [(currentPage)]="page"
      [(itemsPerPage)]="pageSize"
      [totalItems]="total()"
      link="."
    />
    <p class="tw:text-sm tw:text-muted-foreground">URL holds ?page={{ page }}.</p>
  `,
})
export class PagerQueryComponent {
  readonly page = signal(1);
  readonly pageSize = signal(10);
  readonly total = signal(320);

  constructor(route: ActivatedRoute) {
    effect(() => {
      // keep ?page= as the source of truth on back/forward + deep links
      const sub = route.queryParamMap.subscribe((params) => {
        const p = Number(params.get('page') ?? 1);
        this.page.set(Number.isFinite(p) && p >= 1 ? Math.floor(p) : 1);
      });
      return () => sub.unsubscribe();
    });
  }
}
```

### 4. Icon-only edges, custom labels, custom aria

```ts
import { Component } from '@angular/core';
import { HlmPaginationImports } from '@egose/shadcn-theme-ng/pagination';

@Component({
  selector: 'app-pager-edges',
  standalone: true,
  imports: [...HlmPaginationImports],
  template: `
    <nav hlmPagination aria-label="Gallery pages">
      <ul hlmPaginationContent>
        <li hlmPaginationItem>
          <hlm-pagination-previous [iconOnly]="true" text="Back" aria-label="Previous gallery page" />
        </li>
        <li hlmPaginationItem>
          <a hlmPaginationLink [isActive]="true">7</a>
        </li>
        <li hlmPaginationItem>
          <hlm-pagination-ellipsis srOnlyText="Skipped pages" />
        </li>
        <li hlmPaginationItem>
          <a hlmPaginationLink>12</a>
        </li>
        <li hlmPaginationItem>
          <hlm-pagination-next [iconOnly]="true" text="Forward" aria-label="Next gallery page" />
        </li>
      </ul>
    </nav>
  `,
})
export class PagerEdgesComponent {}
```

### 5. Custom window with exported helpers

```ts
import { Component, signal, computed } from '@angular/core';
import { HlmPaginationImports, createPageArray } from '@egose/shadcn-theme-ng/pagination';

@Component({
  selector: 'app-pager-custom-window',
  standalone: true,
  imports: [...HlmPaginationImports],
  template: `
    <nav hlmPagination>
      <ul hlmPaginationContent>
        @for (p of window(); track p) {
          <li hlmPaginationItem>
            @if (p === '...') {
              <hlm-pagination-ellipsis />
            } @else {
              <a hlmPaginationLink [isActive]="p === page()" (click)="page.set(p)">{{ p }}</a>
            }
          </li>
        }
      </ul>
    </nav>
  `,
})
export class PagerCustomWindowComponent {
  readonly page = signal(6);
  readonly window = computed(() => createPageArray(this.page(), 10, 300, 7));
}
```

### 6. Hide edges + compact sizes

```ts
import { Component, signal } from '@angular/core';
import { HlmPaginationImports } from '@egose/shadcn-theme-ng/pagination';

@Component({
  selector: 'app-pager-compact',
  standalone: true,
  imports: [...HlmPaginationImports],
  template: `
    <hlm-numbered-pagination
      [(currentPage)]="page"
      [(itemsPerPage)]="pageSize"
      [totalItems]="95"
      [maxSize]="5"
      [showEdges]="false"
      [pageSizes]="[5, 10]"
    />
  `,
})
export class PagerCompactComponent {
  readonly page = signal(1);
  readonly pageSize = signal(5);
}
```

## Accessibility notes

- The shell is `role="navigation"` with a configurable `aria-label` — always set a distinguishing label when several pagers share a page.
- Active links expose `aria-current="page"`; ellipsis exposes configurable sr-only text; prev/next expose configurable `aria-label`s (`iconOnly` collapses visible text to `sr-only`, keeping the accessible name).
- Numbered pagers announce totals as plain text ("N total items | M pages"); for live search results, mirror the count into an `aria-live` region in your own template.
- Keyboard: links are native anchors (tab/enter work); the client-state pager uses clickable anchors without `link` for page numbers — they remain focusable via `cursor-pointer` styling but prefer the query-params pager when deep-linkability matters.

## Theming / CSS variables

No theming inputs. Links reuse `buttonVariants` (`ghost`/`outline`, `icon`/`default` sizes); the pager chrome is uncolored layout. Tune density with `maxSize`/`showEdges`/`pageSizes` and per-instance `class` on prev/next.

## Related subpaths

- `@egose/shadcn-theme-ng/button` (`buttonVariants`) — sizing/variant engine behind `HlmPaginationLink`.
- `@egose/shadcn-theme-ng/select` — page-size picker inside both numbered pagers.
- `@egose/shadcn-theme-ng/table` — common parent for paged data grids.
