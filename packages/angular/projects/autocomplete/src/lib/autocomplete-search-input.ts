import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { BrnAutocompleteSearchInput } from '@spartan-ng/brain/autocomplete';
import { hlm } from '@egose/shadcn-theme-ng/utils';
import type { ClassValue } from 'clsx';

@Component({
  selector: 'input[hlm-autocomplete-search-input]',
  template: '',
  hostDirectives: [{ directive: BrnAutocompleteSearchInput, inputs: ['value'] }],
  host: {
    '[class]': '_computedClass()',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HlmAutocompleteSearchInput {
  /** The user defined class  */
  public readonly userClass = input<ClassValue>('', { alias: 'class' });

  /** The styles to apply  */
  protected readonly _computedClass = computed(() =>
    hlm(
      'tw:placeholder:text-muted-foreground tw:flex tw:h-9 tw:w-full tw:bg-transparent tw:py-1 tw:text-base tw:outline-none tw:disabled:cursor-not-allowed tw:disabled:opacity-50 tw:md:text-sm',
      this.userClass(),
    ),
  );
}
