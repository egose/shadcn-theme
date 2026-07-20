import { Component } from '@angular/core';
import { HlmCarouselImports } from '@egose/shadcn-theme-ng/carousel';

@Component({
  selector: 'app-carousel-page',
  imports: [HlmCarouselImports],
  template: `
    <h3 class="tw:text-2xl tw:font-bold tw:mb-2">Carousel</h3>
    <p class="tw:text-gray-500 tw:mb-4">A horizontal scrollable carousel.</p>

    <hlm-carousel class="tw:w-full tw:max-w-xs">
      <div hlmCarouselContent class="tw:relative tw:ml-4">
        @for (i of [0, 1, 2, 3, 4]; track i) {
          <div hlmCarouselItem class="tw:basis-1/2 tw:p-1">
            <div class="tw:flex tw:h-40 tw:items-center tw:justify-center tw:rounded-md tw:border tw:p-4">
              {{ i + 1 }}
            </div>
          </div>
        }
      </div>
      <div class="tw:flex tw:justify-end tw:gap-2">
        <button hlmCarouselPrevious type="button">Previous</button>
        <button hlmCarouselNext type="button">Next</button>
      </div>
    </hlm-carousel>
  `,
})
export class CarouselPage {}
