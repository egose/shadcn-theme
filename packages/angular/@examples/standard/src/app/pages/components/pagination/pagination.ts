import { Component } from '@angular/core';
import { HlmPaginationImports } from '@egose/shadcn-theme-ng/pagination';

@Component({
  selector: 'app-pagination-page',
  imports: [HlmPaginationImports],
  template: `
    <h3 class="tw:text-2xl tw:font-bold tw:mb-2">Pagination</h3>
    <p class="tw:text-gray-500 tw:mb-4">Navigation between pages of content.</p>

    <nav hlmPagination>
      <ul hlmPaginationContent>
        <li>
          <button hlmPaginationPrevious type="button">Previous</button>
        </li>
        <li hlmPaginationItem>
          <button hlmPaginationLink type="button" [attr.aria-current]="'page'">1</button>
        </li>
        <li hlmPaginationItem>
          <button hlmPaginationLink type="button">2</button>
        </li>
        <li hlmPaginationItem>
          <button hlmPaginationLink type="button">3</button>
        </li>
        <li>
          <button hlmPaginationNext type="button">Next</button>
        </li>
      </ul>
    </nav>
  `,
})
export class PaginationPage {}
