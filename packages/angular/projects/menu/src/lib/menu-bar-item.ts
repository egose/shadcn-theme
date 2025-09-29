import { Directive, computed, input } from '@angular/core';
import { BrnMenuItem } from '@spartan-ng/brain/menu';
import { hlm } from '@egose/shadcn-theme-ng/utils';
import type { ClassValue } from 'clsx';

@Directive({
  selector: '[hlmMenuBarItem]',
  host: {
    '[class]': '_computedClass()',
  },
  hostDirectives: [BrnMenuItem],
})
export class HlmMenuBarItem {
  public readonly userClass = input<ClassValue>('', { alias: 'class' });
  protected readonly _computedClass = computed(() =>
    hlm(
      'tw:focus:bg-secondary tw:focus:text-secondary-foreground tw:aria-expanded:bg-secondary tw:aria-expanded:text-secondary-foreground tw:flex tw:select-none tw:items-center tw:rounded-sm tw:px-2 tw:py-1 tw:text-sm tw:font-medium tw:outline-none',
      this.userClass(),
    ),
  );
}
