import { Component } from '@angular/core';
import { DemoHeaderComponent } from '../../../shared/demo-header';
import { DemoSectionComponent } from '../../../shared/demo-section';
import { HlmCheckbox } from '@egose/shadcn-theme-ng/checkbox';

@Component({
  selector: 'app-checkbox-page',
  imports: [DemoHeaderComponent, DemoSectionComponent, HlmCheckbox],
  template: `
    <app-demo-header title="Checkbox" description="A control that allows the user to toggle between two states." />

    <div class="tw:grid tw:gap-6 md:tw:grid-cols-2">
      <app-demo-section kicker="Default" title="With label" description="Basic checkbox with text label.">
        <label class="tw:flex tw:cursor-pointer tw:items-center tw:gap-2">
          <hlm-checkbox aria-label="Accept terms and conditions" />
          <span>Accept terms and conditions</span>
        </label>
      </app-demo-section>

      <app-demo-section kicker="State" title="Checked" description="Pre-checked checkbox.">
        <label class="tw:flex tw:cursor-pointer tw:items-center tw:gap-2">
          <hlm-checkbox [checked]="true" aria-label="Subscribe to newsletter" />
          <span>Subscribe to newsletter</span>
        </label>
      </app-demo-section>

      <app-demo-section kicker="State" title="Indeterminate" description="Partial selection, e.g. select-all.">
        <label class="tw:flex tw:cursor-pointer tw:items-center tw:gap-2">
          <hlm-checkbox [checked]="'indeterminate'" aria-label="Select all messages" />
          <span>Select all (some selected)</span>
        </label>
      </app-demo-section>

      <app-demo-section kicker="State" title="Disabled" description="Disabled on and off states.">
        <div class="tw:flex tw:flex-col tw:gap-3">
          <label class="tw:flex tw:items-center tw:gap-2">
            <hlm-checkbox disabled aria-label="Disabled checkbox" />
            <span>Disabled checkbox</span>
          </label>
          <label class="tw:flex tw:items-center tw:gap-2">
            <hlm-checkbox disabled [checked]="true" aria-label="Disabled checked checkbox" />
            <span>Disabled checked</span>
          </label>
        </div>
      </app-demo-section>
    </div>
  `,
})
export class CheckboxPage {}
