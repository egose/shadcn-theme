import { Directive, computed, input } from '@angular/core';
import { BrnMenuItemRadio } from '@spartan-ng/brain/menu';
import { hlm } from '@egose/shadcn-theme-ng/utils';
import type { ClassValue } from 'clsx';

@Directive({
  selector: '[hlmMenuItemRadio]',
  host: {
    '[class]': '_computedClass()',
  },
  hostDirectives: [
    {
      directive: BrnMenuItemRadio,
      inputs: ['disabled: disabled', 'checked: checked'],
      outputs: ['triggered: triggered'],
    },
  ],
})
export class HlmMenuItemRadio {
  public readonly userClass = input<ClassValue>('', { alias: 'class' });
  protected readonly _computedClass = computed(() =>
    hlm(
      'tw:hover:bg-secondary tw:hover:text-secondary-foreground tw:focus-visible:bg-secondary tw:focus-visible:text-secondary-foreground tw:group tw:relative tw:flex tw:w-full tw:cursor-default tw:select-none tw:items-center tw:rounded-sm tw:py-1.5 tw:pl-8 tw:pr-2 tw:text-sm tw:outline-none tw:transition-colors tw:disabled:pointer-events-none tw:disabled:opacity-50',
      this.userClass(),
    ),
  );
}
