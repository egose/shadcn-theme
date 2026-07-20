import { Component } from '@angular/core';
import { HlmTooltip } from '@egose/shadcn-theme-ng/tooltip';
import { HlmButton } from '@egose/shadcn-theme-ng/button';

@Component({
  selector: 'app-tooltip-page',
  imports: [HlmTooltip, HlmButton],
  template: `
    <h3 class="tw:text-2xl tw:font-bold tw:mb-2">Tooltip</h3>
    <p class="tw:text-gray-500 tw:mb-4">Hover to reveal a tooltip.</p>
    <div class="tw:flex tw:items-center tw:gap-2">
      <button hlmButton hlmTooltip message="Add to library" variant="secondary" appearance="outline" type="button">
        Hover
      </button>
    </div>
  `,
})
export class TooltipPage {}
