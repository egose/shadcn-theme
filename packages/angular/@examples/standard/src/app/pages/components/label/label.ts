import { Component } from '@angular/core';
import { HlmLabel } from '@egose/shadcn-theme-ng/label';

@Component({
  selector: 'app-label-page',
  imports: [HlmLabel],
  template: `
    <h3 class="tw:text-2xl tw:font-bold tw:mb-2">Label</h3>
    <p class="tw:text-gray-500 tw:mb-4">A label for form controls.</p>
    <label hlmLabel>Username</label>
  `,
})
export class LabelPage {}
