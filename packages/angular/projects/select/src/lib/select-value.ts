import { Directive, computed, input } from '@angular/core';
import { cn } from '@egose/shadcn-theme-ng/utils';
import type { ClassValue } from 'clsx';

@Directive({
  selector: 'hlm-select-value,[hlmSelectValue], brn-select-value[hlm]',
  host: {
    '[class]': '_computedClass()',
  },
})
export class HlmSelectValue {
  public readonly userClass = input<ClassValue>('', { alias: 'class' });
  protected readonly _computedClass = computed(() =>
    cn(
      'tw:data-[placeholder]:text-muted-foreground tw:line-clamp-1 tw:flex tw:items-center tw:gap-2',
      this.userClass(),
    ),
  );
}
