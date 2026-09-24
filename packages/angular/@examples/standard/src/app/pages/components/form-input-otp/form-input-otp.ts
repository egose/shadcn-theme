import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EgFormInputOtp } from '@egose/shadcn-theme-ng/form-input-otp';
import { DemoHeaderComponent } from '../../../shared/demo-header';

@Component({
  selector: 'app-form-input-otp-page',
  imports: [DemoHeaderComponent, ReactiveFormsModule, EgFormInputOtp],
  template: `
    <app-demo-header
      title="Form Input OTP"
      description="Reactive-form one-time-code wrapper that renders label, hint, and validation error."
    />

    <form class="tw:w-full tw:min-w-0 tw:max-w-full sm:tw:max-w-sm" [formGroup]="form">
      <eg-form-input-otp
        label="Verification code"
        hint="Six digits"
        controlName="code"
        [length]="6"
        [required]="true"
        error="Code is required."
      />
    </form>
  `,
})
export class FormInputOtpPage {
  readonly form = new FormGroup({
    code: new FormControl('', { nonNullable: true, validators: Validators.required }),
  });
}
