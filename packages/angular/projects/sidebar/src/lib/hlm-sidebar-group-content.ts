import { Directive } from '@angular/core';
import { classes } from '@egose/shadcn-theme-ng/utils';

@Directive({
  selector: 'div[hlmSidebarGroupContent]',
  host: {
    'data-slot': 'sidebar-group-content',
    'data-sidebar': 'group-content',
  },
})
export class HlmSidebarGroupContent {
  constructor() {
    classes(() => 'text-sm w-full');
  }
}
