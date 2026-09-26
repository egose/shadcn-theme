import {
  columnFilteringFeature,
  columnVisibilityFeature,
  createFilteredRowModel,
  createPaginatedRowModel,
  createSortedRowModel,
  filterFn_includesString,
  rowPaginationFeature,
  rowSelectionFeature,
  rowSortingFeature,
  sortFn_alphanumeric,
  sortFn_text,
  tableFeatures,
  type CreatedFilterFn,
  type CreatedSortFn,
  type RowData,
  type TableFeatures,
} from '@tanstack/angular-table';

/**
 * Per-column presentation hints, ported from the React `ColumnMeta` augmentation
 * (`hideInTable` / `thumbnail`).
 *
 * - `hideInTable`: hide the column in table layout (still visible in grid layout).
 * - `thumbnail`: render this cell as the grid-card banner instead of a label/value row.
 *
 * Derived from the `columnMeta` type-only slot (single source of truth) so
 * `columnDef.meta` and this type can never drift apart. NOTE: the slot uses an
 * inline literal rather than referencing this alias — a named back-reference
 * makes ng-packagr emit a `data-table` self-import in the bundled
 * declarations, which trips dependency-contract validation.
 */
export type EgColumnMeta = EgDataTableFeatures extends { columnMeta: infer M extends object } ? M : never;

// Explicit instantiations keep the inferred feature-registry type free of `any`
// (the factories default their generics to `any` when called bare, which would
// leak into our emitted declarations and trip package validation).
const filteredRowModel = createFilteredRowModel<TableFeatures, RowData>();
const paginatedRowModel = createPaginatedRowModel<TableFeatures, RowData>();
const sortedRowModel = createSortedRowModel<TableFeatures, RowData>();
const includesString: CreatedFilterFn<TableFeatures, RowData> = filterFn_includesString;
const alphanumeric: CreatedSortFn<TableFeatures, RowData> = sortFn_alphanumeric;
const text: CreatedSortFn<TableFeatures, RowData> = sortFn_text;

/**
 * Default feature set for `EgDataTable`.
 *
 * Mirrors the Spartan data-table guide: filtering, visibility, pagination,
 * selection and sorting are opted in, with the built-in `includesString`
 * filter and `alphanumeric` / `text` sort functions registered. Anything a
 * caller does not need can be dropped by passing a custom `features` input.
 *
 * Keep this reference stable (module scope) — `injectTable()` re-evaluates
 * its initializer on every signal read, so recreating features per render
 * would thrash the table instance.
 */
export const defaultEgDataTableFeatures = tableFeatures({
  columnFilteringFeature,
  columnVisibilityFeature,
  rowPaginationFeature,
  rowSelectionFeature,
  rowSortingFeature,
  filteredRowModel,
  paginatedRowModel,
  sortedRowModel,
  filterFns: { includesString },
  sortFns: { alphanumeric, text },
  columnMeta: {} as { readonly hideInTable?: boolean; readonly thumbnail?: boolean },
});

/** Feature registry type — pass as first generic arg to `ColumnDef` / `Table` / `Row`. */
export type EgDataTableFeatures = typeof defaultEgDataTableFeatures;
