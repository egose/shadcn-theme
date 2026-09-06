import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EgFormTextInput } from '@egose/shadcn-theme-ng/form-text-input';
import { DemoHeaderComponent } from '../../../shared/demo-header';

@Component({
  selector: 'app-form-text-input-page',
  imports: [DemoHeaderComponent, ReactiveFormsModule, EgFormTextInput],
  template: `
    <app-demo-header
      title="Form Text Input"
      description="Reactive-form text input wrapper that renders label, hint, and validation error around an input."
    />

    <form class="tw:w-full tw:max-w-sm" [formGroup]="form">
      <eg-form-text-input
        label="Email"
        placeholder="email@example.com"
        hint="We'll never share your email."
        controlName="email"
        [required]="true"
      />
    </form>
  `,
})
export class FormTextInputPage {
  readonly form = new FormGroup({
    email: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
  });
}
