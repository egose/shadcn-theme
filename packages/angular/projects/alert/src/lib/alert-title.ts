import { Directive, computed, input } from '@angular/core';
import { cn } from '@egose/shadcn-theme-ng/utils';
import type { ClassValue } from 'clsx';

@Directive({
  selector: '[hlmAlertTitle]',
  host: {
    '[class]': '_computedClass()',
  },
})
export class HlmAlertTitle {
  public readonly userClass = input<ClassValue>('', { alias: 'class' });
  protected readonly _computedClass = computed(() =>
    cn('tw:col-start-2 tw:line-clamp-1 tw:min-h-4 tw:text-md tw:font-medium tw:tracking-tight', this.userClass()),
  );
}
