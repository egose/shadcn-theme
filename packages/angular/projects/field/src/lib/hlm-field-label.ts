import { Directive } from '@angular/core';
import { HlmLabel } from '@egose/shadcn-theme-ng/label';
import { classes } from '@egose/shadcn-theme-ng/utils';

@Directive({
  selector: '[hlmFieldLabel],hlm-field-label',
  hostDirectives: [HlmLabel],
  host: { 'data-slot': 'field-label' },
})
export class HlmFieldLabel {
  constructor() {
    classes(() => [
      'tw:has-data-checked:bg-primary/5 tw:has-data-checked:border-primary/30 tw:dark:has-data-checked:border-primary/20 tw:dark:has-data-checked:bg-primary/10 tw:gap-2 tw:leading-snug tw:group-data-[disabled=true]/field:opacity-50 tw:has-[>[data-slot=field]]:rounded-md tw:has-[>[data-slot=field]]:border tw:*:data-[slot=field]:p-3 tw:group/field-label tw:peer/field-label tw:flex tw:w-fit',
      'tw:has-[>[data-slot=field]]:w-full tw:has-[>[data-slot=field]]:flex-col',
    ]);
  }
}
