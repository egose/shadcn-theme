import { Component } from '@angular/core';
import { HlmRadioGroup, HlmRadio, HlmRadioIndicator } from '@egose/shadcn-theme-ng/radio-group';

@Component({
  selector: 'app-radio-group-page',
  imports: [HlmRadioGroup, HlmRadio, HlmRadioIndicator],
  template: `
    <h3 class="tw:text-2xl tw:font-bold tw:mb-2">Radio Group</h3>
    <p class="tw:text-gray-500 tw:mb-4">A set of checkable buttons.</p>
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
