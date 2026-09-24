import { Component } from '@angular/core';
import { DemoHeaderComponent } from '../../../shared/demo-header';
import { DemoSectionComponent } from '../../../shared/demo-section';
import { HlmPopover, HlmPopoverContent, HlmPopoverPortal, HlmPopoverTrigger } from '@egose/shadcn-theme-ng/popover';
import { HlmButton } from '@egose/shadcn-theme-ng/button';

@Component({
  selector: 'app-popover-page',
  imports: [
    DemoHeaderComponent,
    DemoSectionComponent,
    HlmPopover,
    HlmPopoverTrigger,
    HlmPopoverContent,
    HlmPopoverPortal,
    HlmButton,
  ],
  template: `
    <app-demo-header title="Popover" description="A floating content panel anchored to a trigger." />

    <div class="tw:grid tw:gap-6 md:tw:grid-cols-2">
      <app-demo-section kicker="Default" title="Basic" description="Click to open, click outside to close.">
        <div hlmPopover>
          <button hlmButton hlmPopoverTrigger type="button">Open popover</button>
          <div *hlmPopoverPortal hlmPopoverContent class="tw:w-64 tw:p-4">
            <p class="tw:text-sm">This is popover content. Click outside to close.</p>
          </div>
        </div>
      </app-demo-section>

      <app-demo-section kicker="Content" title="With heading" description="Titled panel with description.">
        <div hlmPopover>
          <button hlmButton hlmPopoverTrigger variant="secondary" appearance="outline" type="button">
            Show details
          </button>
          <div *hlmPopoverPortal hlmPopoverContent class="tw:w-72 tw:p-4">
            <h4 class="tw:font-medium">Dimensions</h4>
            <p class="tw:mt-1 tw:text-sm tw:text-slate-600">Set width and height for the canvas.</p>
            <div class="tw:mt-3 tw:grid tw:grid-cols-2 tw:gap-2">
              <div class="tw:rounded-md tw:border tw:p-2 tw:text-sm">Width</div>
              <div class="tw:rounded-md tw:border tw:p-2 tw:text-sm">Height</div>
            </div>
          </div>
        </div>
      </app-demo-section>
    </div>
  `,
})
export class PopoverPage {}
