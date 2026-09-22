import { Directive, input } from '@angular/core';
import { classes } from '@egose/shadcn-theme-ng/utils';
import { cva, VariantProps } from 'class-variance-authority';

const emptyMediaVariants = cva(
  'tw:mb-2 tw:flex tw:shrink-0 tw:items-center tw:justify-center tw:[&_ng-icon]:pointer-events-none tw:[&_ng-icon]:shrink-0',
  {
    variants: {
      variant: {
        default: 'tw:bg-transparent',
        icon: "tw:bg-muted tw:text-foreground tw:flex tw:size-10 tw:shrink-0 tw:items-center tw:justify-center tw:rounded-lg tw:[&_ng-icon:not([class*='text-'])]:text-[length:--spacing(6)]",
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

export type EmptyMediaVariants = VariantProps<typeof emptyMediaVariants>;

@Directive({
  selector: '[hlmEmptyMedia],hlm-empty-media',
  host: {
    'data-slot': 'empty-media',
    '[attr.data-variant]': 'variant()',
  },
})
export class HlmEmptyMedia {
  public readonly variant = input<EmptyMediaVariants['variant']>();

  constructor() {
    classes(() => emptyMediaVariants({ variant: this.variant() }));
  }
}
