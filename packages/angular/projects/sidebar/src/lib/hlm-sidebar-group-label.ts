import { Directive } from '@angular/core';
import { classes } from '@egose/shadcn-theme-ng/utils';

@Directive({
  selector: 'div[hlmSidebarGroupLabel], button[hlmSidebarGroupLabel]',
  host: {
    'data-slot': 'sidebar-group-label',
    'data-sidebar': 'group-label',
  },
})
export class HlmSidebarGroupLabel {
  constructor() {
    classes(
      () =>
        'tw:text-sidebar-foreground/70 tw:ring-sidebar-ring tw:h-8 tw:rounded-md tw:px-2 tw:text-xs tw:font-medium tw:transition-[margin,opacity] tw:duration-200 tw:ease-linear tw:group-data-[collapsible=icon]:-mt-8 tw:group-data-[collapsible=icon]:opacity-0 tw:focus-visible:ring-2 tw:[&>ng-icon]:text-[length:--spacing(4)] tw:flex tw:shrink-0 tw:items-center tw:outline-hidden tw:[&>ng-icon]:shrink-0',
    );
  }
}
