import { Directive } from '@angular/core';
import { BrnComboboxStatus } from '@spartan-ng/brain/combobox';
import { classes } from '@egose/shadcn-theme-ng/utils';

@Directive({
  selector: '[hlmComboboxStatus],hlm-combobox-status',
  hostDirectives: [BrnComboboxStatus],
  host: { 'data-slot': 'combobox-status' },
})
export class HlmComboboxStatus {
  constructor() {
    classes(
      () =>
        'tw:text-muted-foreground tw:gap-2 tw:px-3 tw:py-2 tw:text-sm tw:flex tw:w-full tw:items-center tw:justify-center tw:text-center',
    );
  }
}
