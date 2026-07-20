import { Component } from '@angular/core';
import { HlmToggle } from '@egose/shadcn-theme-ng/toggle';

@Component({
  selector: 'app-toggle-page',
  imports: [HlmToggle],
  template: `
    <h3 class="tw:text-2xl tw:font-bold tw:mb-2">Toggle</h3>
    <p class="tw:text-gray-500 tw:mb-4">A two-state button.</p>
    <div class="tw:flex tw:items-center tw:gap-4">
      <button hlmToggle>Default</button>
      <button hlmToggle disabled>Disabled</button>
    </div>
  `,
})
export class TogglePage {}
