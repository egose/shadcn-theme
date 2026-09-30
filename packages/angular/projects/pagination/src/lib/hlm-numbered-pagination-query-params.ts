import type { BooleanInput, NumberInput } from '@angular/cdk/coercion';
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  input,
  model,
  numberAttribute,
  untracked,
} from '@angular/core';
import { HlmSelectImports } from '@egose/shadcn-theme-ng/select';
import { classes } from '@egose/shadcn-theme-ng/utils';
import { createPageArray, outOfBoundCorrection } from './hlm-numbered-pagination';
import { HlmPagination } from './hlm-pagination';
import { HlmPaginationContent } from './hlm-pagination-content';
import { HlmPaginationEllipsis } from './hlm-pagination-ellipsis';
import { HlmPaginationItem } from './hlm-pagination-item';
import { HlmPaginationLink } from './hlm-pagination-link';
import { HlmPaginationNext } from './hlm-pagination-next';
import { HlmPaginationPrevious } from './hlm-pagination-previous';
import { pageCount } from './pagination-state';

@Component({
  selector: 'hlm-numbered-pagination-query-params',
  imports: [
    HlmPagination,
    HlmPaginationContent,
    HlmPaginationItem,
    HlmPaginationPrevious,
    HlmPaginationNext,
    HlmPaginationLink,
    HlmPaginationEllipsis,
    HlmSelectImports,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="tw:flex tw:items-center tw:gap-1 tw:text-sm tw:text-nowrap tw:text-gray-600">
      <b>{{ totalItems() }}</b>
      total items |
      <b>{{ _lastPageNumber() }}</b>
      pages
    </div>

    <nav hlmPagination>
      <ul hlmPaginationContent>
        @if (showEdges() && !_isFirstPageActive()) {
          <li hlmPaginationItem>
            <hlm-pagination-previous
              [link]="link()"
              [queryParams]="{ page: _currentPage() - 1 }"
              queryParamsHandling="merge"
            />
          </li>
        }

        @for (page of _pages(); track $index) {
          <li hlmPaginationItem>
            @if (page === '...') {
              <hlm-pagination-ellipsis />
            } @else {
              <a
                hlmPaginationLink
                [link]="_currentPage() !== page ? link() : undefined"
                [queryParams]="{ page }"
                queryParamsHandling="merge"
                [isActive]="_currentPage() === page"
              >
                {{ page }}
              </a>
            }
          </li>
        }

        @if (showEdges() && !_isLastPageActive()) {
          <li hlmPaginationItem>
            <hlm-pagination-next
              [link]="link()"
              [queryParams]="{ page: _currentPage() + 1 }"
              queryParamsHandling="merge"
            />
          </li>
        }
      </ul>
    </nav>

    <!-- Show Page Size selector -->
    <hlm-select [(value)]="itemsPerPage" class="tw:ml-auto">
      <hlm-select-trigger class="tw:w-fit">
        <hlm-select-value />
      </hlm-select-trigger>
      <hlm-select-content *hlmSelectPortal>
        <hlm-select-group>
          @for (pageSize of _pageSizesWithCurrent(); track pageSize) {
            <hlm-select-item [value]="pageSize">{{ pageSize }}</hlm-select-item>
          }
        </hlm-select-group>
      </hlm-select-content>
    </hlm-select>
  `,
})
export class HlmNumberedPaginationQueryParams {
  /**
   * The current page, floored and clamped; corrections emit currentPageChange.
   * The parent owns reading/synchronizing the URL; corrections do not navigate.
   */
  public readonly currentPage = model.required<number>();

  /**
   * The number of items per paginated page. Non-finite/non-positive sizes
   * disable paging (one page) without rewriting this model.
   */
  public readonly itemsPerPage = model.required<number>();

  /**
   * The total number of items in the collection. Only useful when
   * doing server-side paging, where the collection size is limited
   * to a single page returned by the server API.
   */
  public readonly totalItems = input.required<number, NumberInput>({
    transform: numberAttribute,
  });

  /**
   * The URL path to use for the pagination links.
   * Defaults to '.' (current path).
   */
  public readonly link = input<string>('.');

  /**
   * Maximum window entries, including ellipses: floored and bounded to 1–100.
   * Non-finite/non-positive values use the default of 7.
   */
  public readonly maxSize = input<number, NumberInput>(7, {
    transform: numberAttribute,
  });

  /**
   * Show the first and last page buttons.
   */
  public readonly showEdges = input<boolean, BooleanInput>(true, {
    transform: booleanAttribute,
  });

  /**
   * The page sizes to show.
   * Defaults to [10, 20, 50, 100]
   */
  public readonly pageSizes = input<number[]>([10, 20, 50, 100]);

  protected readonly _pageSizesWithCurrent = computed(() => {
    const pageSizes = this.pageSizes();
    return pageSizes.includes(this.itemsPerPage())
      ? pageSizes // if current page size is included, return the same array
      : [...pageSizes, this.itemsPerPage()].sort((a, b) => a - b); // otherwise, add current page size and sort the array
  });

  protected readonly _currentPage = computed(() =>
    outOfBoundCorrection(this.totalItems(), this.itemsPerPage(), this.currentPage()),
  );
  protected readonly _isFirstPageActive = computed(() => this._currentPage() === 1);
  protected readonly _isLastPageActive = computed(() => this._currentPage() === this._lastPageNumber());
  protected readonly _lastPageNumber = computed(() => pageCount(this.totalItems(), this.itemsPerPage()));
  protected readonly _pages = computed(() =>
    createPageArray(this._currentPage(), this.itemsPerPage(), this.totalItems(), this.maxSize()),
  );

  constructor() {
    classes(() => 'tw:flex tw:items-center tw:justify-between tw:gap-2 tw:px-4 tw:py-2');
    effect(() => {
      const page = this._currentPage();
      if (page !== this.currentPage()) {
        untracked(() => this.currentPage.set(page));
      }
    });
  }
}
