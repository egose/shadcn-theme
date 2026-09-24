import { Component, signal } from '@angular/core';
import { DemoHeaderComponent } from '../../../shared/demo-header';
import { DemoSectionComponent } from '../../../shared/demo-section';
import { HlmRadioGroup, HlmRadio, HlmRadioIndicator } from '@egose/shadcn-theme-ng/radio-group';

@Component({
  selector: 'app-radio-group-page',
  imports: [DemoHeaderComponent, DemoSectionComponent, HlmRadioGroup, HlmRadio, HlmRadioIndicator],
  template: `
    <app-demo-header title="Radio Group" description="A set of checkable buttons where only one can be selected." />

    <div class="tw:grid tw:gap-6 md:tw:grid-cols-2">
      <app-demo-section kicker="Default" title="Basic" description="Three options with one disabled.">
        <div hlmRadioGroup class="tw:flex tw:flex-col tw:gap-2" [value]="plan()" (valueChange)="plan.set($event)">
          <label class="tw:flex tw:items-center tw:gap-2">
            <hlm-radio value="starter"><hlm-radio-indicator /></hlm-radio>
            <span>Starter</span>
          </label>
          <label class="tw:flex tw:items-center tw:gap-2">
            <hlm-radio value="pro"><hlm-radio-indicator /></hlm-radio>
            <span>Pro</span>
          </label>
          <label class="tw:flex tw:items-center tw:gap-2">
            <hlm-radio value="enterprise" disabled><hlm-radio-indicator /></hlm-radio>
            <span>Enterprise (disabled)</span>
          </label>
        </div>
        <p role="status" class="tw:mt-3 tw:text-sm tw:text-slate-600">Selected plan: {{ plan() }}.</p>
      </app-demo-section>

      <app-demo-section kicker="Layout" title="Horizontal" description="Options in a row.">
        <div hlmRadioGroup value="opt1" class="tw:flex tw:items-center tw:gap-4">
          <label class="tw:flex tw:items-center tw:gap-2">
            <hlm-radio value="opt1"><hlm-radio-indicator /></hlm-radio>
            <span>Option 1</span>
          </label>
          <label class="tw:flex tw:items-center tw:gap-2">
            <hlm-radio value="opt2"><hlm-radio-indicator /></hlm-radio>
            <span>Option 2</span>
          </label>
        </div>
      </app-demo-section>
    </div>
  `,
})
export class RadioGroupPage {
  readonly plan = signal('starter');
}
