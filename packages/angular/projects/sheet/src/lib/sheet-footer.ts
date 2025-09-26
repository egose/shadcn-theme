import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { hlm } from '@egose/shadcn-theme-ng/utils';
import type { ClassValue } from 'clsx';

@Component({
  selector: 'hlm-sheet-footer',
  template: ` <ng-content /> `,
  host: {
    '[class]': '_computedClass()',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HlmSheetFooter {
  public readonly userClass = input<ClassValue>('', { alias: 'class' });
  protected _computedClass = computed(() => hlm('tw:mt-auto tw:flex tw:flex-col tw:gap-2 tw:p-4', this.userClass()));
}
