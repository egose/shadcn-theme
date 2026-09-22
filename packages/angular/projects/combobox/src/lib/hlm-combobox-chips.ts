import { BooleanInput } from '@angular/cdk/coercion';
import { booleanAttribute, computed, Directive, input } from '@angular/core';
import { BrnComboboxAnchor, BrnComboboxPopoverTrigger, injectBrnComboboxBase } from '@spartan-ng/brain/combobox';
import { classes } from '@egose/shadcn-theme-ng/utils';

@Directive({
  selector: '[hlmComboboxChips],hlm-combobox-chips',
  hostDirectives: [BrnComboboxAnchor, BrnComboboxPopoverTrigger],
  host: {
    'data-slot': 'combobox-chips',
    '[attr.data-matches-spartan-invalid]': '_spartanInvalid() ? "true" : null',
  },
})
export class HlmComboboxChips {
  private readonly _combobox = injectBrnComboboxBase();

  public readonly forceInvalid = input<boolean, BooleanInput>(false, { transform: booleanAttribute });

  protected readonly _spartanInvalid = computed(
    () => this.forceInvalid() || this._combobox.controlState?.()?.spartanInvalid,
  );

  constructor() {
    classes(
      () =>
        'tw:dark:bg-input/30 tw:border-input tw:focus-within:border-ring tw:focus-within:ring-ring/50 tw:data-[matches-spartan-invalid=true]:ring-destructive/20 tw:dark:data-[matches-spartan-invalid=true]:ring-destructive/40 tw:data-[matches-spartan-invalid=true]:border-destructive tw:dark:data-[matches-spartan-invalid=true]:border-destructive/50 tw:flex tw:min-h-9 tw:flex-wrap tw:items-center tw:gap-1.5 tw:rounded-md tw:border tw:bg-transparent tw:bg-clip-padding tw:px-2.5 tw:py-1.5 tw:text-sm tw:shadow-xs tw:transition-[color,box-shadow] tw:focus-within:ring-3 tw:has-data-[slot=combobox-chip]:px-1.5 tw:data-[matches-spartan-invalid=true]:ring-3',
    );
  }
}
