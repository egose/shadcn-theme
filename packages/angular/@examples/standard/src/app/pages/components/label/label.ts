import { Component } from '@angular/core';
import { DemoHeaderComponent } from '../../../shared/demo-header';
import { DemoSectionComponent } from '../../../shared/demo-section';
import { HlmLabel } from '@egose/shadcn-theme-ng/label';
import { HlmCheckbox } from '@egose/shadcn-theme-ng/checkbox';
import { HlmSwitch } from '@egose/shadcn-theme-ng/switch';

@Component({
  selector: 'app-label-page',
  imports: [DemoHeaderComponent, DemoSectionComponent, HlmLabel, HlmCheckbox, HlmSwitch],
  template: `
    <app-demo-header title="Label" description="A label for form controls." />

    <div class="tw:grid tw:gap-6 md:tw:grid-cols-2">
      <app-demo-section kicker="Text input" title="Default" description="Label bound to a text input.">
        <div class="tw:grid tw:gap-2">
          <label hlmLabel for="label-username">Username</label>
          <input
            id="label-username"
            type="text"
            placeholder="jane.doe"
            class="tw:rounded-md tw:border tw:border-slate-300 tw:px-3 tw:py-2 tw:text-sm"
          />
        </div>
      </app-demo-section>

      <app-demo-section kicker="Checkbox" title="With checkbox" description="Label wrapping a checkbox.">
        <label class="tw:flex tw:cursor-pointer tw:items-center tw:gap-2">
          <hlm-checkbox aria-label="Accept terms" />
          <span hlmLabel>Accept terms and conditions</span>
        </label>
      </app-demo-section>

      <app-demo-section kicker="Switch" title="With switch" description="Label for a switch control.">
        <div class="tw:flex tw:items-center tw:gap-3">
          <hlm-switch inputId="label-notifications" aria-labelledby="label-notifications-text" />
          <span hlmLabel id="label-notifications-text" for="label-notifications">Enable notifications</span>
        </div>
      </app-demo-section>

      <app-demo-section kicker="State" title="Required" description="Label marking a required field.">
        <div class="tw:grid tw:gap-2">
          <label hlmLabel for="label-email">Email <span aria-hidden="true" class="tw:text-red-600">*</span></label>
          <input
            id="label-email"
            type="email"
            required
            placeholder="you@example.com"
            class="tw:rounded-md tw:border tw:border-slate-300 tw:px-3 tw:py-2 tw:text-sm"
          />
        </div>
      </app-demo-section>
    </div>
  `,
})
export class LabelPage {}
