# Data Table (`@egose/shadcn-theme-ng/data-table`)

A generic, TanStack-powered data table with sorting, filtering, pagination, row selection, column visibility, and an optional card-grid layout — equivalent to combining [shadcn/ui Table](https://ui.shadcn.com/docs/components/table) with the [Spartan data-table guide](https://www.spartan.ng/components/data-table). The caller passes `columns` (and optionally `gridColumns`); the table owns its state internally and notifies via outputs.

> **Ships as:** `@egose/shadcn-theme-ng/data-table` and `@egose/shadcn-theme-ng-tw/data-table` (the `tw:`-prefixed Tailwind variant). See the [package README](../../README.md) for install steps, peer dependencies, Tailwind setup, and testing/release guidance. Do not publish this project directory independently.

## Installation

```bash
# Plain Tailwind (no prefix)
npm install @egose/shadcn-theme-ng @tanstack/angular-table

# Or the tw:-prefixed variant
npm install @egose/shadcn-theme-ng-tw @tanstack/angular-table
```

`@tanstack/angular-table` (`>=9.1.2 <10.0.0`) is a peer dependency — install it alongside the theme package. See the [package README](../../README.md) for the full peer-dependency table.

## Imports

All public symbols are re-exported from `projects/data-table/src/public-api.ts`:

```ts
import {
  EgDataTable,
  EgDataTableColumnHeader,
  EgDataTableImports,
  EgDataTableModule,
  EgDataTablePagination,
  EgDataTableViewOptions,
  EgSortableColumn,
  EgTableHeadSelection,
  EgTableRowSelection,
  defaultEgDataTableFeatures,
  type EgDataTableFeatures,
  type EgDataTableLayout,
  type EgPaginatedResponse,
} from '@egose/shadcn-theme-ng/data-table';
// tw variant: swap to '@egose/shadcn-theme-ng-tw/data-table'
```

## Client mode

```ts
import { Component, signal } from '@angular/core';
import { createColumnHelper } from '@tanstack/angular-table';
import { EgDataTable, type EgDataTableFeatures } from '@egose/shadcn-theme-ng/data-table';

interface Payment {
  id: string;
  amount: number;
  status: string;
  email: string;
}

const helper = createColumnHelper<EgDataTableFeatures, Payment>();
const columns = helper.columns([
  helper.accessor('status', { header: 'Status' }),
  helper.accessor('email', { header: 'Email' }),
  helper.accessor('amount', { header: 'Amount' }),
]);

@Component({
  selector: 'app-payments',
  imports: [EgDataTable],
  template: `<eg-data-table [columns]="columns" [data]="payments()" />`,
})
export class PaymentsComponent {
  protected readonly payments = signal<Payment[]>([
    { id: '1', amount: 100, status: 'pending', email: 'm@example.com' },
  ]);
}
```

## Server mode

Pass `data` as a page slice with `manualPagination` set. The slice renders as-is — sorting and filtering are not applied client-side. Page, sort and filter interactions emit `pageChange` / `pageSizeChange` / `sortingChange` / `filterChange` (`columnFiltersChange`) so the caller can fetch the next slice:

```ts
@Component({
  selector: 'app-server-payments',
  imports: [EgDataTable],
  template: `
    <eg-data-table
      [columns]="columns"
      [data]="page()"
      [manualPagination]="true"
      [isLoading]="loading()"
      (pageChange)="load($event)"
    />
  `,
})
export class ServerPaymentsComponent {
  protected readonly page = signal<EgPaginatedResponse<Payment> | null>(null);
  protected readonly loading = signal(true);

  load(pageIndex: number) {
    // fetch `/api/payments?page=${pageIndex}` then `page.set(response)`
  }
}
```

## Selection, sorting, grid layout

```ts
<eg-data-table
  [columns]="columns"
  [gridColumns]="gridColumns"
  [data]="payments()"
  [enableSelection]="true"
  [(layout)]="layout"
  (selectionChange)="onSelect($event)"
/>
```

- `enableSelection` auto-prepends a checkbox column; `selectionChange` emits the selected rows.
- `[(layout)]` toggles `'table' | 'grid'` (grid requires `gridColumns`). Column `meta: { hideInTable: true }` hides a column in table layout; `meta: { thumbnail: true }` renders it as the card banner.
- Sortable plain-string headers get an inline sort button; richer headers should use `EgDataTableColumnHeader` via `flexRenderComponent` (no type arguments needed — its `column` input accepts any TanStack column through the `EgSortableColumn` structural type):

```ts
import { flexRenderComponent } from '@tanstack/angular-table';
import { EgDataTableColumnHeader } from '@egose/shadcn-theme-ng/data-table';

helper.accessor('email', {
  header: ({ column }) => flexRenderComponent(EgDataTableColumnHeader, { inputs: { column, title: 'Email' } }),
});
```

## API reference

| Symbol                                               | Kind                                                                                                       |
| ---------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| `EgDataTable`                                        | Component (`eg-data-table`), generic over `TData extends RowData`                                          |
| `EgDataTableColumnHeader`                            | Sortable/hideable header component for `flexRenderComponent` usage (non-generic; takes `EgSortableColumn`) |
| `EgSortableColumn`                                   | Minimal structural column surface the header needs (any TanStack `Column` satisfies it)                    |
| `EgDataTablePagination`                              | Standalone pager (`[tanStackTable]` DI) with page navigation + rows-per-page selector                      |
| `EgDataTablePagination`                              | Standalone pager reading the table from `[tanStackTable]` DI                                               |
| `EgDataTableViewOptions`                             | Column-visibility dropdown reading the table from `[tanStackTable]` DI                                     |
| `EgTableHeadSelection` / `EgTableRowSelection`       | Selection checkboxes (auto-used when `enableSelection`)                                                    |
| `defaultEgDataTableFeatures` / `EgDataTableFeatures` | Default TanStack feature registry + type                                                                   |
| `EgPaginatedResponse`                                | Server page-slice interface                                                                                |
| `EgDataTableLayout`                                  | `'table' \| 'grid'`                                                                                        |
| `EgDataTableImports` / `EgDataTableModule`           | Standalone imports array / NgModule                                                                        |

Key `EgDataTable` inputs: `columns` (required), `gridColumns`, `data` (array, or page slice with `manualPagination`), `manualPagination`, `filterRows` (caller pre-filter for client rows, before built-in filtering/sorting/pagination; ignored in server mode), `features`, `isLoading`, `emptyMessage`, `enableSelection`, `hideFooter`, `layout` (model), `showLayoutToggle`, `showToolbar`, `filterColumnId`, `filterPlaceholder`, `showColumnToggle`, `defaultPageSize`, `showPageSize`, `pageSizes`, plus `initialSorting` / `initialColumnFilters` / `initialColumnVisibility` / `initialRowSelection` to seed state once at creation (later changes are ignored — subscribe to the corresponding `*Change` outputs instead).

Outputs: `selectionChange` (also fires once on init, mirroring React's mount effect), `pageChange`, `pageSizeChange`, `rowClick`, `sortingChange`, `columnFiltersChange`, `filterChange` (toolbar input string), `columnVisibilityChange`.

The toolbar (`showToolbar`) always renders the filter input: with `filterColumnId` it filters that column client-side (and `filterChange` mirrors the string); without it, keystrokes only emit `filterChange` so the caller can filter server-side. The column-visibility dropdown is opt-in via `showColumnToggle` (default `false`). `toolbarActions` takes an `ng-template` rendered on the right side of the toolbar row (built-ins stay left) — it renders the row even when `showToolbar` is false.

`rowClick` fires for table-row and grid-card clicks with the row's data. Clicks from nested interactive elements (buttons, links, inputs, checkboxes, selects) are ignored so selection checkboxes and row-action buttons keep working without also firing `rowClick`.

The footer pager includes a rows-per-page selector (`pageSizes`, default `[10, 20, 30, 40, 50]`; the table's current size is appended when absent). In client mode the table re-paginates immediately; in server mode the change surfaces via `pageSizeChange` so the caller can refetch with the new limit. Set `showPageSize` to `false` to hide it. `navMode` switches the navigation buttons between `icons` (default), `text` (`First`/`Previous`/`Next`/`Last`), and `both`. `EgDataTablePagination` exposes the same `showStatus` / `showPageSize` / `pageSizes` / `navMode` inputs for custom compositions.

## Related subpaths

- `@egose/shadcn-theme-ng/table` — the underlying styling directives.
- `@egose/shadcn-theme-ng/checkbox` — selection cells.
- `@egose/shadcn-theme-ng/card` — grid-layout cards.
- `@egose/shadcn-theme-ng/toggle-group` — layout switch.
- `@egose/shadcn-theme-ng/spinner` — loading indicator.
- `@egose/shadcn-theme-ng/pagination` — standalone paging controls for custom compositions.
