import { ChangeDetectionStrategy, Component, computed, effect, inject, untracked } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideArrowLeft } from '@ng-icons/lucide';
import { HlmBtn, provideBrnButtonConfig } from '@egose/shadcn-theme-ng/button';
import { hlm } from '@egose/shadcn-theme-ng/utils';
import { HlmCarousel } from './hlm-carousel';

@Component({
  selector: 'button[hlm-carousel-previous], button[hlmCarouselPrevious]',
  imports: [NgIcon],
  providers: [provideIcons({ lucideArrowLeft }), provideBrnButtonConfig({ variant: 'outline', size: 'icon-sm' })],
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [{ directive: HlmBtn, inputs: ['variant', 'size'] }],
  host: {
    'data-slot': 'carousel-previous',
    '[disabled]': 'isDisabled()',
    '(click)': '_carousel.scrollPrev()',
  },
  template: `
    <ng-icon name="lucideArrowLeft" class="tw:rtl:rotate-180" />
    <span class="tw:sr-only">Previous slide</span>
  `,
})
export class HlmCarouselPrevious {
  private readonly _button = inject(HlmBtn);

  protected readonly _carousel = inject(HlmCarousel);

  private readonly _computedClass = computed(() =>
    hlm(
      'tw:rounded-full tw:absolute tw:h-8 tw:w-8',
      this._carousel.orientation() === 'horizontal'
        ? 'tw:-start-12 tw:top-1/2 tw:-translate-y-1/2'
        : 'tw:-top-12 tw:left-1/2 tw:-translate-x-1/2 tw:rotate-90',
    ),
  );
  protected readonly isDisabled = () => !this._carousel.canScrollPrev();

  constructor() {
    effect(() => {
      const computedClass = this._computedClass();
      untracked(() => this._button.setClass(computedClass));
    });
  }
}
