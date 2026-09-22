import { Directive } from '@angular/core';
import { BrnDrawerTitle } from '@spartan-ng/brain/drawer';
import { classes } from '@egose/shadcn-theme-ng/utils';

@Directive({
  selector: '[hlmDrawerTitle]',
  hostDirectives: [BrnDrawerTitle],
  host: { 'data-slot': 'drawer-title' },
})
export class HlmDrawerTitle {
  constructor() {
    classes(() => 'tw:text-foreground tw:font-medium');
  }
}
