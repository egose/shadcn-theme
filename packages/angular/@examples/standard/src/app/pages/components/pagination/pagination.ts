import { Component, signal } from '@angular/core';
import { DemoHeaderComponent } from '../../../shared/demo-header';
import { HlmPaginationImports } from '@egose/shadcn-theme-ng/pagination';

@Component({
  selector: 'app-pagination-page',
  imports: [DemoHeaderComponent, HlmPaginationImports],
  template: `
    <app-demo-header
      title="Pagination"
      description="Navigation between pages of content. The current page is announced with aria-current and mirrored below."
    />

    <nav hlmPagination aria-label="Invoice pages">
      <ul hlmPaginationContent>
        <li>
          <button hlmPaginationPrevious type="button" (click)="go(currentPage() - 1)" [disabled]="currentPage() === 1">
            Previous
          </button>
        </li>
        @for (page of pages; track page) {
          <li hlmPaginationItem>
            <button
              hlmPaginationLink
              type="button"
              (click)="go(page)"
              [attr.aria-current]="currentPage() === page ? 'page' : null"
            >
              {{ page }}
            </button>
          </li>
        }
        <li>
          <button
            hlmPaginationNext
            type="button"
            (click)="go(currentPage() + 1)"
            [disabled]="currentPage() === pages.length"
          >
            Next
          </button>
        </li>
      </ul>
    </nav>

    <p role="status" class="tw:mt-4 tw:text-sm tw:text-slate-600">
      Showing page {{ currentPage() }} of {{ pages.length }}.
    </p>
  `,
})
export class PaginationPage {
  readonly pages = [1, 2, 3];
  readonly currentPage = signal(1);

  go(page: number) {
    if (page >= 1 && page <= this.pages.length) {
      this.currentPage.set(page);
    }
  }
}
