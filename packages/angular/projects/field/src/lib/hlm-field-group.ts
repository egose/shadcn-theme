import { Directive } from '@angular/core';
import { classes } from '@egose/shadcn-theme-ng/utils';

@Directive({
  selector: '[hlmFieldGroup],hlm-field-group',
  host: { 'data-slot': 'field-group' },
})
export class HlmFieldGroup {
  constructor() {
    classes(
      () =>
        'tw:gap-7 tw:data-[slot=checkbox-group]:gap-3 tw:*:data-[slot=field-group]:gap-4 tw:group/field-group tw:@container/field-group tw:flex tw:w-full tw:flex-col',
    );
  }
}
