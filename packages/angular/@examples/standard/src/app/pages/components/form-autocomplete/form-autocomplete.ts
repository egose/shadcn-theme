import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EgFormAutocomplete } from '@egose/shadcn-theme-ng/form-autocomplete';
import { DemoHeaderComponent } from '../../../shared/demo-header';

@Component({
  selector: 'app-form-autocomplete-page',
  imports: [DemoHeaderComponent, ReactiveFormsModule, EgFormAutocomplete],
  template: `
    <app-demo-header
      title="Form Autocomplete"
      description="Reactive-form autocomplete wrapper that renders label, hint, and validation error."
    />

    <form class="tw:w-full tw:min-w-0 tw:max-w-full sm:tw:max-w-sm" [formGroup]="form">
      <eg-form-autocomplete
        label="Fruit"
        hint="Type a fruit"
        controlName="fruit"
        [options]="fruits"
        [required]="true"
        error="Fruit is required."
      />
    </form>
  `,
})
export class FormAutocompletePage {
  readonly form = new FormGroup({
    fruit: new FormControl('', { nonNullable: true, validators: Validators.required }),
  });
  readonly fruits = ['Apple', 'Banana', 'Cherry'];
}
