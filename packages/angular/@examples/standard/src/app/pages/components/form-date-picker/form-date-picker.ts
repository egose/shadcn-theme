import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { EgFormDatePicker } from '@egose/shadcn-theme-ng/form-date-picker';
import { DemoHeaderComponent } from '../../../shared/demo-header';

@Component({
  selector: 'app-form-date-picker-page',
  imports: [DemoHeaderComponent, ReactiveFormsModule, EgFormDatePicker],
  template: `
    <app-demo-header
      title="Form Date Picker"
      description="Reactive-form date picker wrapper that renders label, hint, and validation error."
    />

    <form class="tw:w-full tw:max-w-sm" [formGroup]="form">
      <eg-form-date-picker
        label="Birthdate"
        placeholder="Pick a date"
        hint="YYYY-MM-DD"
        controlName="birthdate"
        [required]="true"
      />
    </form>
  `,
})
export class FormDatePickerPage {
  readonly form = new FormGroup({
    birthdate: new FormControl<Date | null>(null),
  });
}
