import { Directive, computed, input } from '@angular/core';
import { cn } from '@egose/shadcn-theme-ng/utils';
import type { ClassValue } from 'clsx';

@Directive({
  selector: 'hlm-select, brn-select [hlm]',
  host: {
    '[class]': '_computedClass()',
  },
})
export class HlmSelect {
  public readonly userClass = input<ClassValue>('', { alias: 'class' });
  protected readonly _computedClass = computed(() => cn('tw:space-y-2', this.userClass()));
}
