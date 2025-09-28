import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { BrnMenuBar } from '@spartan-ng/brain/menu';
import { hlm } from '@egose/shadcn-theme-ng/utils';
import type { ClassValue } from 'clsx';

@Component({
  selector: 'hlm-menu-bar',
  host: {
    '[class]': '_computedClass()',
  },
  hostDirectives: [BrnMenuBar],
  template: '<ng-content/>',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HlmMenuBar {
  public readonly userClass = input<ClassValue>('', { alias: 'class' });
  protected _computedClass = computed(() =>
    hlm(
      'tw:bg-background tw:shadow-xs tw:flex tw:h-9 tw:items-center tw:gap-1 tw:rounded-md tw:border tw:p-1',
      this.userClass(),
    ),
  );
}
