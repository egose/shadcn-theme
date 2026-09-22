import { Directive, input } from '@angular/core';
import { classes } from '@egose/shadcn-theme-ng/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import { injectHlmItemConfig } from './hlm-item-token';

const itemVariants = cva(
  'tw:[a]:hover:bg-muted tw:rounded-md tw:border tw:text-sm tw:group/item tw:focus-visible:border-ring tw:focus-visible:ring-ring/50 tw:flex tw:w-full tw:min-w-0 tw:max-w-full tw:flex-wrap tw:items-center tw:transition-colors tw:duration-100 tw:outline-none tw:focus-visible:ring-[3px] tw:[a]:transition-colors',
  {
    variants: {
      variant: {
        default: 'tw:border-transparent',
        outline: 'tw:border-border',
        muted: 'tw:bg-muted/50 tw:border-transparent',
      },
      size: {
        default: 'tw:gap-3.5 tw:px-4 tw:py-3.5',
        sm: 'tw:gap-2.5 tw:px-3 tw:py-2.5',
        xs: 'tw:gap-2 tw:px-2.5 tw:py-2 tw:in-data-[slot=dropdown-menu-content]:p-0',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export type ItemVariants = VariantProps<typeof itemVariants>;

@Directive({
  selector: '[hlmItem],hlm-item',
  host: {
    'data-slot': 'item',
    '[attr.data-variant]': 'variant()',
    '[attr.data-size]': 'size()',
  },
})
export class HlmItem {
  private readonly _config = injectHlmItemConfig();
  public readonly variant = input<ItemVariants['variant']>(this._config.variant);
  public readonly size = input<ItemVariants['size']>(this._config.size);

  constructor() {
    classes(() => itemVariants({ variant: this.variant(), size: this.size() }));
  }
}
