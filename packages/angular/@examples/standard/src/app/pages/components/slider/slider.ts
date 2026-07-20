import { Component } from '@angular/core';
import { BrnSlider } from '@spartan-ng/brain/slider';
import { HlmSlider } from '@egose/shadcn-theme-ng/slider';

@Component({
  selector: 'app-slider-page',
  imports: [BrnSlider, HlmSlider],
  template: `
    <h3 class="tw:text-2xl tw:font-bold tw:mb-2">Slider</h3>
    <p class="tw:text-gray-500 tw:mb-4">A numeric range slider.</p>

    <hlm-slider class="tw:w-[300px]" />
  `,
})
export class SliderPage {}
