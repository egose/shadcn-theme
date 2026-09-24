import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EgFormNativeSelect } from '@egose/shadcn-theme-ng/form-native-select';
import { DemoHeaderComponent } from '../../../shared/demo-header';

@Component({
  selector: 'app-form-native-select-page',
  imports: [DemoHeaderComponent, ReactiveFormsModule, EgFormNativeSelect],
  template: `
    <app-demo-header
      title="Form Native Select"
      description="Reactive-form native select wrapper that renders label, hint, and validation error."
    />

    <form class="tw:w-full tw:min-w-0 tw:max-w-full sm:tw:max-w-sm" [formGroup]="form">
      <eg-form-native-select
        label="Country"
        hint="Choose one"
        controlName="country"
        [options]="countries"
        [required]="true"
        error="Country is required."
      />
    </form>
  `,
})
export class FormNativeSelectPage {
  readonly form = new FormGroup({
    country: new FormControl('', { nonNullable: true, validators: Validators.required }),
  });
  readonly countries = [
    { value: '', label: 'Select…' },
    { value: 'de', label: 'Germany' },
    { value: 'fr', label: 'France' },
  ];
}
