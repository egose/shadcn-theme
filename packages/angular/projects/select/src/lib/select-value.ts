import { Directive, computed, input } from '@angular/core';
import { cn } from '@egose/shadcn-theme-ng/utils';
import type { ClassValue } from 'clsx';

@Directive({
  selector: 'eg-select-value,[egSelectValue], brn-select-value[eg]',
  host: {
    '[class]': '_computedClass()',
  },
})
export class EgSelectValue {
  public readonly userClass = input<ClassValue>('', { alias: 'class' });
  protected readonly _computedClass = computed(() =>
    cn(
      'tw:data-[placeholder]:text-muted-foreground tw:line-clamp-1 tw:flex tw:items-center tw:gap-2',
      this.userClass(),
    ),
  );
}
