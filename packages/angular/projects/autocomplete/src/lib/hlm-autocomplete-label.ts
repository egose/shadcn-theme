import { Directive } from '@angular/core';
import { BrnAutocompleteLabel } from '@spartan-ng/brain/autocomplete';
import { classes } from '@egose/shadcn-theme-ng/utils';

@Directive({
  selector: '[hlmAutocompleteLabel]',
  hostDirectives: [{ directive: BrnAutocompleteLabel, inputs: ['id'] }],
  host: { 'data-slot': 'autocomplete-label' },
})
export class HlmAutocompleteLabel {
  constructor() {
    classes(() => 'tw:text-muted-foreground tw:px-2 tw:py-1.5 tw:text-xs');
  }
}
