import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EgFormToggle } from '@egose/shadcn-theme-ng/form-toggle';
import { DemoHeaderComponent } from '../../../shared/demo-header';

@Component({
  selector: 'app-form-toggle-page',
  imports: [DemoHeaderComponent, ReactiveFormsModule, EgFormToggle],
  template: `
    <app-demo-header
      title="Form Toggle"
      description="Reactive-form toggle wrapper that renders label, hint, and validation error."
    />

    <form class="tw:w-full tw:min-w-0 tw:max-w-full sm:tw:max-w-sm" [formGroup]="form">
      <eg-form-toggle formControlName="bold" label="Bold" hint="Toggle rich-text formatting." />
      <eg-form-toggle
        formControlName="consent"
        label="I accept the terms"
        [required]="true"
        error="Consent is required."
      />
    </form>
  `,
})
export class FormTogglePage {
  readonly form = new FormGroup({
    bold: new FormControl(false),
    consent: new FormControl(false, Validators.requiredTrue),
  });
}
