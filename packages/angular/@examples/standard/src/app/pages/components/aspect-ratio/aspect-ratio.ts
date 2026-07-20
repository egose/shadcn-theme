import { Component } from '@angular/core';
import { HlmAspectRatio } from '@egose/shadcn-theme-ng/aspect-ratio';

@Component({
  selector: 'app-aspect-ratio-page',
  imports: [HlmAspectRatio],
  template: `
    <h3 class="tw:text-2xl tw:font-bold tw:mb-2">Aspect Ratio</h3>
    <p class="tw:text-gray-500 tw:mb-4">Maintain a fixed aspect ratio.</p>

    <div class="tw:w-[300px]">
      <div hlmAspectRatio ratio="16/9" class="tw:overflow-hidden tw:rounded-md">
        <div class="tw:flex tw:h-full tw:w-full tw:items-center tw:justify-center tw:bg-blue-500 tw:text-white">
          16 / 9
        </div>
      </div>
    </div>
  `,
})
export class AspectRatioPage {}
