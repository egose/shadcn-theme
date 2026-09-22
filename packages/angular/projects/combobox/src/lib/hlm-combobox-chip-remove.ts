import { Directive } from '@angular/core';
import { BrnComboboxChipRemove } from '@spartan-ng/brain/combobox';
import { buttonVariants } from '@egose/shadcn-theme-ng/button';
import { classes } from '@egose/shadcn-theme-ng/utils';

@Directive({
  selector: 'button[hlmComboboxChipRemove]',
  hostDirectives: [BrnComboboxChipRemove],
  host: { 'data-slot': 'combobox-chip-remove' },
})
export class HlmComboboxChipRemove {
  constructor() {
    classes(() => [
      'tw:-ms-1 tw:opacity-50 tw:hover:opacity-100',
      buttonVariants({ variant: 'ghost', size: 'icon-xs' }),
    ]);
  }
}
