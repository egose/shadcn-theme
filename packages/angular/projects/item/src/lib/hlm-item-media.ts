import { Directive, input } from '@angular/core';
import { classes } from '@egose/shadcn-theme-ng/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import { injectHlmItemMediaConfig } from './hlm-item-token';

const itemMediaVariants = cva(
  'tw:gap-2 tw:group-has-data-[slot=item-description]/item:translate-y-0.5 tw:group-has-data-[slot=item-description]/item:self-start tw:flex tw:shrink-0 tw:items-center tw:justify-center tw:[&_ng-icon]:pointer-events-none',
  {
    variants: {
      variant: {
        default: 'tw:bg-transparent',
        icon: "tw:[&_ng-icon:not([class*='text-'])]:text-[length:--spacing(4)]",
        image:
          'tw:size-10 tw:overflow-hidden tw:rounded-sm tw:group-data-[size=sm]/item:size-8 tw:group-data-[size=xs]/item:size-6 tw:[&_img]:size-full tw:[&_img]:object-cover',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);
export type ItemMediaVariants = VariantProps<typeof itemMediaVariants>;

@Directive({
  selector: '[hlmItemMedia],hlm-item-media',
  host: {
    'data-slot': 'item-media',
    '[attr.data-variant]': 'variant()',
  },
})
export class HlmItemMedia {
  private readonly _config = injectHlmItemMediaConfig();
  public readonly variant = input<ItemMediaVariants['variant']>(this._config.variant);

  constructor() {
    classes(() => itemMediaVariants({ variant: this.variant() }));
  }
}
