import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronDown } from '@ng-icons/lucide';
import { HlmIcon } from '@egose/shadcn-theme-ng/icon';
import { hlm } from '@egose/shadcn-theme-ng/utils';
import { ClassValue } from 'clsx';

@Component({
  selector: 'hlm-select-scroll-down',
  imports: [NgIcon, HlmIcon],
  providers: [provideIcons({ lucideChevronDown })],
  host: {
    '[class]': '_computedClass()',
  },
  template: ` <ng-icon hlm size="sm" class="tw:ml-2" name="lucideChevronDown" /> `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HlmSelectScrollDown {
  public readonly userClass = input<ClassValue>('', { alias: 'class' });
  protected readonly _computedClass = computed(() =>
    hlm('tw:flex cursor-default tw:items-center tw:justify-center tw:py-1', this.userClass()),
  );
}
