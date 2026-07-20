import { Component } from '@angular/core';
import { HlmCheckbox } from '@egose/shadcn-theme-ng/checkbox';

@Component({
  selector: 'app-checkbox-page',
  imports: [HlmCheckbox],
  template: `
    <h3 class="tw:text-2xl tw:font-bold tw:mb-2">Checkbox</h3>
    <p class="tw:text-gray-500 tw:mb-4">A control that allows the user to toggle between two states.</p>
    <div class="tw:flex tw:flex-col tw:gap-3">
      <label class="tw:flex tw:items-center tw:gap-2 tw:cursor-pointer">
        <hlm-checkbox />
        <span>Accept terms and conditions</span>
      </label>
      <label class="tw:flex tw:items-center tw:gap-2 tw:cursor-pointer">
        <hlm-checkbox disabled />
        <span>Disabled checkbox</span>
      </label>
    </div>
  `,
})
export class CheckboxPage {}
