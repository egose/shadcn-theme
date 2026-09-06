import { Component, signal } from '@angular/core';
import { DemoHeaderComponent } from '../../../shared/demo-header';
import { HlmToggle } from '@egose/shadcn-theme-ng/toggle';

@Component({
  selector: 'app-toggle-page',
  imports: [DemoHeaderComponent, HlmToggle],
  template: `
    <app-demo-header
      title="Toggle"
      description="A two-state button. Activating it flips aria-pressed and reports the state below."
    />
    <div class="tw:flex tw:items-center tw:gap-4">
      <button hlmToggle type="button" [state]="bold() ? 'on' : 'off'" (stateChange)="bold.set($event === 'on')">
        Bold
      </button>
      <button hlmToggle type="button" disabled>Disabled</button>
    </div>
    <p role="status" class="tw:mt-4 tw:text-sm tw:text-slate-600">Bold formatting is {{ bold() ? 'on' : 'off' }}.</p>
  `,
})
export class TogglePage {
  readonly bold = signal(false);
}
