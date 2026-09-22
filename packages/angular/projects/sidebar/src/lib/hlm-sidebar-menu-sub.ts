import { Directive } from '@angular/core';
import { classes } from '@egose/shadcn-theme-ng/utils';

@Directive({
  selector: 'ul[hlmSidebarMenuSub]',
  host: {
    'data-slot': 'sidebar-menu-sub',
    'data-sidebar': 'menu-sub',
  },
})
export class HlmSidebarMenuSub {
  constructor() {
    classes(
      () =>
        'tw:border-sidebar-border tw:mx-3.5 tw:translate-x-px tw:gap-1 tw:border-s tw:px-2.5 tw:py-0.5 tw:group-data-[collapsible=icon]:hidden tw:rtl:-translate-x-px tw:flex tw:min-w-0 tw:flex-col',
    );
  }
}
