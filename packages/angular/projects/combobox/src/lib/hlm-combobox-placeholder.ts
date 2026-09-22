import { Directive } from '@angular/core';
import { BrnComboboxPlaceholder } from '@spartan-ng/brain/combobox';
import { classes } from '@egose/shadcn-theme-ng/utils';

@Directive({
  selector: '[hlmComboboxPlaceholder],hlm-combobox-placeholder',
  hostDirectives: [BrnComboboxPlaceholder],
  host: { 'data-slot': 'combobox-placeholder' },
})
export class HlmComboboxPlaceholder {
  constructor() {
    classes(
      () =>
        "tw:gap-2 tw:[&_ng-icon:not([class*='text-'])]:text-[length:--spacing(4)] tw:flex tw:items-center tw:data-hidden:hidden tw:[&_ng-icon]:pointer-events-none tw:[&_ng-icon]:shrink-0",
    );
  }
}
