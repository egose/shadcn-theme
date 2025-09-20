import { Directive, computed, input } from '@angular/core';
import { hlm } from '@egose/shadcn-theme-ng/utils';
import type { ClassValue } from 'clsx';

@Directive({
  selector: '[hlmAutocompleteEmpty]',
  host: {
    '[class]': '_computedClass()',
  },
})
export class HlmAutocompleteEmpty {
  public readonly userClass = input<ClassValue>('', { alias: 'class' });
  protected readonly _computedClass = computed(() => hlm('tw:py-2 tw:text-center tw:text-sm', this.userClass()));
}
