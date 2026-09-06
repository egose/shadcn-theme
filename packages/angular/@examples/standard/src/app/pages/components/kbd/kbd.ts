import { Component } from '@angular/core';
import { DemoHeaderComponent } from '../../../shared/demo-header';
import { HlmKbd, HlmKbdGroup } from '@egose/shadcn-theme-ng/kbd';

@Component({
  selector: 'app-kbd-page',
  imports: [DemoHeaderComponent, HlmKbd, HlmKbdGroup],
  template: `
    <app-demo-header title="Kbd" description="Keyboard shortcut display." />
    <kbd hlmKbdGroup class="tw:gap-1">
      <kbd hlmKbd>Ctrl</kbd>
      <kbd hlmKbd>+</kbd>
      <kbd hlmKbd>K</kbd>
    </kbd>
  `,
})
export class KbdPage {}
