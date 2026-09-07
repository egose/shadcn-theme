import { Component } from '@angular/core';
import { HlmSpinner } from '@egose/shadcn-theme-ng/spinner';
import { DemoHeaderComponent } from '../../../shared/demo-header';

@Component({
  selector: 'app-spinner',
  imports: [DemoHeaderComponent, HlmSpinner],
  template: `
    <app-demo-header title="Spinner" description="An animated loading indicator for short waits." />
    <div class="p-10"><hlm-spinner /></div>
  `,
})
export class SpinnerPage {}
