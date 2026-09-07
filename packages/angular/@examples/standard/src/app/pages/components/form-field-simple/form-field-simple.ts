import { Component } from '@angular/core';
import { DemoHeaderComponent } from '../../../shared/demo-header';
import { EgFormField } from '@egose/shadcn-theme-ng/form-field-simple';
import { HlmError, HlmHint } from '@egose/shadcn-theme-ng/form-field';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { HlmInput } from '@egose/shadcn-theme-ng/input';

@Component({
  selector: 'app-form-field-simple-page',
  imports: [DemoHeaderComponent, EgFormField, HlmError, HlmHint, ReactiveFormsModule, HlmInput],
  template: `
    <app-demo-header title="Form Field Simple" description="Reactive-form wrapper rendering label, error, or hint." />

    <form class="tw:w-full tw:max-w-sm" [formGroup]="form">
      <eg-form-field>
        <label class="tw:mb-1 tw:block tw:text-sm" for="simple-username">Username</label>
        <input hlmInput id="simple-username" formControlName="username" placeholder="Username" />
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
