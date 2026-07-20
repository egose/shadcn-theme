import { Component } from '@angular/core';
import { HlmSwitch } from '@egose/shadcn-theme-ng/switch';

@Component({
  selector: 'app-switch-page',
  imports: [HlmSwitch],
  template: `
    <h3 class="tw:text-2xl tw:font-bold tw:mb-2">Switch</h3>
    <p class="tw:text-gray-500 tw:mb-4">A toggle switch.</p>
    <div class="tw:flex tw:items-center tw:gap-4">
      <hlm-switch />
      <span>Enable notifications</span>
    </div>
  `,
})
export class SwitchPage {}
