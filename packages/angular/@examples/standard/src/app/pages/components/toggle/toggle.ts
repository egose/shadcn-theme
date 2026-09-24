import { Component, signal } from '@angular/core';
import { DemoHeaderComponent } from '../../../shared/demo-header';
import { DemoSectionComponent } from '../../../shared/demo-section';
import { HlmToggle } from '@egose/shadcn-theme-ng/toggle';

@Component({
  selector: 'app-toggle-page',
  imports: [DemoHeaderComponent, DemoSectionComponent, HlmToggle],
  template: `
    <app-demo-header
      title="Toggle"
      description="A two-state button. Activating it flips aria-pressed and reports the state below."
    />
    <div class="tw:grid tw:gap-6 md:tw:grid-cols-2">
      <app-demo-section kicker="Default" title="Basic" description="Toggle bold formatting on and off.">
        <div class="tw:flex tw:items-center tw:gap-4">
          <button hlmToggle type="button" [state]="bold() ? 'on' : 'off'" (stateChange)="bold.set($event === 'on')">
            Bold
          </button>
          <button hlmToggle type="button" disabled>Disabled</button>
        </div>
        <p role="status" class="tw:mt-4 tw:text-sm tw:text-slate-600">
          Bold formatting is {{ bold() ? 'on' : 'off' }}.
        </p>
      </app-demo-section>

      <app-demo-section kicker="Variant" title="Outline" description="Outlined style for bordered toolbars.">
        <div class="tw:flex tw:items-center tw:gap-2">
          <button hlmToggle type="button" variant="outline" aria-label="Toggle italic">Italic</button>
          <button hlmToggle type="button" variant="outline" aria-label="Toggle underline">Underline</button>
        </div>
      </app-demo-section>

      <app-demo-section kicker="Size" title="Small and large" description="Density options.">
        <div class="tw:flex tw:items-center tw:gap-2">
          <button hlmToggle type="button" size="sm" aria-label="Small toggle">Sm</button>
          <button hlmToggle type="button" size="lg" aria-label="Large toggle">Lg</button>
        </div>
      </app-demo-section>
    </div>
  `,
})
export class TogglePage {
  readonly bold = signal(false);
}
