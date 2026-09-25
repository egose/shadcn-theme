import { Component, signal } from '@angular/core';
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

    <form class="tw:grid tw:w-full tw:max-w-sm tw:gap-3" [formGroup]="form" (ngSubmit)="onSubmit()">
      <eg-form-checkbox
        label="Accept terms and conditions"
        hint="Required to continue."
        controlName="agreed"
        [required]="true"
      />
      <button
        type="submit"
        class="tw:rounded-md tw:bg-primary tw:px-4 tw:py-2 tw:text-sm tw:font-medium tw:text-primary-foreground"
      >
        Continue
      </button>
      @if (submitted()) {
        <p class="tw:text-sm tw:text-muted-foreground">
          Submitted with {{ form.valid ? 'a valid' : 'an invalid' }} form (agreed: {{ form.value.agreed }}).
        </p>
      }
    </form>
  `,
})
export class FormCheckboxPage {
  readonly form = new FormGroup({
    agreed: new FormControl(false, { nonNullable: true, validators: [Validators.requiredTrue] }),
  });
  readonly submitted = signal(false);

  onSubmit(): void {
    this.submitted.set(true);
  }
}
