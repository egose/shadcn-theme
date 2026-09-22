import { Directive } from '@angular/core';
import { classes } from '@egose/shadcn-theme-ng/utils';

@Directive({
  selector: 'fieldset[hlmFieldSet]',
  host: { 'data-slot': 'field-set' },
})
export class HlmFieldSet {
  constructor() {
    classes(
      () =>
        'tw:gap-6 tw:has-[>[data-slot=checkbox-group]]:gap-3 tw:has-[>[data-slot=radio-group]]:gap-3 tw:flex tw:flex-col',
    );
  }
}
