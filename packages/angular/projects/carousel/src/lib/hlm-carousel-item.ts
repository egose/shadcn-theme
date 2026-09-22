import { Directive, inject } from '@angular/core';
import { classes } from '@egose/shadcn-theme-ng/utils';
import { HlmCarousel } from './hlm-carousel';

@Directive({
  selector: '[hlmCarouselItem],hlm-carousel-item',
  host: {
    'data-slot': 'carousel-item',
    role: 'group',
    'aria-roledescription': 'slide',
  },
})
export class HlmCarouselItem {
  private readonly _orientation = inject(HlmCarousel).orientation;

  constructor() {
    classes(() => [
      'tw:min-w-0 tw:shrink-0 tw:grow-0 tw:basis-full',
      this._orientation() === 'horizontal' ? 'tw:pl-4' : 'tw:pt-4',
    ]);
  }
}
