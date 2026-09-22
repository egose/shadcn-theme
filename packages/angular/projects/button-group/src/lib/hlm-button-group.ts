import { Directive, input } from '@angular/core';
import { classes } from '@egose/shadcn-theme-ng/utils';
import { cva } from 'class-variance-authority';

const buttonGroupVariants = cva(
  "tw:has-[>[data-slot=button-group]]:gap-2 tw:has-[select[aria-hidden=true]:last-child]:[&>[data-slot=select-trigger]:last-of-type]:rounded-r-lg tw:flex tw:w-fit tw:items-stretch tw:*:focus-visible:relative tw:*:focus-visible:z-10 tw:[&>[data-slot=select-trigger]:not([class*='w-'])]:w-fit tw:[&>input]:flex-1",
  {
    variants: {
      orientation: {
        horizontal:
          'tw:[&>[data-slot]:not(:has(~[data-slot]))]:rounded-r-lg! tw:[&>*:not(:first-child)]:rounded-l-none tw:[&>*:not(:first-child)]:border-l-0 tw:[&>*:not(:last-child)]:rounded-r-none',
        vertical:
          'tw:[&>[data-slot]:not(:has(~[data-slot]))]:rounded-b-lg! tw:flex-col tw:[&>*:not(:first-child)]:rounded-t-none tw:[&>*:not(:first-child)]:border-t-0 tw:[&>*:not(:last-child)]:rounded-b-none',
      },
    },
    defaultVariants: {
      orientation: 'horizontal',
    },
  },
);

@Directive({
  selector: '[hlmButtonGroup],hlm-button-group',
  host: {
    'data-slot': 'button-group',
    role: 'group',
    '[attr.data-orientation]': 'orientation()',
  },
})
export class HlmButtonGroup {
  constructor() {
    classes(() => buttonGroupVariants({ orientation: this.orientation() }));
  }

  public readonly orientation = input<'horizontal' | 'vertical'>('horizontal');
}
