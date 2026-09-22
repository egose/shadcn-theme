import { Directive } from '@angular/core';
import { BrnAutocompleteList } from '@spartan-ng/brain/autocomplete';
import { classes } from '@egose/shadcn-theme-ng/utils';

@Directive({
  selector: '[hlmAutocompleteList]',
  hostDirectives: [{ directive: BrnAutocompleteList, inputs: ['id'] }],
  host: { 'data-slot': 'autocomplete-list' },
})
export class HlmAutocompleteList {
  constructor() {
    classes(
      () =>
        'no-scrollbar tw:max-h-[calc(--spacing(72)---spacing(9))] tw:scroll-py-1 tw:p-1 tw:data-empty:p-0 tw:overflow-y-auto tw:overscroll-contain',
    );
  }
}
