import type { BooleanInput, NumberInput } from '@angular/cdk/coercion';
import {
  ChangeDetectionStrategy,
  Component,
  booleanAttribute,
  computed,
  effect,
  input,
  model,
  numberAttribute,
  untracked,
} from '@angular/core';
import { HlmSelectImports } from '@egose/shadcn-theme-ng/select';
import { HlmPagination } from './hlm-pagination';
import { HlmPaginationContent } from './hlm-pagination-content';
import { HlmPaginationEllipsis } from './hlm-pagination-ellipsis';
import { HlmPaginationItem } from './hlm-pagination-item';
import { HlmPaginationLink } from './hlm-pagination-link';
import { HlmPaginationNext } from './hlm-pagination-next';
import { HlmPaginationPrevious } from './hlm-pagination-previous';
import { pageCount } from './pagination-state';

@Component({
  selector: 'hlm-numbered-pagination',
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
    <div class="tw:flex tw:items-center tw:justify-between tw:gap-2 tw:px-4 tw:py-2">
      <div class="tw:flex tw:items-center tw:gap-1 tw:text-sm tw:text-nowrap tw:text-gray-600">
        <b>{{ totalItems() }}</b>
        total items |
        <b>{{ _lastPageNumber() }}</b>
        pages
      </div>

      <nav hlmPagination>
        <ul hlmPaginationContent>
          @if (showEdges() && !_isFirstPageActive()) {
            <li hlmPaginationItem (click)="goToPrevious()">
              <hlm-pagination-previous />
            </li>
          }

          @for (page of _pages(); track $index) {
            <li hlmPaginationItem>
              @if (page === '...') {
                <hlm-pagination-ellipsis />
              } @else {
                <a hlmPaginationLink [isActive]="_currentPage() === page" (click)="currentPage.set(page)">
                  {{ page }}
                </a>
              }
            </li>
          }

          @if (showEdges() && !_isLastPageActive()) {
            <li hlmPaginationItem (click)="goToNext()">
              <hlm-pagination-next />
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
    </div>
  `,
})
export class HlmNumberedPagination {
  /**
   * The current (active) page, floored and clamped to the available range.
   * Corrections emit currentPageChange once; empty/invalid paging uses page 1.
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
    effect(() => {
      const page = this._currentPage();
      if (page !== this.currentPage()) {
        untracked(() => this.currentPage.set(page));
      }
    });
  }

  protected goToPrevious(): void {
    this.currentPage.set(Math.max(1, this._currentPage() - 1));
  }

  protected goToNext(): void {
    this.currentPage.set(Math.min(this._lastPageNumber(), this._currentPage() + 1));
  }

  protected goToFirst(): void {
    this.currentPage.set(1);
  }

  protected goToLast(): void {
    this.currentPage.set(this._lastPageNumber());
  }
}

type Page = number | '...';

/**
 * Checks that the instance.currentPage property is within bounds for the current page range.
 * If not, return a correct value for currentPage, or the current value if OK.
 *
 * Empty/invalid totals or sizes use page 1. Finite pages are floored;
 * non-finite pages use 1. Page counts saturate at Number.MAX_SAFE_INTEGER.
 */
export function outOfBoundCorrection(totalItems: number, itemsPerPage: number, currentPage: number): number {
  const page = Number.isFinite(currentPage) ? Math.floor(currentPage) : 1;
  return Math.max(1, Math.min(pageCount(totalItems, itemsPerPage), page));
}

/**
 * Returns an array of Page objects to use in the pagination controls.
 *
 * Window math adapted from 'ngx-pagination'. Range is floored and bounded to
 * 1–100 entries (including gaps); non-finite/non-positive ranges use 7.
 * Ranges below 5 show a contiguous window containing the active page.
 * Work and allocation are proportional to this bounded window, not total pages.
 */
export function createPageArray(
  currentPage: number,
  itemsPerPage: number,
  totalItems: number,
  paginationRange: number,
): Page[] {
  paginationRange =
    Number.isFinite(paginationRange) && paginationRange > 0
      ? Math.min(100, Math.max(1, Math.floor(paginationRange)))
      : 7;
  const pages: Page[] = [];

  const totalPages = pageCount(totalItems, itemsPerPage);
  currentPage = outOfBoundCorrection(totalItems, itemsPerPage, currentPage);
  if (paginationRange < 5) {
    const length = Math.min(totalPages, paginationRange);
    const start = Math.max(1, Math.min(currentPage - Math.floor(length / 2), totalPages - length + 1));
    return Array.from({ length }, (_, index) => start + index);
  }
  const halfWay = Math.ceil(paginationRange / 2);

  const isStart = currentPage <= halfWay;
  const isEnd = totalPages - halfWay < currentPage;
  const isMiddle = !isStart && !isEnd;

  const ellipsesNeeded = paginationRange < totalPages;
  let i = 1;

  while (i <= totalPages && i <= paginationRange) {
    let label: number | '...';
    const pageNumber = calculatePageNumber(i, currentPage, paginationRange, totalPages);
    const openingEllipsesNeeded = i === 2 && (isMiddle || isEnd);
    const closingEllipsesNeeded = i === paginationRange - 1 && (isMiddle || isStart);
    if (ellipsesNeeded && (openingEllipsesNeeded || closingEllipsesNeeded)) {
      label = '...';
    } else {
      label = pageNumber;
    }
    pages.push(label);
    i++;
  }

  return pages;
}

/**
 * Given the position in the sequence of pagination links [i],
 * figure out what page number corresponds to that position.
 *
 * Copied from 'ngx-pagination' package
 */
function calculatePageNumber(i: number, currentPage: number, paginationRange: number, totalPages: number) {
  const halfWay = Math.ceil(paginationRange / 2);
  if (i === paginationRange) {
    return totalPages;
  }

  if (i === 1) {
    return i;
  }

  if (paginationRange < totalPages) {
    if (totalPages - halfWay < currentPage) {
      return totalPages - paginationRange + i;
    }
    if (halfWay < currentPage) {
      return currentPage - halfWay + i;
    }
    return i;
  }

  return i;
}
