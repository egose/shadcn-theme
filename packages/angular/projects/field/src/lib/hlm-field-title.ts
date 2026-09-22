import { Directive } from '@angular/core';
import { classes } from '@egose/shadcn-theme-ng/utils';

@Directive({
  selector: '[hlmFieldTitle],hlm-field-title',
  host: { 'data-slot': 'field-label' },
})
export class HlmFieldTitle {
  constructor() {
    classes(
      () =>
        'tw:gap-2 tw:text-sm tw:leading-snug tw:font-medium tw:group-data-[disabled=true]/field:opacity-50 tw:flex tw:w-fit tw:items-center',
    );
  }
}
