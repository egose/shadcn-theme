import { Component } from '@angular/core';
import { DemoHeaderComponent } from '../../../shared/demo-header';
import { HlmAspectRatio } from '@egose/shadcn-theme-ng/aspect-ratio';

@Component({
  selector: 'app-aspect-ratio-page',
  imports: [DemoHeaderComponent, HlmAspectRatio],
  template: `
    <app-demo-header title="Aspect Ratio" description="Maintain a fixed aspect ratio." />

    <div class="tw:w-full tw:max-w-sm">
      <div hlmAspectRatio ratio="16/9" class="tw:overflow-hidden tw:rounded-md">
        <div class="tw:flex tw:h-full tw:w-full tw:items-center tw:justify-center tw:bg-blue-500 tw:text-white">
          16 / 9
        </div>
      </div>
    </div>
  `,
})
export class AspectRatioPage {}
