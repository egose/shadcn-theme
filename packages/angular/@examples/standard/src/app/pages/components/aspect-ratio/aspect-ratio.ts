import { Component } from '@angular/core';
import { DemoHeaderComponent } from '../../../shared/demo-header';
import { DemoSectionComponent } from '../../../shared/demo-section';
import { HlmAspectRatio } from '@egose/shadcn-theme-ng/aspect-ratio';

@Component({
  selector: 'app-aspect-ratio-page',
  imports: [DemoHeaderComponent, DemoSectionComponent, HlmAspectRatio],
  template: `
    <app-demo-header title="Aspect Ratio" description="Maintain a fixed aspect ratio for media." />

    <div class="tw:grid tw:gap-6 md:tw:grid-cols-3">
      <app-demo-section kicker="16 / 9" title="Widescreen" description="Video-style ratio.">
        <div class="tw:w-full">
          <div hlmAspectRatio ratio="16/9" class="tw:overflow-hidden tw:rounded-md">
            <div class="tw:flex tw:h-full tw:w-full tw:items-center tw:justify-center tw:bg-blue-500 tw:text-white">
              16 / 9
            </div>
          </div>
        </div>
      </app-demo-section>

      <app-demo-section kicker="4 / 3" title="Standard" description="Classic photo ratio.">
        <div class="tw:w-full">
          <div hlmAspectRatio ratio="4/3" class="tw:overflow-hidden tw:rounded-md">
            <div class="tw:flex tw:h-full tw:w-full tw:items-center tw:justify-center tw:bg-emerald-500 tw:text-white">
              4 / 3
            </div>
          </div>
        </div>
      </app-demo-section>

      <app-demo-section kicker="1 / 1" title="Square" description="Avatar-style ratio.">
        <div class="tw:w-full">
          <div hlmAspectRatio ratio="1/1" class="tw:overflow-hidden tw:rounded-md">
            <div class="tw:flex tw:h-full tw:w-full tw:items-center tw:justify-center tw:bg-violet-500 tw:text-white">
              1 / 1
            </div>
          </div>
        </div>
      </app-demo-section>
    </div>
  `,
})
export class AspectRatioPage {}
