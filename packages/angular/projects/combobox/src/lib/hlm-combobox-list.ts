import { Directive } from '@angular/core';
import { BrnComboboxList } from '@spartan-ng/brain/combobox';
import { classes } from '@egose/shadcn-theme-ng/utils';

@Directive({
  selector: '[hlmComboboxList]',
  hostDirectives: [{ directive: BrnComboboxList, inputs: ['id'] }],
  host: { 'data-slot': 'combobox-list' },
})
export class HlmComboboxList {
  constructor() {
    classes(
      () =>
        'no-scrollbar tw:max-h-[calc(--spacing(72)---spacing(9))] tw:scroll-py-1 tw:p-1 tw:data-empty:p-0 tw:overflow-y-auto tw:overscroll-contain',
    );
  }
}
