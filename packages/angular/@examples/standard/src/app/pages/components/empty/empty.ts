import { Component } from '@angular/core';
import { HlmEmptyImports } from '@egose/shadcn-theme-ng/empty';

@Component({
  selector: 'app-empty-page',
  imports: [HlmEmptyImports],
  template: `
    <h3 class="tw:text-2xl tw:font-bold tw:mb-2">Empty</h3>
    <p class="tw:text-gray-500 tw:mb-4">An empty-state container.</p>

    <div hlmEmpty class="tw:w-[300px] tw:rounded-md tw:border tw:p-6 tw:text-center">
      <div hlmEmptyMedia class="tw:mx-auto tw:mb-2 tw:text-4xl">📭</div>
      <h4 hlmEmptyTitle>No results</h4>
      <p hlmEmptyDescription>Try adjusting your search.</p>
    </div>
  `,
})
export class EmptyPage {}
