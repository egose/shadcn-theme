import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { hlm } from '@egose/shadcn-theme-ng/utils';
import { ClassValue } from 'clsx';

@Component({
  selector: 'hlm-menu-separator',
  template: '',
  host: {
    '[class]': '_computedClass()',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HlmMenuSeparator {
  public readonly userClass = input<ClassValue>('', { alias: 'class' });
  protected readonly _computedClass = computed(() =>
    hlm('tw:bg-border tw:-mx-1 tw:my-1 tw:block tw:h-px', this.userClass()),
  );
}
