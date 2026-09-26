/**
 * Server-driven page slice, mirroring the React `PaginatedResponse` contract.
 *
 * - `items` is the current page slice (server already sliced it).
 * - `total` is the total record count across all pages.
 * - `limit` is the server page size, `offset` the zero-based record offset.
 * - `hasPrevious` / `hasNext` drive the pager disabled state together with
 *   the table's own `getCanPreviousPage()` / `getCanNextPage()`.
 */
export interface EgPaginatedResponse<TData> {
  readonly items: readonly TData[];
  readonly total: number;
  readonly limit: number;
  readonly offset: number;
  readonly hasPrevious: boolean;
  readonly hasNext: boolean;
}
