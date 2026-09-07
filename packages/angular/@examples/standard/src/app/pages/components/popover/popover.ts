import { Component } from '@angular/core';
import { DemoHeaderComponent } from '../../../shared/demo-header';
import { HlmPopover, HlmPopoverContent, HlmPopoverPortal, HlmPopoverTrigger } from '@egose/shadcn-theme-ng/popover';
import { HlmButton } from '@egose/shadcn-theme-ng/button';

@Component({
  selector: 'app-popover-page',
  imports: [DemoHeaderComponent, HlmPopover, HlmPopoverTrigger, HlmPopoverContent, HlmPopoverPortal, HlmButton],
  template: `
    <app-demo-header title="Popover" description="A floating content panel anchored to a trigger." />
    <div hlmPopover>
      <button hlmButton hlmPopoverTrigger type="button">Open popover</button>
      <div *hlmPopoverPortal hlmPopoverContent class="tw:w-64 tw:p-4">
        <p class="tw:text-sm">This is popover content. Click outside to close.</p>
      </div>
    </div>
  `,
})
export class PopoverPage {}
