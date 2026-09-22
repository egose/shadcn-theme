import { Directive } from '@angular/core';
import { BrnComboboxSeparator } from '@spartan-ng/brain/combobox';
import { classes } from '@egose/shadcn-theme-ng/utils';

@Directive({
  selector: '[hlmComboboxSeparator]',
  hostDirectives: [{ directive: BrnComboboxSeparator, inputs: ['orientation'] }],
  host: { 'data-slot': 'combobox-separator' },
})
export class HlmComboboxSeparator {
  constructor() {
    classes(() => 'tw:bg-border tw:-mx-1 tw:my-1 tw:h-px');
  }
}
