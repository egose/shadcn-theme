import { Directive } from '@angular/core';
import { classes } from '@egose/shadcn-theme-ng/utils';

@Directive({
  selector: 'button[hlmSidebarGroupAction]',
  host: {
    'data-slot': 'sidebar-group-action',
    'data-sidebar': 'group-action',
  },
})
export class HlmSidebarGroupAction {
  constructor() {
    classes(
      () =>
        'tw:text-sidebar-foreground tw:ring-sidebar-ring tw:hover:bg-sidebar-accent tw:hover:text-sidebar-accent-foreground tw:absolute tw:end-3 tw:top-3.5 tw:w-5 tw:rounded-md tw:p-0 tw:focus-visible:ring-2 tw:[&>ng-icon]:text-[length:--spacing(4)] tw:flex tw:aspect-square tw:items-center tw:justify-center tw:outline-hidden tw:transition-transform tw:group-data-[collapsible=icon]:hidden tw:after:absolute tw:after:-inset-2 tw:md:after:hidden tw:[&>ng-icon]:shrink-0',
    );
  }
}
