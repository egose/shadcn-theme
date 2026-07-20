import { Component } from '@angular/core';
import { EgFormTextInput } from '@egose/shadcn-theme-ng/form-text-input';

@Component({
  selector: 'app-form-text-input-page',
  imports: [EgFormTextInput],
  template: `
    <h3 class="tw:text-2xl tw:font-bold tw:mb-2">Form Text Input</h3>
    <p class="tw:text-gray-500 tw:mb-4">Text input wrapper with label, error, hint.</p>

    <div class="tw:w-[300px]">
      <eg-form-text-input
        label="Email"
        placeholder="email@example.com"
        hint="We'll never share your email."
        [required]="true"
      />
    </div>
  `,
})
export class FormTextInputPage {}
