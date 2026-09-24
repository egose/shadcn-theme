import { Component } from '@angular/core';
import { DemoHeaderComponent } from '../../../shared/demo-header';
import { DemoSectionComponent } from '../../../shared/demo-section';
import { HlmTooltip } from '@egose/shadcn-theme-ng/tooltip';
import { HlmButton } from '@egose/shadcn-theme-ng/button';

@Component({
  selector: 'app-tooltip-page',
  imports: [DemoHeaderComponent, DemoSectionComponent, HlmTooltip, HlmButton],
  template: `
    <app-demo-header title="Tooltip" description="Hover or focus to reveal a tooltip." />

    <div class="tw:grid tw:gap-6 md:tw:grid-cols-2">
      <app-demo-section kicker="Default" title="Basic" description="Tooltip on hover.">
        <button hlmButton hlmTooltip message="Add to library" variant="secondary" appearance="outline" type="button">
          Hover
        </button>
      </app-demo-section>

      <app-demo-section kicker="Position" title="Sides" description="Tooltips on all four sides.">
        <div class="tw:flex tw:flex-wrap tw:items-center tw:gap-2">
          <button
            hlmButton
            hlmTooltip
            message="On top"
            position="top"
            variant="secondary"
            appearance="outline"
            type="button"
          >
            Top
          </button>
          <button
            hlmButton
            hlmTooltip
            message="On right"
            position="right"
            variant="secondary"
            appearance="outline"
            type="button"
          >
            Right
          </button>
          <button
            hlmButton
            hlmTooltip
            message="On bottom"
            position="bottom"
            variant="secondary"
            appearance="outline"
            type="button"
          >
            Bottom
          </button>
          <button
            hlmButton
            hlmTooltip
            message="On left"
            position="left"
            variant="secondary"
            appearance="outline"
            type="button"
          >
            Left
          </button>
        </div>
      </app-demo-section>

      <app-demo-section kicker="Timing" title="Custom delay" description="Faster show delay.">
        <button
          hlmButton
          hlmTooltip
          message="Quick tooltip"
          [showDelay]="100"
          [hideDelay]="100"
          variant="secondary"
          appearance="outline"
          type="button"
        >
          Hover fast
        </button>
      </app-demo-section>
    </div>
  `,
})
export class TooltipPage {}
