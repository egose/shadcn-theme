import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BrnSlider, BrnSliderImports, injectBrnSlider } from '@spartan-ng/brain/slider';
import { classes } from '@egose/shadcn-theme-ng/utils';

@Component({
  selector: 'hlm-slider, brn-slider [hlm]',
  imports: [BrnSliderImports],
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [
    {
      directive: BrnSlider,
      inputs: [
        'id',
        'value',
        'disabled',
        'min',
        'max',
        'step',
        'minStepsBetweenThumbs',
        'inverted',
        'orientation',
        'showTicks',
        'maxTicks',
        'tickLabelInterval',
        'formatTick',
        'draggableRange',
        'draggableRangeOnly',
        'aria-label',
        'aria-labelledby',
      ],
      outputs: ['valueChange'],
    },
  ],
  template: `
    <div
      class="tw:relative tw:flex tw:w-full tw:items-center tw:group-data-[orientation=vertical]:w-auto tw:group-data-[orientation=vertical]:flex-col"
    >
      <div
        brnSliderTrack
        class="tw:bg-muted tw:rounded-full tw:data-[orientation=horizontal]:h-1.5 tw:data-[orientation=horizontal]:w-full tw:data-[orientation=vertical]:h-full tw:data-[orientation=vertical]:w-1.5 tw:relative tw:grow tw:overflow-hidden"
      >
        <div
          class="tw:bg-primary tw:absolute tw:select-none tw:data-draggable-range:cursor-move tw:data-[orientation=horizontal]:h-full tw:data-[orientation=vertical]:w-full"
          brnSliderRange
        ></div>
      </div>

      @for (i of _slider.thumbIndexes(); track i) {
        <span
          class="tw:border-primary tw:ring-ring/50 tw:size-4 tw:rounded-full tw:border tw:bg-white tw:shadow-sm tw:transition-[color,box-shadow] tw:hover:ring-4 tw:focus-visible:ring-4 tw:focus-visible:outline-hidden tw:absolute tw:block tw:shrink-0 tw:select-none tw:after:absolute tw:after:-inset-2"
          brnSliderThumb
        ></span>
      }
    </div>

    @if (_slider.showTicks()) {
      <div
        class="tw:px-2 tw:group-data-[orientation=vertical]:px-0 tw:group-data-[orientation=vertical]:py-2 tw:text-muted-foreground tw:mt-3 tw:flex tw:w-full tw:items-start tw:justify-between tw:gap-1 tw:text-xs tw:font-medium tw:group-data-[orientation=horizontal]:group-data-inverted:flex-row-reverse tw:group-data-[orientation=vertical]:ms-3 tw:group-data-[orientation=vertical]:mt-0 tw:group-data-[orientation=vertical]:w-auto tw:group-data-[orientation=vertical]:flex-col-reverse tw:group-data-[orientation=vertical]:group-data-inverted:flex-col"
      >
        <div
          *brnSliderTick="let tick; let formattedTick = formattedTick"
          class="tw:group tw:flex tw:w-0 tw:flex-col tw:items-center tw:justify-center tw:gap-2 tw:group-data-[orientation=vertical]:h-0 tw:group-data-[orientation=vertical]:w-auto tw:group-data-[orientation=vertical]:flex-row"
        >
          <div
            class="tw:bg-muted-foreground/70 tw:h-1 tw:w-px tw:group-data-[orientation=vertical]:h-px tw:group-data-[orientation=vertical]:w-1 tw:group-data-[orientation=horizontal]:group-data-[skip]:h-0.5 tw:group-data-[orientation=vertical]:group-data-[skip]:w-0.5"
          ></div>
          <div class="tw:text-center tw:group-data-[skip]:opacity-0">{{ formattedTick }}</div>
        </div>
      </div>
    }
  `,
})
export class HlmSlider {
  protected readonly _slider = injectBrnSlider();

  constructor() {
    classes(() => [
      'tw:group tw:flex tw:w-full tw:touch-none tw:flex-col tw:select-none tw:data-[orientation=vertical]:h-full tw:data-[orientation=vertical]:min-h-40 tw:data-[orientation=vertical]:w-auto tw:data-[orientation=vertical]:flex-row tw:data-[disabled]:pointer-events-none tw:data-[disabled]:opacity-50',
    ]);
  }
}
