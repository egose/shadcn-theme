import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EgFormDatePickerMulti } from '@egose/shadcn-theme-ng/form-date-picker-multi';
import { DemoHeaderComponent } from '../../../shared/demo-header';

@Component({
  selector: 'app-form-date-picker-multi-page',
  imports: [DemoHeaderComponent, ReactiveFormsModule, EgFormDatePickerMulti],
  template: `
    <app-demo-header
      title="Form Date Picker Multi"
      description="Reactive-form multi-date wrapper that renders label, hint, and validation error."
    />

    <form class="tw:w-full tw:min-w-0 tw:max-w-full sm:tw:max-w-sm" [formGroup]="form">
      <eg-form-date-picker-multi
        label="Holidays"
        placeholder="Pick dates"
        hint="Comma-separated days"
        controlName="holidays"
        [required]="true"
        error="Pick at least one day."
      />
    </form>
  `,
})
export class FormDatePickerMultiPage {
  readonly form = new FormGroup({
    holidays: new FormControl<Date[] | null>(null, Validators.required),
  });
}
