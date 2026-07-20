import { Component } from '@angular/core';
import { HlmPopover, HlmPopoverContent, HlmPopoverTrigger } from '@egose/shadcn-theme-ng/popover';
import { HlmButton } from '@egose/shadcn-theme-ng/button';

@Component({
  selector: 'app-popover-page',
  imports: [HlmPopover, HlmPopoverTrigger, HlmPopoverContent, HlmButton],
  template: `
    <h3 class="tw:text-2xl tw:font-bold tw:mb-2">Popover</h3>
    <p class="tw:text-gray-500 tw:mb-4">A floating content panel anchored to a trigger.</p>
    <div hlmPopover>
      <button hlmButton hlmPopoverTrigger type="button">Open popover</button>
      <div hlmPopoverContent class="tw:w-64 tw:p-4">
        <p class="tw:text-sm">This is popover content. Click outside to close.</p>
      </div>
    </div>
  `,
})
export class PopoverPage {}
