import { Component } from '@angular/core';
import { DemoHeaderComponent } from '../../../shared/demo-header';
import { BrnSlider } from '@spartan-ng/brain/slider';
import { HlmSlider } from '@egose/shadcn-theme-ng/slider';

@Component({
  selector: 'app-slider-page',
  imports: [DemoHeaderComponent, BrnSlider, HlmSlider],
  template: `
    <app-demo-header title="Slider" description="A numeric range slider with its visible label bound to the thumb." />

    <div class="tw:grid tw:w-full tw:max-w-sm tw:gap-2">
      <label id="volume-label" class="tw:text-sm tw:font-medium tw:text-slate-700">Volume</label>
      <hlm-slider class="tw:w-full" aria-labelledby="volume-label" />
    </div>
  `,
})
export class SliderPage {}
