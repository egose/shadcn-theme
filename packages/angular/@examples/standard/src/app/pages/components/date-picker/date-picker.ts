import { Component } from '@angular/core';
import { HlmDatePickerImports } from '@egose/shadcn-theme-ng/date-picker';

@Component({
  selector: 'app-date-picker-page',
  imports: [HlmDatePickerImports],
  template: `
    <h3 class="tw:text-2xl tw:font-bold tw:mb-2">Date Picker</h3>
    <p class="tw:text-gray-500 tw:mb-4">An input that opens a calendar.</p>

    <div class="tw:w-[280px]">
      <hlm-date-picker-input placeholder="Pick a date" />
    </div>
  `,
})
export class DatePickerPage {}
