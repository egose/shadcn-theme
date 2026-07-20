import { Component } from '@angular/core';
import { HlmInput } from '@egose/shadcn-theme-ng/input';

@Component({
  selector: 'app-input-page',
  imports: [HlmInput],
  template: `
    <h3 class="tw:text-2xl tw:font-bold tw:mb-2">Input</h3>
    <p class="tw:text-gray-500 tw:mb-4">A basic text field.</p>
    <div class="tw:flex tw:flex-col tw:gap-2 tw:max-w-md">
      <input hlmInput placeholder="Default input" />
      <input hlmInput type="email" placeholder="Email address" />
      <input hlmInput type="password" placeholder="Password" />
      <input hlmInput placeholder="Disabled input" disabled />
    </div>
  `,
})
export class InputPage {}
