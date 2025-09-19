import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { provideHlmIconConfig } from '@egose/shadcn-theme-ng/icon';
import { hlm } from '@egose/shadcn-theme-ng/utils';
import type { ClassValue } from 'clsx';

@Component({
  selector: 'hlm-autocomplete-search',
  template: ` <ng-content /> `,
  host: {
    '[class]': '_computedClass()',
  },
  providers: [provideHlmIconConfig({ size: 'sm' })],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HlmAutocompleteSearch {
  /** The user defined class  */
  public readonly userClass = input<ClassValue>('', { alias: 'class' });

  /** The styles to apply  */
  protected readonly _computedClass = computed(() =>
    hlm(
      'tw:border-input tw:focus-within:border-ring tw:bg-background tw:focus-within:ring-ring/50 tw:shadow-xs tw:dark:bg-input/30 tw:flex tw:h-9 tw:min-w-0 tw:items-center tw:gap-2 tw:rounded-md tw:border tw:px-3 tw:focus-within:ring-[3px] tw:[&>_ng-icon]:flex-none tw:[&>_ng-icon]:opacity-50',
      this.userClass(),
    ),
  );
}
