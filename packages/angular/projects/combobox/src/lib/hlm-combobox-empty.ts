import { Directive } from '@angular/core';
import { BrnComboboxEmpty } from '@spartan-ng/brain/combobox';
import { classes } from '@egose/shadcn-theme-ng/utils';

@Directive({
  selector: '[hlmComboboxEmpty],hlm-combobox-empty',
  hostDirectives: [BrnComboboxEmpty],
  host: { 'data-slot': 'combobox-empty' },
})
export class HlmComboboxEmpty {
  constructor() {
    classes(
      () =>
        'tw:text-muted-foreground tw:hidden tw:w-full tw:items-center tw:justify-center tw:gap-2 tw:py-2 tw:text-center tw:text-sm tw:group-data-empty/combobox-content:flex',
    );
  }
}
