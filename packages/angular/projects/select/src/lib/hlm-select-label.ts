import { Directive } from '@angular/core';
import { BrnSelectLabel } from '@spartan-ng/brain/select';
import { classes } from '@egose/shadcn-theme-ng/utils';

@Directive({
  selector: '[hlmSelectLabel],hlm-select-label',
  hostDirectives: [{ directive: BrnSelectLabel, inputs: ['id'] }],
  host: { 'data-slot': 'select-label' },
})
export class HlmSelectLabel {
  constructor() {
    classes(() => 'tw:text-muted-foreground tw:px-2 tw:py-1.5 tw:text-xs tw:flex');
  }
}
