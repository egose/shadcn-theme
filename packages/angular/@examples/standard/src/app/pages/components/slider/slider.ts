import { Component, signal } from '@angular/core';
import { DemoHeaderComponent } from '../../../shared/demo-header';
import { DemoSectionComponent } from '../../../shared/demo-section';
import { BrnSlider } from '@spartan-ng/brain/slider';
import { HlmSlider } from '@egose/shadcn-theme-ng/slider';

@Component({
  selector: 'app-slider-page',
  imports: [DemoHeaderComponent, DemoSectionComponent, BrnSlider, HlmSlider],
  template: `
    <app-demo-header title="Slider" description="A numeric range slider with its visible label bound to the thumb." />

    <div class="tw:grid tw:gap-6 md:tw:grid-cols-2">
      <app-demo-section kicker="Single value" title="Default" description="Volume slider bound to a label.">
        <div class="tw:grid tw:w-full tw:max-w-sm tw:gap-2">
          <label id="volume-label" class="tw:text-sm tw:font-medium tw:text-slate-700">Volume</label>
          <hlm-slider class="tw:w-full" aria-labelledby="volume-label" [value]="[volume()]" />
          <p role="status" class="tw:text-sm tw:text-slate-600">Volume is {{ volume() }}.</p>
        </div>
      </app-demo-section>

      <app-demo-section kicker="Range" title="Two thumbs" description="Price range with minimum steps between thumbs.">
        <div class="tw:grid tw:w-full tw:max-w-sm tw:gap-2">
          <label id="slider-price-label" class="tw:text-sm tw:font-medium tw:text-slate-700">Price range</label>
          <hlm-slider
            class="tw:w-full"
            aria-labelledby="slider-price-label"
            [value]="[20, 80]"
            [min]="0"
            [max]="100"
            [minStepsBetweenThumbs]="5"
          />
        </div>
      </app-demo-section>

      <app-demo-section kicker="Ticks" title="With ticks" description="Labeled steps every 25 units.">
        <div class="tw:grid tw:w-full tw:max-w-sm tw:gap-2">
          <label id="slider-ticks-label" class="tw:text-sm tw:font-medium tw:text-slate-700">Brightness</label>
          <hlm-slider
            class="tw:w-full"
            aria-labelledby="slider-ticks-label"
            [value]="[50]"
            [showTicks]="true"
            [maxTicks]="5"
            [tickLabelInterval]="1"
          />
        </div>
      </app-demo-section>

      <app-demo-section kicker="State" title="Disabled" description="Non-interactive slider.">
        <div class="tw:grid tw:w-full tw:max-w-sm tw:gap-2">
          <label id="slider-disabled-label" class="tw:text-sm tw:font-medium tw:text-slate-700">Muted</label>
          <hlm-slider class="tw:w-full" aria-labelledby="slider-disabled-label" [value]="[30]" disabled />
        </div>
      </app-demo-section>
    </div>
  `,
})
export class SliderPage {
  readonly volume = signal(40);
}
