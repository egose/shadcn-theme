import { Component } from '@angular/core';
import { DemoHeaderComponent } from '../../../shared/demo-header';
import { HlmTooltip } from '@egose/shadcn-theme-ng/tooltip';
import { HlmButton } from '@egose/shadcn-theme-ng/button';

@Component({
  selector: 'app-tooltip-page',
  imports: [DemoHeaderComponent, HlmTooltip, HlmButton],
  template: `
    <app-demo-header title="Tooltip" description="Hover to reveal a tooltip." />
    <div class="tw:flex tw:items-center tw:gap-2">
      <button hlmButton hlmTooltip message="Add to library" variant="secondary" appearance="outline" type="button">
        Hover
      </button>
    </div>
  `,
})
export class TooltipPage {}
