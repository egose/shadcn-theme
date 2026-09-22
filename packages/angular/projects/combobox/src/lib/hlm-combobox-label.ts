import { Directive } from '@angular/core';
import { BrnComboboxLabel } from '@spartan-ng/brain/combobox';
import { classes } from '@egose/shadcn-theme-ng/utils';

@Directive({
  selector: '[hlmComboboxLabel]',
  hostDirectives: [{ directive: BrnComboboxLabel, inputs: ['id'] }],
  host: { 'data-slot': 'combobox-label' },
})
export class HlmComboboxLabel {
  constructor() {
    classes(() => 'tw:text-muted-foreground tw:px-2 tw:py-1.5 tw:text-xs');
  }
}
