import { Component } from '@angular/core';
import { HlmSeparator } from '@egose/shadcn-theme-ng/separator';

@Component({
  selector: 'app-separator-page',
  imports: [HlmSeparator],
  template: `
    <h3 class="tw:text-2xl tw:font-bold tw:mb-2">Separator</h3>
    <p class="tw:text-gray-500 tw:mb-4">A line to separate content.</p>
    <div class="tw:w-full">
      <div class="tw:text-sm tw:mb-2">Top content</div>
      <hlm-separator />
      <div class="tw:text-sm tw:mt-2">Bottom content</div>
    </div>

    <div class="tw:flex tw:items-center tw:gap-3 tw:mt-6">
      <span>A</span>
      <hlm-separator orientation="vertical" />
      <span>B</span>
      <hlm-separator orientation="vertical" />
      <span>C</span>
    </div>
  `,
})
export class SeparatorPage {}
