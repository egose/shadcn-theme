import { Directive, input } from '@angular/core';
import { classes } from '@egose/shadcn-theme-ng/utils';
import { cva, type VariantProps } from 'class-variance-authority';

const inputGroupAddonVariants = cva(
  "tw:text-muted-foreground tw:h-auto tw:gap-2 tw:py-1.5 tw:text-sm tw:font-medium tw:group-data-[disabled=true]/input-group:opacity-50 tw:[&>kbd]:rounded-[calc(var(--radius)-5px)] tw:[&>ng-icon:not([class*='text-'])]:text-[length:--spacing(4)] tw:flex tw:cursor-text tw:items-center tw:justify-center tw:select-none",
  {
    variants: {
      align: {
        'inline-start': 'tw:ps-2 tw:has-[>button]:-ms-1 tw:has-[>kbd]:ms-[-0.15rem] tw:order-first',
        'inline-end': 'tw:pe-2 tw:has-[>button]:-me-1 tw:has-[>kbd]:me-[-0.15rem] tw:order-last',
        'block-start':
          'tw:px-2.5 tw:pt-2 tw:group-has-[>input]/input-group:pt-2 tw:[.border-b]:pb-2 tw:order-first tw:w-full tw:justify-start',
        'block-end':
          'tw:px-2.5 tw:pb-2 tw:group-has-[>input]/input-group:pb-2 tw:[.border-t]:pt-2 tw:order-last tw:w-full tw:justify-start',
      },
    },
    defaultVariants: {
      align: 'inline-start',
    },
  },
);

type InputGroupAddonVariants = VariantProps<typeof inputGroupAddonVariants>;

@Directive({
  selector: '[hlmInputGroupAddon],hlm-input-group-addon',
  host: {
    role: 'group',
    'data-slot': 'input-group-addon',
    '[attr.data-align]': 'align()',
  },
})
export class HlmInputGroupAddon {
  public readonly align = input<InputGroupAddonVariants['align']>('inline-start');

  constructor() {
    classes(() => inputGroupAddonVariants({ align: this.align() }));
  }
}
