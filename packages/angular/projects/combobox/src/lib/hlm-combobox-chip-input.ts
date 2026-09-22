import { Directive } from '@angular/core';
import { BrnComboboxChipInput } from '@spartan-ng/brain/combobox';
import { classes } from '@egose/shadcn-theme-ng/utils';

@Directive({
  selector: 'input[hlmComboboxChipInput]',
  hostDirectives: [{ directive: BrnComboboxChipInput, inputs: ['id', 'aria-invalid'] }],
  host: { 'data-slot': 'combobox-chip-input' },
})
export class HlmComboboxChipInput {
  constructor() {
    classes(() => 'tw:placeholder:text-muted-foreground tw:min-w-16 tw:flex-1 tw:outline-none');
  }
}
