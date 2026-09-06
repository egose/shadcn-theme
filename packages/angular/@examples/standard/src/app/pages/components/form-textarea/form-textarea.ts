import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { EgFormTextarea } from '@egose/shadcn-theme-ng/form-textarea';
import { DemoHeaderComponent } from '../../../shared/demo-header';

@Component({
  selector: 'app-form-textarea-page',
  imports: [DemoHeaderComponent, ReactiveFormsModule, EgFormTextarea],
  template: `
    <app-demo-header
      title="Form Textarea"
      description="Reactive-form textarea wrapper that renders label, hint, and validation error around a textarea."
    />

    <form class="tw:w-full tw:max-w-md" [formGroup]="form">
      <eg-form-textarea
        label="Bio"
        placeholder="Tell us about yourself"
        hint="Markdown supported."
        controlName="bio"
        rows="4"
      />
    </form>
  `,
})
export class FormTextareaPage {
  readonly form = new FormGroup({
    bio: new FormControl('', { nonNullable: true }),
  });
}
