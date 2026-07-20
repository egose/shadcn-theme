import { Component } from '@angular/core';
import { NgScrollbar } from 'ngx-scrollbar';
import { HlmScrollArea } from '@egose/shadcn-theme-ng/scroll-area';

@Component({
  selector: 'app-scroll-area-page',
  imports: [NgScrollbar, HlmScrollArea],
  template: `
    <h3 class="tw:text-2xl tw:font-bold tw:mb-2">Scroll Area</h3>
    <p class="tw:text-gray-500 tw:mb-4">Custom scrollbars.</p>

    <ng-scrollbar hlm class="tw:h-[200px] tw:w-[350px] tw:rounded-md tw:border tw:p-4">
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore
        magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
        consequat.
      </p>
      <p class="tw:mt-2">
        Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur
        sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
      </p>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore
        magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
        consequat.
      </p>
      <p class="tw:mt-2">
        Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur
        sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
      </p>
    </ng-scrollbar>
  `,
})
export class ScrollAreaPage {}
