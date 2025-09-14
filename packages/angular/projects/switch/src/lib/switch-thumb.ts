import { Directive, computed, input } from '@angular/core';
import { cn } from '@egose/shadcn-theme-ng/utils';
import type { ClassValue } from 'clsx';

@Directive({
  selector: 'brn-switch-thumb[hlm],[hlmSwitchThumb]',
  host: {
    '[class]': '_computedClass()',
  },
})
export class HlmSwitchThumb {
  public readonly userClass = input<ClassValue>('', { alias: 'class' });

  protected readonly _computedClass = computed(() =>
    cn(
      'tw:bg-background tw:dark:group-data-[state=unchecked]:bg-foreground tw:dark:group-data-[state=checked]:bg-primary-foreground tw:pointer-events-none tw:block tw:size-4 tw:rounded-full tw:ring-0 tw:transition-transform tw:data-[state=unchecked]:translate-x-0 tw:group-data-[state=checked]:translate-x-[calc(100%-2px)]',
      this.userClass(),
    ),
  );
}
