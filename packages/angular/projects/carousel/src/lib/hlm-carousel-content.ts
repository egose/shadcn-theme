import { Directive, inject } from '@angular/core';
import { classes } from '@egose/shadcn-theme-ng/utils';
import { HlmCarousel } from './hlm-carousel';

@Directive({
  selector: '[hlmCarouselContent],hlm-carousel-content',
  host: {
    'data-slot': 'carousel-content',
  },
})
export class HlmCarouselContent {
  private readonly _orientation = inject(HlmCarousel).orientation;

  constructor() {
    classes(() => ['tw:flex', this._orientation() === 'horizontal' ? 'tw:-ml-4' : 'tw:-mt-4 tw:flex-col']);
  }
}
