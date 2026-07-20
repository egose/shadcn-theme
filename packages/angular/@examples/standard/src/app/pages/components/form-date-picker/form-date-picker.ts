import { Component } from '@angular/core';
import { EgFormDatePicker } from '@egose/shadcn-theme-ng/form-date-picker';

@Component({
  selector: 'app-form-date-picker-page',
  imports: [EgFormDatePicker],
  template: `
    <h3 class="tw:text-2xl tw:font-bold tw:mb-2">Form Date Picker</h3>
    <p class="tw:text-gray-500 tw:mb-4">Date picker with label, error, hint.</p>

    <div class="tw:w-[300px]">
      <eg-form-date-picker label="Birthdate" placeholder="Pick a date" hint="YYYY-MM-DD" [required]="true" />
    </div>
  `,
})
export class FormDatePickerPage {}
