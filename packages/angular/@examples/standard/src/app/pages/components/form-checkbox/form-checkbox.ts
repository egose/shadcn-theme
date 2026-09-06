import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EgFormCheckbox } from '@egose/shadcn-theme-ng/form-checkbox';
import { DemoHeaderComponent } from '../../../shared/demo-header';

@Component({
  selector: 'app-form-checkbox-page',
  imports: [DemoHeaderComponent, ReactiveFormsModule, EgFormCheckbox],
  template: `
    <app-demo-header
      title="Form Checkbox"
      description="Reactive-form checkbox wrapper that renders label, hint, and required-state error."
    />

    <form class="tw:w-full tw:max-w-sm" [formGroup]="form">
      <eg-form-checkbox
        label="Accept terms and conditions"
        hint="Required to continue."
        controlName="agreed"
        [required]="true"
      />
    </form>
  `,
})
export class FormCheckboxPage {
  readonly form = new FormGroup({
    agreed: new FormControl(false, { nonNullable: true, validators: [Validators.requiredTrue] }),
  });
}
