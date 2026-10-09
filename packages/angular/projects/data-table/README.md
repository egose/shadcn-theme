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
  [getRowId]="paymentId"
  [(layout)]="layout"
  (selectionChange)="onSelect($event)"
/>
```

- `enableSelection` auto-prepends a checkbox column; `selectionChange` emits the selected rows.
- Define `readonly paymentId = (payment: Payment): string => payment.id` on the host. `getRowId` is a pure callback returning a unique, stable string per entity; keep the callback reference stable.
- `[(layout)]` toggles `'table' | 'grid'` (grid requires `gridColumns`). Column `meta: { hideInTable: true }` hides a column in table layout; `meta: { thumbnail: true }` renders it as the card banner.
- Sortable plain-string headers get an inline sort button; richer headers should use `EgDataTableColumnHeader` via `flexRenderComponent` (no type arguments needed — its `column` input accepts any TanStack column through the `EgSortableColumn` structural type):

```ts
import { flexRenderComponent } from '@tanstack/angular-table';
import { EgDataTableColumnHeader } from '@egose/shadcn-theme-ng/data-table';

helper.accessor('email', {
  header: ({ column }) => flexRenderComponent(EgDataTableColumnHeader, { inputs: { column, title: 'Email' } }),
});
```

### Selection identity and scope

- **Stable IDs:** supply `getRowId` whenever rows can be refreshed, reordered, or fetched from a server. Selection follows IDs still present in the supplied rows, and refreshes emit the current objects, not stale snapshots. Removed IDs are discarded and are not selected if they later return. Changing the callback clears selection.
- **Server pages:** selection is scoped to the loaded slice, not an accumulated cross-page bulk-action set. Replacing a page keeps only selected IDs also in the new slice. Refreshing the same slice preserves selection when IDs match. Passing `null` or an empty slice clears it; keep the current slice and set `isLoading` if selection should survive loading a refresh.
- **Client filtering/paging:** `filterRows` defines the available selection scope; removing a row there discards its selection. Built-in column filters and client pagination only hide rows: hidden selections remain in `selectionChange`. Header selection toggles only the displayed page; table and grid share selection. The footer selection count describes the filtered subset.
- **Without `getRowId`:** existing positional `initialRowSelection` keys (`'0'`, `'1'`, etc.) remain supported for the initial rows. Replacing the source array (including a same-record refresh) or changing the `filterRows` result array clears selection rather than transferring an index to a different entity. Built-in sorting/filtering/paging with the same source array preserves it. This intentionally tightens the former unsafe positional behavior.
- **Updates and outputs:** update row arrays/objects immutably; in-place mutations are not tracked. `initialRowSelection` seeds only IDs present on initialization; later seed changes are ignored. `selectionChange` fires once on initialization, then when the selected objects or their source order change, including removal and refreshed object references. Unchanged selections do not re-emit for sorting, layout, or other unrelated state changes. IDs must be unique and must not be reused for different entities.

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

Key `EgDataTable` inputs: `columns` (required), `gridColumns`, `data` (array, or page slice with `manualPagination`), `manualPagination`, `size` (`sm` / `default` / `lg` density for toolbar, table, and pagination; type scale untouched), `filterRows` (caller pre-filter for client rows, before built-in filtering/sorting/pagination; ignored in server mode), `features`, `isLoading`, `emptyMessage`, `enableSelection`, `hideFooter`, `layout` (model), `showLayoutToggle`, `showToolbar`, `filterColumnId`, `filterPlaceholder`, `showColumnToggle`, `defaultPageSize`, `showPageSize`, `pageSizes`, plus `initialSorting` / `initialColumnFilters` / `initialColumnVisibility` / `initialRowSelection` to seed state once at creation (later changes are ignored — subscribe to the corresponding `*Change` outputs instead).

Outputs: `selectionChange` (also fires once on init, mirroring React's mount effect), `pageChange`, `pageSizeChange`, `rowClick`, `sortingChange`, `columnFiltersChange`, `filterChange` (toolbar input string), `columnVisibilityChange`.

The toolbar (`showToolbar`) always renders the filter input: with `filterColumnId` it filters that column client-side (and `filterChange` mirrors the string); without it, keystrokes only emit `filterChange` so the caller can filter server-side. The column-visibility dropdown is opt-in via `showColumnToggle` (default `false`, requires `showToolbar`). `showColumnToggle` also enables hiding: the `Hide` item in `EgDataTableColumnHeader` only renders when it is true (TanStack `column.getCanHide()`), so a hidden column always has a way back via View; per-column `enableHiding: false` disables individual columns even then. `toolbarActions` takes an `ng-template` rendered on the right side of the toolbar row (built-ins stay left) — it renders the row even when `showToolbar` is false.

`size` scales spatial density one step down/up (`sm`: `h-8` headers, `p-1` cells, `h-7` buttons; `lg`: `h-12` headers, `p-3` cells, `h-9` buttons; filter input, page-size trigger, and pager meta texts follow). `EgDataTableColumnHeader` (consumer-instantiated via `flexRenderComponent`) takes the same `size` — for reactive updates put every input in `bindings` (`inputBinding('size', ...)`, plus `column`/`title`, since `bindings` cannot mix with `inputs`).

`rowClick` fires for table-row and grid-card clicks with the row's data. Clicks from nested interactive elements (buttons, links, inputs, checkboxes, selects) are ignored so selection checkboxes and row-action buttons keep working without also firing `rowClick`.

The footer pager includes a rows-per-page selector (`pageSizes`, default `[10, 20, 30, 40, 50]`; the table's current size is appended when absent). In client mode the table re-paginates immediately; in server mode the change surfaces via `pageSizeChange` so the caller can refetch with the new limit. Set `showPageSize` to `false` to hide it. `navMode` switches the navigation buttons between `icons` (default), `text` (`First`/`Previous`/`Next`/`Last`), and `both`. `EgDataTablePagination` exposes the same `showStatus` / `showPageSize` / `pageSizes` / `navMode` inputs for custom compositions.

## Related subpaths

- `@egose/shadcn-theme-ng/table` — the underlying styling directives.
- `@egose/shadcn-theme-ng/checkbox` — selection cells.
- `@egose/shadcn-theme-ng/card` — grid-layout cards.
- `@egose/shadcn-theme-ng/toggle-group` — layout switch.
- `@egose/shadcn-theme-ng/spinner` — loading indicator.
- `@egose/shadcn-theme-ng/pagination` — standalone paging controls for custom compositions.
