import { Directive, effect, inject, input } from '@angular/core';
import { HlmBtn, provideBrnButtonConfig } from '@egose/shadcn-theme-ng/button';
import { hlm } from '@egose/shadcn-theme-ng/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import type { ClassValue } from 'clsx';

const inputGroupAddonVariants = cva('tw:gap-2 tw:text-sm tw:flex tw:items-center tw:shadow-none', {
  variants: {
    size: {
      xs: "tw:h-6 tw:gap-1 tw:rounded-[calc(var(--radius)-5px)] tw:px-1.5 tw:[&>ng-icon:not([class*='text-'])]:text-[length:--spacing(3.5)] tw:[&_svg:not([class*='size-'])]:size-3.5",
      sm: '',
      'icon-xs':
        "tw:size-6 tw:rounded-[calc(var(--radius)-5px)] tw:p-0 tw:has-[>ng-icon]:p-0 tw:[&>ng-icon:not([class*='text-'])]:text-[length:--spacing(3)] tw:[&_svg:not([class*='size-'])]:size-3",
      'icon-sm':
        "tw:size-8 tw:p-0 tw:has-[>ng-icon]:p-0 tw:[&>ng-icon:not([class*='text-'])]:text-[length:--spacing(4)] tw:[&_svg:not([class*='size-'])]:size-4",
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
  private readonly _btn = inject(HlmBtn);

  public readonly size = input<InputGroupAddonVariants['size']>('xs');
  public readonly type = input<'button' | 'submit' | 'reset'>('button');
  public readonly userClass = input<ClassValue>('', { alias: 'class' });

  constructor() {
    // HlmBtn renders its classes through a `[class]` host binding, so layering
    // another `classes()` call here would lose: the binding output is treated
    // as base classes and merged last, letting HlmBtn's default `h-9 px-4 py-2`
    // beat the input-group sizing and push the button onto the outer
    // container's borders. Route the variant through `setClass()` instead so it
    // wins over the button defaults while explicit `class` values still win.
    effect(() => {
      this._btn.setClass(hlm(inputGroupAddonVariants({ size: this.size() }), this.userClass()));
    });
  }
}
