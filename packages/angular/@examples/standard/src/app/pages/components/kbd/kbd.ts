import { Component } from '@angular/core';
import { DemoHeaderComponent } from '../../../shared/demo-header';
import { DemoSectionComponent } from '../../../shared/demo-section';
import { HlmKbd, HlmKbdGroup } from '@egose/shadcn-theme-ng/kbd';

@Component({
  selector: 'app-kbd-page',
  imports: [DemoHeaderComponent, DemoSectionComponent, HlmKbd, HlmKbdGroup],
  template: `
    <app-demo-header title="Kbd" description="Keyboard shortcut display." />

    <div class="tw:grid tw:gap-6 md:tw:grid-cols-2">
      <app-demo-section kicker="Shortcut" title="Basic" description="Ctrl + K quick search.">
        <kbd hlmKbdGroup class="tw:gap-1">
          <kbd hlmKbd>Ctrl</kbd>
          <kbd hlmKbd>+</kbd>
          <kbd hlmKbd>K</kbd>
        </kbd>
      </app-demo-section>

      <app-demo-section kicker="Shortcut" title="Mac symbols" description="Command-shift variant.">
        <kbd hlmKbdGroup class="tw:gap-1">
          <kbd hlmKbd>⌘</kbd>
          <kbd hlmKbd>⇧</kbd>
          <kbd hlmKbd>P</kbd>
        </kbd>
      </app-demo-section>

      <app-demo-section kicker="Single key" title="Standalone" description="A single key hint.">
        <kbd hlmKbd>Esc</kbd>
      </app-demo-section>

      <app-demo-section kicker="Sequence" title="Navigation" description="Arrow-key navigation hint.">
        <kbd hlmKbdGroup class="tw:gap-1">
          <kbd hlmKbd>↑</kbd>
          <kbd hlmKbd>↓</kbd>
          <kbd hlmKbd>←</kbd>
          <kbd hlmKbd>→</kbd>
        </kbd>
      </app-demo-section>
    </div>
  `,
})
export class KbdPage {}
