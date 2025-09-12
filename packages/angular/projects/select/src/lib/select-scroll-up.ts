import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronUp } from '@ng-icons/lucide';
import { EgIcon } from '@egose/shadcn-theme-ng/icon';
import { cn } from '@egose/shadcn-theme-ng/utils';
import { ClassValue } from 'clsx';

@Component({
  selector: 'eg-select-scroll-up',
  imports: [NgIcon, EgIcon],
  providers: [provideIcons({ lucideChevronUp })],
  host: {
    '[class]': '_computedClass()',
  },
  template: ` <ng-icon eg size="sm" class="tw:ml-2" name="lucideChevronUp" /> `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EgSelectScrollUp {
  public readonly userClass = input<ClassValue>('', { alias: 'class' });
  protected readonly _computedClass = computed(() =>
    cn('tw:flex tw:cursor-default tw:items-center tw:justify-center tw:py-1', this.userClass()),
  );
}
