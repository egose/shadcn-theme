import { ChangeDetectionStrategy, Component, computed, effect, inject, untracked } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideArrowRight } from '@ng-icons/lucide';
import { HlmBtn, provideBrnButtonConfig } from '@egose/shadcn-theme-ng/button';
import { hlm } from '@egose/shadcn-theme-ng/utils';
import { HlmCarousel } from './hlm-carousel';

@Component({
  selector: 'button[hlm-carousel-next], button[hlmCarouselNext]',
  imports: [NgIcon],
  providers: [provideIcons({ lucideArrowRight }), provideBrnButtonConfig({ variant: 'outline', size: 'icon-sm' })],
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [{ directive: HlmBtn, inputs: ['variant', 'size'] }],
  host: {
    'data-slot': 'carousel-next',
    '[disabled]': 'isDisabled()',
    '(click)': '_carousel.scrollNext()',
  },
  template: `
    <ng-icon name="lucideArrowRight" class="tw:rtl:rotate-180" />
    <span class="tw:sr-only">Next slide</span>
  `,
})
export class HlmCarouselNext {
  private readonly _button = inject(HlmBtn);
  protected readonly _carousel = inject(HlmCarousel);
  private readonly _computedClass = computed(() =>
    hlm(
      'tw:rounded-full tw:absolute tw:h-8 tw:w-8',
      this._carousel.orientation() === 'horizontal'
        ? 'tw:-end-12 tw:top-1/2 tw:-translate-y-1/2'
        : 'tw:-bottom-12 tw:left-1/2 tw:-translate-x-1/2 tw:rotate-90',
    ),
  );
  protected readonly isDisabled = () => !this._carousel.canScrollNext();

  constructor() {
    effect(() => {
      const computedClass = this._computedClass();

      untracked(() => this._button.setClass(computedClass));
    });
  }
}
