import { Directive, input } from '@angular/core';
import { BrnToggle } from '@spartan-ng/brain/toggle';
import { classes } from '@egose/shadcn-theme-ng/utils';
import { cva, type VariantProps } from 'class-variance-authority';

export const toggleVariants = cva(
  "tw:hover:text-foreground tw:aria-pressed:bg-muted tw:focus-visible:border-ring tw:focus-visible:ring-ring/50 tw:data-[matches-spartan-invalid=true]:ring-destructive/20 tw:dark:data-[matches-spartan-invalid=true]:ring-destructive/40 tw:data-[matches-spartan-invalid=true]:border-destructive tw:dark:data-[matches-spartan-invalid=true]:border-destructive/50 tw:gap-1 tw:rounded-md tw:text-sm tw:font-medium tw:transition-[color,box-shadow] tw:[&_ng-icon:not([class*='text-'])]:text-[length:--spacing(4)] tw:group/toggle tw:hover:bg-muted tw:inline-flex tw:items-center tw:justify-center tw:whitespace-nowrap tw:outline-none tw:focus-visible:ring-[3px] tw:disabled:pointer-events-none tw:disabled:opacity-50 tw:[&_ng-icon]:pointer-events-none tw:[&_ng-icon]:shrink-0",
  {
    variants: {
      variant: {
        default: 'tw:bg-transparent',
        outline: 'tw:border-input tw:hover:bg-muted tw:border tw:bg-transparent tw:shadow-xs',
      },
      size: {
        default: 'tw:h-9 tw:min-w-9 tw:px-2.5',
        sm: 'tw:h-8 tw:min-w-8 tw:px-2.5',
        lg: 'tw:h-10 tw:min-w-10 tw:px-2.5',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);
export type ToggleVariants = VariantProps<typeof toggleVariants>;

@Directive({
  selector: 'button[hlmToggle]',
  hostDirectives: [
    {
      directive: BrnToggle,
      inputs: ['id', 'value', 'disabled', 'state', 'aria-label', 'type'],
      outputs: ['stateChange'],
    },
  ],
  host: {
    'data-slot': 'toggle',
  },
})
export class HlmToggle {
  public readonly variant = input<ToggleVariants['variant']>('default');
  public readonly size = input<ToggleVariants['size']>('default');
  constructor() {
    classes(() =>
      toggleVariants({
        variant: this.variant(),
        size: this.size(),
      }),
    );
  }
}
