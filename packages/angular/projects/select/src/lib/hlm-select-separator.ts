import { Directive } from '@angular/core';
import { BrnSelectSeparator } from '@spartan-ng/brain/select';
import { classes } from '@egose/shadcn-theme-ng/utils';

@Directive({
  selector: '[hlmSelectSeparator],hlm-select-separator',
  hostDirectives: [{ directive: BrnSelectSeparator, inputs: ['orientation'] }],
  host: { 'data-slot': 'select-separator' },
})
export class HlmSelectSeparator {
  constructor() {
    classes(() => 'tw:bg-border tw:-mx-1 tw:my-1 tw:h-px tw:pointer-events-none');
  }
}
