import { Directive } from '@angular/core';
import { BrnAutocompleteSeparator } from '@spartan-ng/brain/autocomplete';
import { classes } from '@egose/shadcn-theme-ng/utils';

@Directive({
  selector: '[hlmAutocompleteSeparator]',
  hostDirectives: [{ directive: BrnAutocompleteSeparator, inputs: ['orientation'] }],
  host: { 'data-slot': 'autocomplete-separator' },
})
export class HlmAutocompleteSeparator {
  constructor() {
    classes(() => 'tw:bg-border tw:-mx-1 tw:my-1 tw:h-px');
  }
}
