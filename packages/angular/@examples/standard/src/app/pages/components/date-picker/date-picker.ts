import { Component } from '@angular/core';
import { DemoHeaderComponent } from '../../../shared/demo-header';
import { HlmDatePickerImports } from '@egose/shadcn-theme-ng/date-picker';

@Component({
  selector: 'app-date-picker-page',
  imports: [DemoHeaderComponent, HlmDatePickerImports],
  template: `
    <app-demo-header
      title="Date Picker"
      description="A text input with a calendar popover; committed dates are mirrored into the input field."
    />

    <div class="tw:grid tw:w-full tw:max-w-xs tw:gap-2">
      <label for="date-picker-input" class="tw:text-sm tw:font-medium tw:text-slate-700">Appointment date</label>
      <hlm-date-picker class="tw:w-full">
        <hlm-date-picker-input inputId="date-picker-input" placeholder="Pick a date" ariaLabel="Appointment date" />
      </hlm-date-picker>
    </div>
  `,
})
export class DatePickerPage {}
