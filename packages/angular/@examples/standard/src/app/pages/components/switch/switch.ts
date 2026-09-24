import { Component, signal } from '@angular/core';
import { DemoHeaderComponent } from '../../../shared/demo-header';
import { DemoSectionComponent } from '../../../shared/demo-section';
import { HlmSwitch } from '@egose/shadcn-theme-ng/switch';

@Component({
  selector: 'app-switch-page',
  imports: [DemoHeaderComponent, DemoSectionComponent, HlmSwitch],
  template: `
    <app-demo-header title="Switch" description="A toggle switch with its text label programmatically bound." />

    <div class="tw:grid tw:gap-6 md:tw:grid-cols-2">
      <app-demo-section kicker="Default" title="With label" description="Basic switch bound via aria-labelledby.">
        <div class="tw:flex tw:items-center tw:gap-4">
          <hlm-switch inputId="switch-notifications" aria-labelledby="notifications-label" />
          <span id="notifications-label">Enable notifications</span>
        </div>
      </app-demo-section>

      <app-demo-section kicker="State" title="Checked" description="Pre-checked switch.">
        <div class="tw:flex tw:items-center tw:gap-4">
          <hlm-switch inputId="switch-checked" [checked]="true" aria-label="Airplane mode" />
          <span>Airplane mode is {{ checked() ? 'on' : 'off' }}</span>
        </div>
      </app-demo-section>

      <app-demo-section kicker="Size" title="Small" description="Compact density.">
        <div class="tw:flex tw:items-center tw:gap-4">
          <hlm-switch inputId="switch-sm" size="sm" aria-label="Compact mode" />
          <span>Compact mode</span>
        </div>
      </app-demo-section>

      <app-demo-section kicker="State" title="Disabled" description="Disabled on and off states.">
        <div class="tw:flex tw:items-center tw:gap-4">
          <hlm-switch inputId="switch-disabled-off" disabled aria-label="Disabled off" />
          <hlm-switch inputId="switch-disabled-on" disabled [checked]="true" aria-label="Disabled on" />
        </div>
      </app-demo-section>
    </div>
  `,
})
export class SwitchPage {
  readonly checked = signal(true);
}
