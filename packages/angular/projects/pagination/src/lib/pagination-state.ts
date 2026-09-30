/** Shared arithmetic policy; invalid totals/sizes represent a single page. */
export function pageCount(totalItems: number, itemsPerPage: number): number {
  if (!Number.isFinite(totalItems) || totalItems <= 0 || !Number.isFinite(itemsPerPage) || itemsPerPage <= 0) {
    return 1;
  }
  return Math.min(Number.MAX_SAFE_INTEGER, Math.max(1, Math.ceil(totalItems / itemsPerPage)));
}
