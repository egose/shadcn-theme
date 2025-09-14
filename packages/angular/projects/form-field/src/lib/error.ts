import { computed, Directive, input } from '@angular/core';
import { cn } from '@egose/shadcn-theme-ng/utils';
import { ClassValue } from 'clsx';

@Directive({
  selector: 'hlm-error',
  host: {
    '[class]': '_computedClass()',
  },
})
export class HlmError {
  public readonly userClass = input<ClassValue>('', { alias: 'class' });
  protected readonly _computedClass = computed(() =>
    cn('tw:text-destructive tw:block tw:text-sm tw:font-medium', this.userClass()),
  );
}
