import { Component } from '@angular/core';
import { DemoHeaderComponent } from '../../../shared/demo-header';
import { DemoSectionComponent } from '../../../shared/demo-section';
import { HlmSeparator } from '@egose/shadcn-theme-ng/separator';

@Component({
  selector: 'app-separator-page',
  imports: [DemoHeaderComponent, DemoSectionComponent, HlmSeparator],
  template: `
    <app-demo-header title="Separator" description="A line to separate content, horizontally or vertically." />

    <div class="tw:grid tw:gap-6 md:tw:grid-cols-2">
      <app-demo-section kicker="Horizontal" title="Default" description="Separates stacked content.">
        <div class="tw:w-full">
          <div class="tw:mb-2 tw:text-sm">Top content</div>
          <hlm-separator />
          <div class="tw:mt-2 tw:text-sm">Bottom content</div>
        </div>
      </app-demo-section>

      <app-demo-section kicker="Vertical" title="Inline" description="Separates items in a row.">
        <div class="tw:flex tw:h-6 tw:items-center tw:gap-3">
          <span class="tw:text-sm">A</span>
          <hlm-separator orientation="vertical" />
          <span class="tw:text-sm">B</span>
          <hlm-separator orientation="vertical" />
          <span class="tw:text-sm">C</span>
        </div>
      </app-demo-section>

      <app-demo-section kicker="Spacing" title="With margins" description="Separator with vertical rhythm.">
        <div class="tw:w-full tw:max-w-sm">
          <p class="tw:text-sm tw:font-medium">Profile</p>
          <hlm-separator class="tw:my-4" />
          <p class="tw:text-sm tw:text-slate-600">Bio, links, and settings appear below the divider.</p>
        </div>
      </app-demo-section>
    </div>
  `,
})
export class SeparatorPage {}
