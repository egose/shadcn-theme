import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EgFormMonthYearPicker } from '@egose/shadcn-theme-ng/form-month-year-picker';
import { DemoHeaderComponent } from '../../../shared/demo-header';

@Component({
  selector: 'app-form-month-year-picker-page',
  imports: [DemoHeaderComponent, ReactiveFormsModule, EgFormMonthYearPicker],
  template: `
    <app-demo-header
      title="Form Month Year Picker"
      description="Reactive-form month/year wrapper that renders label, hint, and validation error."
    />

    <form class="tw:w-full tw:min-w-0 tw:max-w-full sm:tw:max-w-sm" [formGroup]="form">
      <eg-form-month-year-picker
        label="Start month"
        hint="MM/YYYY"
        controlName="start"
        [required]="true"
        error="Start month is required."
      />
    </form>
  `,
})
export class FormMonthYearPickerPage {
  readonly form = new FormGroup({
    start: new FormControl<Date | null>(null, Validators.required),
  });
}
