import { Component } from '@angular/core';
import { DemoHeaderComponent } from '../../../shared/demo-header';
import { HlmSwitch } from '@egose/shadcn-theme-ng/switch';

@Component({
  selector: 'app-switch-page',
  imports: [DemoHeaderComponent, HlmSwitch],
  template: `
    <app-demo-header title="Switch" description="A toggle switch with its text label programmatically bound." />

    <div class="tw:flex tw:items-center tw:gap-4">
      <hlm-switch aria-labelledby="notifications-label" />
      <span id="notifications-label">Enable notifications</span>
    </div>
  `,
})
export class SwitchPage {}
