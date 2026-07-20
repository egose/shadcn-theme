import { Component } from '@angular/core';
import { EgFormField } from '@egose/shadcn-theme-ng/form-field-simple';
import { HlmError, HlmHint } from '@egose/shadcn-theme-ng/form-field';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { HlmInput } from '@egose/shadcn-theme-ng/input';

@Component({
  selector: 'app-form-field-simple-page',
  imports: [EgFormField, HlmError, HlmHint, ReactiveFormsModule, HlmInput],
  template: `
    <h3 class="tw:text-2xl tw:font-bold tw:mb-2">Form Field (Simple)</h3>
    <p class="tw:text-gray-500 tw:mb-4">Reactive-form wrapper rendering label, error, or hint.</p>

    <form class="tw:w-[300px]" [formGroup]="form">
      <eg-form-field>
        <label class="tw:mb-1 tw:block tw:text-sm">Username</label>
        <input hlmInput formControlName="username" placeholder="Username" />
        <hlm-error>Username is required.</hlm-error>
        <hlm-hint>Pick a unique handle.</hlm-hint>
      </eg-form-field>
    </form>
  `,
})
export class FormFieldSimplePage {
  readonly form = new FormGroup({
    username: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  });
}
