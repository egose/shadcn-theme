import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { BrnAutocompleteItem } from '@spartan-ng/brain/autocomplete';
import { hlm } from '@egose/shadcn-theme-ng/utils';

@Component({
  selector: 'button[hlm-autocomplete-item]',
  template: ` <ng-content /> `,
  hostDirectives: [
    {
      directive: BrnAutocompleteItem,
      inputs: ['value', 'disabled', 'id'],
      outputs: ['selected'],
    },
  ],
  host: {
    '[class]': '_computedClass()',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HlmAutocompleteItem {
  /** The user defined class  */
  public readonly userClass = input<string>('', { alias: 'class' });

  /** The styles to apply  */
  protected readonly _computedClass = computed(() =>
    hlm(
      'tw:data-[selected]:bg-accent tw:data-[selected]:text-accent-foreground tw:[&>ng-icon]:text-muted-foreground tw:outline-hidden tw:relative tw:flex tw:w-full tw:cursor-default tw:select-none tw:items-center tw:gap-2 tw:rounded-sm tw:px-2 tw:py-1.5 tw:text-sm tw:data-[disabled]:pointer-events-none tw:data-[hidden]:hidden tw:data-[disabled]:opacity-50 tw:[&>ng-icon]:pointer-events-none tw:[&>ng-icon]:shrink-0 tw:[&>ng-icon]:text-base',
      this.userClass(),
    ),
  );
}
