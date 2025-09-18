import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { hlm } from '@egose/shadcn-theme-ng/utils';
import type { ClassValue } from 'clsx';

@Component({
  selector: 'hlm-dialog-header',
  template: ` <ng-content /> `,
  host: {
    '[class]': '_computedClass()',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HlmDialogHeader {
  public readonly userClass = input<ClassValue>('', { alias: 'class' });
  protected _computedClass = computed(() =>
    hlm('tw:flex tw:flex-col tw:gap-2 tw:text-center tw:sm:text-left', this.userClass()),
  );
}
