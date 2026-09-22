import { Directive, input } from '@angular/core';
import { BrnTabsList } from '@spartan-ng/brain/tabs';
import { classes } from '@egose/shadcn-theme-ng/utils';
import { type VariantProps, cva } from 'class-variance-authority';

export const listVariants = cva(
  'tw:rounded-lg tw:p-[3px] tw:group-data-horizontal/tabs:h-9 tw:data-[variant=line]:rounded-none tw:group/tabs-list tw:text-muted-foreground tw:inline-flex tw:w-fit tw:items-center tw:justify-center tw:group-data-[orientation=vertical]/tabs:h-fit tw:group-data-[orientation=vertical]/tabs:flex-col',
  {
    variants: {
      variant: {
        default: 'tw:bg-muted',
        line: 'tw:gap-1 tw:bg-transparent',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);
type ListVariants = VariantProps<typeof listVariants>;

@Directive({
  selector: '[hlmTabsList],hlm-tabs-list',
  hostDirectives: [BrnTabsList],
  host: {
    'data-slot': 'tabs-list',
    '[attr.data-variant]': 'variant()',
  },
})
export class HlmTabsList {
  public readonly variant = input<ListVariants['variant']>('default');

  constructor() {
    classes(() => listVariants({ variant: this.variant() }));
  }
}
