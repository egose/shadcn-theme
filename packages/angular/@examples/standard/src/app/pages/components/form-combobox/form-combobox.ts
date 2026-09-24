import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EgFormCombobox } from '@egose/shadcn-theme-ng/form-combobox';
import { DemoHeaderComponent } from '../../../shared/demo-header';

@Component({
  selector: 'app-form-combobox-page',
  imports: [DemoHeaderComponent, ReactiveFormsModule, EgFormCombobox],
  template: `
    <app-demo-header
      title="Form Combobox"
      description="Reactive-form multi-select combobox wrapper that renders label, hint, and validation error."
    />

    <form class="tw:w-full tw:min-w-0 tw:max-w-full sm:tw:max-w-sm" [formGroup]="form">
      <eg-form-combobox
        label="Tags"
        hint="Add tags"
        controlName="tags"
        [options]="tags"
        [required]="true"
        error="Pick at least one."
      />
    </form>
  `,
})
export class FormComboboxPage {
  readonly form = new FormGroup({
    tags: new FormControl<string[]>([], { nonNullable: true, validators: Validators.required }),
  });
  readonly tags = ['Angular', 'React', 'Vue'];
}
