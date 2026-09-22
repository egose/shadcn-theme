import { Directive } from '@angular/core';
import { classes } from '@egose/shadcn-theme-ng/utils';

@Directive({
  selector: 'ul[hlmSidebarMenu]',
  host: {
    'data-slot': 'sidebar-menu',
    'data-sidebar': 'menu',
  },
})
export class HlmSidebarMenu {
  constructor() {
    classes(() => 'tw:gap-1 tw:flex tw:w-full tw:min-w-0 tw:flex-col');
  }
}
