import { Component } from '@angular/core';
import { DemoHeaderComponent } from '../../../shared/demo-header';
import { HlmRadioGroup, HlmRadio, HlmRadioIndicator } from '@egose/shadcn-theme-ng/radio-group';

@Component({
  selector: 'app-radio-group-page',
  imports: [DemoHeaderComponent, HlmRadioGroup, HlmRadio, HlmRadioIndicator],
  template: `
    <app-demo-header title="Radio Group" description="A set of checkable buttons." />
    <div hlmRadioGroup class="tw:flex tw:flex-col tw:gap-2">
      <label class="tw:flex tw:items-center tw:gap-2">
        <hlm-radio value="opt1"><hlm-radio-indicator /></hlm-radio>
        <span>Option 1</span>
      </label>
      <label class="tw:flex tw:items-center tw:gap-2">
        <hlm-radio value="opt2"><hlm-radio-indicator /></hlm-radio>
        <span>Option 2</span>
      </label>
      <label class="tw:flex tw:items-center tw:gap-2">
        <hlm-radio value="opt3" disabled><hlm-radio-indicator /></hlm-radio>
        <span>Option 3 (disabled)</span>
      </label>
    </div>
  `,
})
export class RadioGroupPage {}
