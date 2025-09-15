import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { hlm } from '@egose/shadcn-theme-ng/utils';
import type { ClassValue } from 'clsx';

@Component({
  selector: 'hlm-radio-indicator',
  host: {
    '[class]': '_computedClass()',
  },
  template: ` <div class="tw:group-data-[checked=true]:bg-primary tw:size-2 tw:rounded-full tw:bg-transparent"></div> `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HlmRadioIndicator {
  public readonly userClass = input<ClassValue>('', { alias: 'class' });
  protected readonly _computedClass = computed(() =>
    hlm(
      'tw:border-input tw:text-primary tw:group-has-[:focus-visible]:border-ring tw:group-has-[:focus-visible]:ring-ring/50 tw:dark:bg-input/10 tw:shadow-xs tw:group-data=[disabled=true]:cursor-not-allowed tw:group-data=[disabled=true]:opacity-50 tw:relative tw:flex tw:aspect-square tw:size-4 tw:shrink-0 tw:items-center tw:justify-center tw:rounded-full tw:border tw:outline-none tw:transition-[color,box-shadow] tw:group-has-[:focus-visible]:ring-[3px]',
      this.userClass(),
    ),
  );
}
