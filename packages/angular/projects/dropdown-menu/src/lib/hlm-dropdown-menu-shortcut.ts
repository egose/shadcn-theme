import { Directive } from '@angular/core';
import { classes } from '@egose/shadcn-theme-ng/utils';

@Directive({
  selector: '[hlmDropdownMenuShortcut],hlm-dropdown-menu-shortcut',
  host: { 'data-slot': 'dropdown-menu-shortcut' },
})
export class HlmDropdownMenuShortcut {
  constructor() {
    classes(
      () =>
        'tw:text-muted-foreground tw:group-focus/dropdown-menu-item:text-accent-foreground tw:ml-auto tw:text-xs tw:tracking-widest',
    );
  }
}
