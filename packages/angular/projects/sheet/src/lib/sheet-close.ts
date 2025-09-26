import { Directive, computed, input } from '@angular/core';
import { hlm } from '@egose/shadcn-theme-ng/utils';
import type { ClassValue } from 'clsx';

@Directive({
  selector: '[hlmSheetClose],[brnSheetClose][hlm]',
  host: {
    '[class]': '_computedClass()',
  },
})
export class HlmSheetClose {
  public readonly userClass = input<ClassValue>('', { alias: 'class' });
  protected readonly _computedClass = computed(() =>
    hlm(
      'tw:ring-offset-background tw:focus:ring-ring tw:data-[state=open]:bg-secondary tw:rounded-xs tw:focus:outline-hidden tw:absolute tw:right-4 tw:top-4 tw:opacity-70 tw:transition-opacity tw:hover:opacity-100 tw:focus:ring-2 tw:focus:ring-offset-2 tw:disabled:pointer-events-none',
      this.userClass(),
    ),
  );
}
