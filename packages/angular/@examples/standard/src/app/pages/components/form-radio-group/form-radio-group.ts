import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EgFormRadioGroup } from '@egose/shadcn-theme-ng/form-radio-group';
import { DemoHeaderComponent } from '../../../shared/demo-header';

@Component({
  selector: 'app-form-radio-group-page',
  imports: [DemoHeaderComponent, ReactiveFormsModule, EgFormRadioGroup],
  template: `
    <app-demo-header
      title="Form Radio Group"
      description="Reactive-form radio group wrapper that renders label, hint, and validation error."
    />

    <form class="tw:w-full tw:min-w-0 tw:max-w-full sm:tw:max-w-sm" [formGroup]="form">
      <eg-form-radio-group
        label="Plan"
        hint="Pick one"
        controlName="plan"
        [options]="plans"
        [required]="true"
        error="Plan is required."
      />
    </form>
  `,
})
export class FormRadioGroupPage {
  readonly form = new FormGroup({
    plan: new FormControl('', { nonNullable: true, validators: Validators.required }),
  });
  readonly plans = [
    { value: 'starter', label: 'Starter' },
    { value: 'pro', label: 'Pro' },
  ];
}
