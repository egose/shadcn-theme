import { Directive, computed, input } from '@angular/core';
import { cn } from '@egose/shadcn-theme-ng/utils';
import type { ClassValue } from 'clsx';

@Directive({
  selector: '[egAlertDesc],[egAlertDescription]',
  host: {
    '[class]': '_computedClass()',
  },
})
export class EgAlertDescription {
  public readonly userClass = input<ClassValue>('', { alias: 'class' });
  protected readonly _computedClass = computed(() =>
    cn(
      'tw:text-current tw:col-start-2 tw:grid tw:justify-items-start tw:gap-1 tw:text-sm tw:[&_p]:leading-relaxed',
      this.userClass(),
    ),
  );
}
