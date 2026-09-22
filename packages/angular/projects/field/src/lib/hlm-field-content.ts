import { Directive } from '@angular/core';
import { classes } from '@egose/shadcn-theme-ng/utils';

@Directive({
  selector: '[hlmFieldContent],hlm-field-content',
  host: { 'data-slot': 'field-content' },
})
export class HlmFieldContent {
  constructor() {
    classes(() => 'tw:gap-1 tw:group/field-content tw:flex tw:flex-1 tw:flex-col tw:leading-snug');
  }
}
