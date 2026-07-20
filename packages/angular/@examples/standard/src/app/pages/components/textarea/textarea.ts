import { Component } from '@angular/core';
import { HlmTextarea } from '@egose/shadcn-theme-ng/textarea';

@Component({
  selector: 'app-textarea-page',
  imports: [HlmTextarea],
  template: `
    <h3 class="tw:text-2xl tw:font-bold tw:mb-2">Textarea</h3>
    <p class="tw:text-gray-500 tw:mb-4">A multi-line text input.</p>
    <textarea hlmTextarea placeholder="Type your message here" class="tw:min-h-[120px]"></textarea>
  `,
})
export class TextareaPage {}
