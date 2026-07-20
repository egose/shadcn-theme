import { Component } from '@angular/core';
import { HlmKbd, HlmKbdGroup } from '@egose/shadcn-theme-ng/kbd';

@Component({
  selector: 'app-kbd-page',
  imports: [HlmKbd, HlmKbdGroup],
  template: `
    <h3 class="tw:text-2xl tw:font-bold tw:mb-2">Kbd</h3>
    <p class="tw:text-gray-500 tw:mb-4">Keyboard shortcut display.</p>
    <kbd hlmKbdGroup class="tw:gap-1">
      <kbd hlmKbd>Ctrl</kbd>
      <kbd hlmKbd>+</kbd>
      <kbd hlmKbd>K</kbd>
    </kbd>
  `,
})
export class KbdPage {}
