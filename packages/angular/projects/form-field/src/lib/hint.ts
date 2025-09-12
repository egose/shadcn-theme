import { computed, Directive, input } from '@angular/core';
import { cn } from '@egose/shadcn-theme-ng/utils';
import { ClassValue } from 'clsx';

@Directive({
  selector: 'eg-hint',
  host: {
    '[class]': '_computedClass()',
  },
})
export class EgHint {
  public readonly userClass = input<ClassValue>('', { alias: 'class' });
  protected readonly _computedClass = computed(() =>
    cn('tw:text-muted-foreground tw:block tw:text-sm', this.userClass()),
  );
}
