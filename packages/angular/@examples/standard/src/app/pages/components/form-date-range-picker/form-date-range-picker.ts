import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EgFormDateRangePicker } from '@egose/shadcn-theme-ng/form-date-range-picker';
import { DemoHeaderComponent } from '../../../shared/demo-header';

@Component({
  selector: 'app-form-date-range-picker-page',
  imports: [DemoHeaderComponent, ReactiveFormsModule, EgFormDateRangePicker],
  template: `
    <app-demo-header
      title="Form Date Range Picker"
      description="Reactive-form date-range wrapper that renders label, hint, and validation error."
    />

    <form class="tw:w-full tw:min-w-0 tw:max-w-full sm:tw:max-w-sm" [formGroup]="form">
      <eg-form-date-range-picker
        label="Stay dates"
        placeholder="Pick a date range"
        hint="Pick check-in and check-out"
        controlName="stay"
        [required]="true"
        error="Stay dates are required."
      />
    </form>
  `,
})
export class FormDateRangePickerPage {
  readonly form = new FormGroup({
    stay: new FormControl<[Date, Date] | null>(null, Validators.required),
  });
}
