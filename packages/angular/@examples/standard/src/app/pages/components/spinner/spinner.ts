import { Component } from '@angular/core';
import { HlmSpinner } from '@egose/shadcn-theme-ng/spinner';
import { DemoHeaderComponent } from '../../../shared/demo-header';
import { DemoSectionComponent } from '../../../shared/demo-section';

@Component({
  selector: 'app-spinner',
  imports: [DemoHeaderComponent, DemoSectionComponent, HlmSpinner],
  template: `
    <app-demo-header title="Spinner" description="An animated loading indicator for short waits." />

    <div class="tw:grid tw:gap-6 md:tw:grid-cols-3">
      <app-demo-section kicker="Size" title="Default" description="Default loading spinner.">
        <div class="tw:p-4"><hlm-spinner /></div>
      </app-demo-section>

      <app-demo-section kicker="Size" title="Large" description="Scaled up via font-size.">
        <div class="tw:p-4 tw:text-2xl"><hlm-spinner /></div>
      </app-demo-section>

      <app-demo-section
        kicker="Accessibility"
        title="Custom label"
        description="Screen-reader label for the loading region."
      >
        <div class="tw:p-4"><hlm-spinner aria-label="Loading results" /></div>
      </app-demo-section>
    </div>
  `,
})
export class SpinnerPage {}
