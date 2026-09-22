import { Directive } from '@angular/core';
import { BrnNavigationMenuItem } from '@spartan-ng/brain/navigation-menu';
import { classes } from '@egose/shadcn-theme-ng/utils';

@Directive({
  selector: 'li[hlmNavigationMenuItem]',
  hostDirectives: [{ directive: BrnNavigationMenuItem, inputs: ['id'] }],
  host: {
    'data-slot': 'navigation-menu-item',
  },
})
export class HlmNavigationMenuItem {
  constructor() {
    classes(() => 'tw:relative tw:has-[:focus]:z-10 tw:data-active:z-10');
  }
}
