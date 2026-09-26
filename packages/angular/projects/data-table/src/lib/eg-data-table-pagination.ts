import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { HlmButton } from '@egose/shadcn-theme-ng/button';
import { HlmIcon } from '@egose/shadcn-theme-ng/icon';
import { HlmSelectImports } from '@egose/shadcn-theme-ng/select';
import { injectTableContext } from '@tanstack/angular-table';
import { hlm } from '@egose/shadcn-theme-ng/utils';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronLeft, lucideChevronRight, lucideChevronsLeft, lucideChevronsRight } from '@ng-icons/lucide';

/**
 * Standalone pagination controls with an optional rows-per-page selector.
 *
 * Reads the table from the nearest `[tanStackTable]` directive, so no table
 * input or generics are needed and the same component works with any table.
 * Wrap the usage site: `<div [tanStackTable]="table"><eg-data-table-pagination /></div>`.
 *
 * Page-size changes flow through `table.setPageSize()`: client-side tables
 * re-paginate immediately, while server-driven (`manualPagination`) tables
 * surface the change via their `onPaginationChange` handler (e.g. the
 * `pageSizeChange` output of `EgDataTable`) so the caller can refetch.
 */
/** Pager navigation-button content: icons only, text labels only, or both. */
export type EgPaginationNavMode = 'icons' | 'text' | 'both';

@Component({
  selector: 'eg-data-table-pagination',
  imports: [HlmButton, HlmIcon, HlmSelectImports, NgIcon],
  providers: [provideIcons({ lucideChevronLeft, lucideChevronRight, lucideChevronsLeft, lucideChevronsRight })],
  template: `
    <div class="tw:flex tw:flex-wrap tw:items-center tw:justify-between tw:gap-2 tw:px-2">
      @if (showStatus()) {
        <div class="tw:text-muted-foreground tw:flex-1 tw:text-sm">{{ _statusText() }}</div>
      }
      <div class="tw:flex tw:flex-wrap tw:items-center tw:gap-x-6 tw:gap-y-2 tw:lg:gap-x-8">
        @if (showPageSize()) {
          <div class="tw:flex tw:items-center tw:gap-2">
            <p class="tw:text-sm tw:font-medium">Rows per page</p>
            <div hlmSelect class="tw:inline-flex" [value]="_pageSize()" (valueChange)="_onPageSizeChange($event)">
              <hlm-select-trigger class="tw:h-8 tw:w-[70px]">
                <hlm-select-value />
              </hlm-select-trigger>
              <hlm-select-content *hlmSelectPortal>
                @for (size of _pageSizeOptions(); track size) {
                  <hlm-select-item [value]="size">{{ size }}</hlm-select-item>
                }
              </hlm-select-content>
            </div>
          </div>
        }
        @if (_showPager()) {
          <div class="tw:flex tw:w-[100px] tw:items-center tw:justify-center tw:text-sm tw:font-medium">
            Page {{ _pageIndex() + 1 }} of {{ _pageCount() }}
          </div>
          <div class="tw:flex tw:items-center tw:gap-2">
            <button
              hlmButton
              variant="secondary"
              appearance="outline"
              size="sm"
              [class]="_edgeNavButtonClass()"
              type="button"
              [disabled]="!_canPrevious()"
              (click)="_table().setPageIndex(0)"
              aria-label="Go to first page"
            >
              @if (navMode() !== 'text') {
                <ng-icon hlm size="sm" name="lucideChevronsLeft" />
              }
              @if (navMode() !== 'icons') {
                <span>First</span>
              }
            </button>
            <button
              hlmButton
              variant="secondary"
              appearance="outline"
              size="sm"
              [class]="_navButtonClass()"
              type="button"
              [disabled]="!_canPrevious()"
              (click)="_table().previousPage()"
              aria-label="Go to previous page"
            >
              @if (navMode() !== 'text') {
                <ng-icon hlm size="sm" name="lucideChevronLeft" />
              }
              @if (navMode() !== 'icons') {
                <span>Previous</span>
              }
            </button>
            <button
              hlmButton
              variant="secondary"
              appearance="outline"
              size="sm"
              [class]="_navButtonClass()"
              type="button"
              [disabled]="!_canNext()"
              (click)="_table().nextPage()"
              aria-label="Go to next page"
            >
              @if (navMode() !== 'icons') {
                <span>Next</span>
              }
              @if (navMode() !== 'text') {
                <ng-icon hlm size="sm" name="lucideChevronRight" />
              }
            </button>
            <button
              hlmButton
              variant="secondary"
              appearance="outline"
              size="sm"
              [class]="_edgeNavButtonClass()"
              type="button"
              [disabled]="!_canNext()"
              (click)="_table().setPageIndex(_pageCount() - 1)"
              aria-label="Go to last page"
            >
              @if (navMode() !== 'icons') {
                <span>Last</span>
              }
              @if (navMode() !== 'text') {
                <ng-icon hlm size="sm" name="lucideChevronsRight" />
              }
            </button>
          </div>
        }
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EgDataTablePagination {
  /** Show the `selected of total` status text. Set false when the host renders its own status. */
  public readonly showStatus = input<boolean>(true);
  /** Show the rows-per-page selector. */
  public readonly showPageSize = input<boolean>(true);
  /** Page-size options. The table's current size is appended when absent. */
  public readonly pageSizes = input<readonly number[]>([10, 20, 30, 40, 50]);
  /** Navigation-button content: icons only, text labels only, or both. */
  public readonly navMode = input<EgPaginationNavMode>('icons');

  protected readonly _table = injectTableContext();

  protected readonly _pageCount = computed(() => this._table().getPageCount());
  // `atoms` are signal-backed, so the pager stays in sync with the table.
  protected readonly _pageIndex = computed(() => this._table().atoms.pagination.get().pageIndex);
  protected readonly _pageSize = computed(() => this._table().atoms.pagination.get().pageSize);
  protected readonly _canPrevious = computed(() => this._table().getCanPreviousPage());
  protected readonly _canNext = computed(() => this._table().getCanNextPage());
  protected readonly _showPager = computed(() => this._pageCount() > 1);

  /** Icon-only buttons stay square; labeled buttons size to their text. Merged by `hlmButton` via the `class` binding. */
  protected readonly _navButtonClass = computed(() =>
    hlm('tw:h-8 tw:p-0', this.navMode() === 'icons' ? 'tw:w-8' : 'tw:gap-1 tw:px-2'),
  );
  /** First/last buttons stay desktop-only. */
  protected readonly _edgeNavButtonClass = computed(() => hlm('tw:hidden tw:lg:flex', this._navButtonClass()));

  protected readonly _pageSizeOptions = computed(() => {
    const sizes = this.pageSizes();
    const current = this._pageSize();
    if (sizes.includes(current)) return sizes;
    return [...sizes, current].sort((left, right) => left - right);
  });

  protected readonly _statusText = computed(() => {
    const table = this._table();
    const selected = table.getFilteredSelectedRowModel().rows.length;
    const total = table.getFilteredRowModel().rows.length;
    if (selected > 0) return `${selected} of ${total} row(s) selected.`;
    return `${total} row(s).`;
  });

  protected _onPageSizeChange(value: unknown): void {
    this._table().setPageSize(Number(value));
  }
}
