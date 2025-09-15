import { computed, Directive, input } from '@angular/core';
import { hlm } from '@egose/shadcn-theme-ng/utils';
import { ClassValue } from 'clsx';

@Directive({
  selector: 'hlm-hint',
  host: {
    '[class]': '_computedClass()',
  },
})
export class HlmHint {
  public readonly userClass = input<ClassValue>('', { alias: 'class' });
  protected readonly _computedClass = computed(() =>
    hlm('tw:text-muted-foreground tw:block tw:text-sm', this.userClass()),
  );
}
