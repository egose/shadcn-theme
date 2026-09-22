import { Directive } from '@angular/core';
import { classes } from '@egose/shadcn-theme-ng/utils';

@Directive({
  selector: '[hlmSidebarMenuBadge],hlm-sidebar-menu-badge',
  host: {
    'data-slot': 'sidebar-menu-badge',
    'data-sidebar': 'menu-badge',
  },
})
export class HlmSidebarMenuBadge {
  constructor() {
    classes(
      () =>
        'tw:text-sidebar-foreground tw:peer-hover/menu-button:text-sidebar-accent-foreground tw:peer-data-active/menu-button:text-sidebar-accent-foreground tw:pointer-events-none tw:absolute tw:end-1 tw:h-5 tw:min-w-5 tw:rounded-md tw:px-1 tw:text-xs tw:font-medium tw:peer-data-[size=default]/menu-button:top-1.5 tw:peer-data-[size=lg]/menu-button:top-2.5 tw:peer-data-[size=sm]/menu-button:top-1 tw:flex tw:items-center tw:justify-center tw:tabular-nums tw:select-none tw:group-data-[collapsible=icon]:hidden',
    );
  }
}
