import { Component } from '@angular/core';
import { DemoHeaderComponent } from '../../../shared/demo-header';
import { DemoSectionComponent } from '../../../shared/demo-section';
import { BrnCollapsibleImports } from '@spartan-ng/brain/collapsible';
import { HlmCollapsibleImports } from '@egose/shadcn-theme-ng/collapsible';
import { HlmButton } from '@egose/shadcn-theme-ng/button';

@Component({
  selector: 'app-collapsible-page',
  imports: [DemoHeaderComponent, DemoSectionComponent, BrnCollapsibleImports, HlmCollapsibleImports, HlmButton],
  template: `
    <app-demo-header title="Collapsible" description="Toggle content visibility." />

    <div class="tw:grid tw:gap-6 md:tw:grid-cols-2">
      <app-demo-section kicker="Default" title="Basic" description="Toggle hidden content.">
        <div hlmCollapsible>
          <button hlmButton hlmCollapsibleTrigger variant="secondary" appearance="outline" type="button">Toggle</button>
          <div hlmCollapsibleContent class="tw:mt-2 tw:rounded-md tw:border tw:p-4">Hidden content revealed here.</div>
        </div>
      </app-demo-section>

      <app-demo-section kicker="State" title="Open by default" description="Starts expanded.">
        <div hlmCollapsible [expanded]="true">
          <button hlmButton hlmCollapsibleTrigger variant="secondary" appearance="outline" type="button">Toggle</button>
          <div hlmCollapsibleContent class="tw:mt-2 tw:rounded-md tw:border tw:p-4">This panel starts open.</div>
        </div>
      </app-demo-section>

      <app-demo-section kicker="State" title="Disabled" description="Trigger is non-interactive.">
        <div hlmCollapsible disabled>
          <button
            hlmButton
            hlmCollapsibleTrigger
            variant="secondary"
            appearance="outline"
            type="button"
            [disabled]="true"
          >
            Toggle
          </button>
          <div hlmCollapsibleContent class="tw:mt-2 tw:rounded-md tw:border tw:p-4">You cannot open this.</div>
        </div>
      </app-demo-section>
    </div>
  `,
})
export class CollapsiblePage {}
