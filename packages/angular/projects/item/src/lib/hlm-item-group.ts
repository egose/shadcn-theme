import { Directive } from '@angular/core';
import { classes } from '@egose/shadcn-theme-ng/utils';

@Directive({
  selector: '[hlmItemGroup],hlm-item-group',
  host: { 'data-slot': 'item-group' },
})
export class HlmItemGroup {
  constructor() {
    classes(
      () =>
        'tw:gap-4 tw:has-data-[size=sm]:gap-2.5 tw:has-data-[size=xs]:gap-2 tw:group/item-group tw:flex tw:w-full tw:flex-col',
    );
  }
}
