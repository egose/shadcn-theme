import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronDown } from '@ng-icons/lucide';
import { EgIcon } from '@egose/shadcn-theme-ng/icon';
import { cn } from '@egose/shadcn-theme-ng/utils';
import { ClassValue } from 'clsx';

@Component({
  selector: 'eg-select-scroll-down',
  imports: [NgIcon, EgIcon],
  providers: [provideIcons({ lucideChevronDown })],
  host: {
    '[class]': '_computedClass()',
  },
  template: ` <ng-icon eg size="sm" class="tw:ml-2" name="lucideChevronDown" /> `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EgSelectScrollDown {
  public readonly userClass = input<ClassValue>('', { alias: 'class' });
  protected readonly _computedClass = computed(() =>
    cn('tw:flex cursor-default tw:items-center tw:justify-center tw:py-1', this.userClass()),
  );
}
