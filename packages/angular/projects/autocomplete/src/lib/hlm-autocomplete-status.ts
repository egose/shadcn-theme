import { Directive } from '@angular/core';
import { BrnAutocompleteStatus } from '@spartan-ng/brain/autocomplete';
import { classes } from '@egose/shadcn-theme-ng/utils';

@Directive({
  selector: '[hlmAutocompleteStatus],hlm-autocomplete-status',
  hostDirectives: [BrnAutocompleteStatus],
  host: { 'data-slot': 'autocomplete-status' },
})
export class HlmAutocompleteStatus {
  constructor() {
    classes(
      () =>
        'tw:text-muted-foreground tw:gap-2 tw:px-3 tw:py-2 tw:text-sm tw:flex tw:w-full tw:items-center tw:justify-center tw:text-center',
    );
  }
}
