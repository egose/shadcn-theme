import { Component } from '@angular/core';
import { EgFormTextarea } from '@egose/shadcn-theme-ng/form-textarea';

@Component({
  selector: 'app-form-textarea-page',
  imports: [EgFormTextarea],
  template: `
    <h3 class="tw:text-2xl tw:font-bold tw:mb-2">Form Textarea</h3>
    <p class="tw:text-gray-500 tw:mb-4">Textarea wrapper with label, error, hint.</p>

    <div class="tw:w-[300px]">
      <eg-form-textarea label="Bio" placeholder="Tell us about yourself" hint="Markdown supported." rows="4" />
    </div>
  `,
})
export class FormTextareaPage {}
