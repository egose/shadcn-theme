import { Directive, computed, input } from '@angular/core';
import { cn } from '@egose/shadcn-theme-ng/utils';
import type { ClassValue } from 'clsx';

@Directive({
  selector: 'eg-select, brn-select [eg]',
  host: {
    '[class]': '_computedClass()',
  },
})
export class EgSelect {
  public readonly userClass = input<ClassValue>('', { alias: 'class' });
  protected readonly _computedClass = computed(() => cn('tw:space-y-2', this.userClass()));
}
