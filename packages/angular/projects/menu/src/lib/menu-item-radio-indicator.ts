import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCircle } from '@ng-icons/lucide';
import { HlmIcon } from '@egose/shadcn-theme-ng/icon';
import { hlm } from '@egose/shadcn-theme-ng/utils';
import type { ClassValue } from 'clsx';

@Component({
  selector: 'hlm-menu-item-radio',
  providers: [provideIcons({ lucideCircle })],
  imports: [NgIcon, HlmIcon],
  template: `
    <!-- Using 0.5rem for size to mimick h-2 w-2 -->
    <ng-icon hlm size="0.5rem" class="tw:*:*:fill-current" name="lucideCircle" />
  `,
  host: {
    '[class]': '_computedClass()',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HlmMenuItemRadioIndicator {
  public readonly userClass = input<ClassValue>('', { alias: 'class' });
  protected readonly _computedClass = computed(() =>
    hlm(
      'tw:absolute tw:left-2 tw:flex tw:h-3.5 tw:w-3.5 tw:items-center tw:justify-center tw:opacity-0 tw:group-[.checked]:opacity-100',
      this.userClass(),
    ),
  );
}
