import { Component } from '@angular/core';
import { DemoHeaderComponent } from '../../../shared/demo-header';
import { NgScrollbar } from 'ngx-scrollbar';
import { HlmScrollArea } from '@egose/shadcn-theme-ng/scroll-area';

@Component({
  selector: 'app-scroll-area-page',
  imports: [DemoHeaderComponent, NgScrollbar, HlmScrollArea],
  template: `
    <app-demo-header title="Scroll Area" description="Custom scrollbars." />

    <ng-scrollbar hlm class="tw:h-[200px] tw:w-full tw:max-w-sm tw:rounded-md tw:border tw:p-4">
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
