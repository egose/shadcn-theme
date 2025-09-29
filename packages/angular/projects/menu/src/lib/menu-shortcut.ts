import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { hlm } from '@egose/shadcn-theme-ng/utils';
import type { ClassValue } from 'clsx';

@Component({
  selector: 'hlm-menu-shortcut',
  template: ` <ng-content /> `,
  host: {
    '[class]': '_computedClass()',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HlmMenuShortcut {
  public readonly userClass = input<ClassValue>('', { alias: 'class' });
  protected _computedClass = computed(() =>
    hlm('tw:text-muted-foreground tw:ml-auto tw:text-xs tw:tracking-widest', this.userClass()),
  );
}
