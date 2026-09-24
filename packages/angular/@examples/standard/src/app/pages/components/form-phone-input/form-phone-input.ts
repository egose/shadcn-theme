import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EgFormPhoneInput } from '@egose/shadcn-theme-ng/form-phone-input';
import { DemoHeaderComponent } from '../../../shared/demo-header';

@Component({
  selector: 'app-form-phone-input-page',
  imports: [DemoHeaderComponent, ReactiveFormsModule, EgFormPhoneInput],
  template: `
    <app-demo-header
      title="Form Phone Input"
      description="Reactive-form masked phone wrapper that renders label, hint, and validation error."
    />

    <form class="tw:w-full tw:min-w-0 tw:max-w-full sm:tw:max-w-sm" [formGroup]="form">
      <eg-form-phone-input
        label="Callback number"
        hint="US format"
        controlName="phone"
        [required]="true"
        error="Enter a 10-digit number."
      />
      <p class="tw:text-sm">Digits: {{ form.value.phone ?? '—' }}</p>
    </form>
  `,
})
export class FormPhoneInputPage {
  readonly form = new FormGroup({
    phone: new FormControl<string | null>(null, [Validators.required, Validators.minLength(10)]),
  });
}
