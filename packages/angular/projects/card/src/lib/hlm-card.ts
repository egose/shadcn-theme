import { Directive, input } from '@angular/core';
import { classes } from '@egose/shadcn-theme-ng/utils';
import { HlmCardConfig, injectHlmCardConfig } from './hlm-card.token';

@Directive({
  selector: '[hlmCard],hlm-card',
  host: {
    'data-slot': 'card',
    '[attr.data-size]': 'size()',
  },
})
export class HlmCard {
  private readonly _defaultConfig = injectHlmCardConfig();
  public readonly size = input<HlmCardConfig['size']>(this._defaultConfig.size);

  constructor() {
    classes(
      () =>
        'tw:ring-foreground/10 tw:bg-card tw:text-card-foreground tw:gap-(--card-spacing) tw:overflow-hidden tw:rounded-xl tw:py-(--card-spacing) tw:text-sm tw:shadow-xs tw:ring-1 tw:[--card-spacing:--spacing(6)] tw:has-[>img:first-child]:pt-0 tw:data-[size=sm]:[--card-spacing:--spacing(4)] tw:*:[img:first-child]:rounded-t-xl tw:*:[img:last-child]:rounded-b-xl tw:group/card tw:flex tw:flex-col',
    );
  }
}
