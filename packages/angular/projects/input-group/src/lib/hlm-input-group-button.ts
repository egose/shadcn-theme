import { Directive, input } from '@angular/core';
import { HlmBtn, provideBrnButtonConfig } from '@egose/shadcn-theme-ng/button';
import { classes } from '@egose/shadcn-theme-ng/utils';
import { cva, type VariantProps } from 'class-variance-authority';

const inputGroupAddonVariants = cva('tw:gap-2 tw:text-sm tw:flex tw:items-center tw:shadow-none', {
  variants: {
    size: {
      xs: "tw:h-6 tw:gap-1 tw:rounded-[calc(var(--radius)-5px)] tw:px-1.5 tw:[&>ng-icon:not([class*='text-'])]:text-[length:--spacing(3.5)]",
      sm: '',
      'icon-xs': 'tw:size-6 tw:rounded-[calc(var(--radius)-5px)] tw:p-0 tw:has-[>ng-icon]:p-0',
      'icon-sm': 'tw:size-8 tw:p-0 tw:has-[>ng-icon]:p-0',
    },
  },
  defaultVariants: {
    size: 'xs',
  },
});

type InputGroupAddonVariants = VariantProps<typeof inputGroupAddonVariants>;

@Directive({
  selector: 'button[hlmInputGroupButton]',
  providers: [
    provideBrnButtonConfig({
      variant: 'ghost',
    }),
  ],
  hostDirectives: [
    {
      directive: HlmBtn,
      inputs: ['variant'],
    },
  ],
  host: {
    '[attr.data-size]': 'size()',
    '[type]': 'type()',
  },
})
export class HlmInputGroupButton {
  public readonly size = input<InputGroupAddonVariants['size']>('xs');
  public readonly type = input<'button' | 'submit' | 'reset'>('button');

  constructor() {
    classes(() => inputGroupAddonVariants({ size: this.size() }));
  }
}
