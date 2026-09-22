import { Directive } from '@angular/core';
import { classes } from '@egose/shadcn-theme-ng/utils';

@Directive({
  selector: '[hlmDropdownMenuSeparator],hlm-dropdown-menu-separator',
  host: { 'data-slot': 'dropdown-menu-separator' },
})
export class HlmDropdownMenuSeparator {
  constructor() {
    classes(() => 'tw:bg-border tw:-mx-1 tw:my-1 tw:h-px tw:block');
  }
}
