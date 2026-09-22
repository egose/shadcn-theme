import { Directive } from '@angular/core';
import { BrnAutocompleteEmpty } from '@spartan-ng/brain/autocomplete';
import { classes } from '@egose/shadcn-theme-ng/utils';

@Directive({
  selector: '[hlmAutocompleteEmpty],hlm-autocomplete-empty',
  hostDirectives: [BrnAutocompleteEmpty],
  host: { 'data-slot': 'autocomplete-empty' },
})
export class HlmAutocompleteEmpty {
  constructor() {
    classes(
      () =>
        'tw:text-muted-foreground tw:hidden tw:w-full tw:items-center tw:justify-center tw:gap-2 tw:py-2 tw:text-center tw:text-sm tw:group-data-empty/autocomplete-content:flex',
    );
  }
}
