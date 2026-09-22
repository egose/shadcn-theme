import { type BooleanInput } from '@angular/cdk/coercion';
import { booleanAttribute, Directive, input } from '@angular/core';
import { classes } from '@egose/shadcn-theme-ng/utils';

@Directive({
  selector: 'button[hlmSidebarMenuAction]',
  host: {
    'data-slot': 'sidebar-menu-action',
    'data-sidebar': 'menu-action',
  },
})
export class HlmSidebarMenuAction {
  public readonly showOnHover = input<boolean, BooleanInput>(false, { transform: booleanAttribute });

  constructor() {
    classes(() => [
      'tw:text-sidebar-foreground tw:ring-sidebar-ring tw:hover:bg-sidebar-accent tw:hover:text-sidebar-accent-foreground tw:peer-hover/menu-button:text-sidebar-accent-foreground tw:absolute tw:end-1 tw:top-1.5 tw:aspect-square tw:w-5 tw:rounded-md tw:p-0 tw:peer-data-[size=default]/menu-button:top-1.5 tw:peer-data-[size=lg]/menu-button:top-2.5 tw:peer-data-[size=sm]/menu-button:top-1 tw:focus-visible:ring-2 tw:[&>ng-icon]:text-[length:--spacing(4)] tw:flex tw:items-center tw:justify-center tw:outline-hidden tw:transition-transform tw:group-data-[collapsible=icon]:hidden tw:after:absolute tw:after:-inset-2 tw:md:after:hidden tw:[&>ng-icon]:shrink-0',
      this.showOnHover() &&
        'tw:peer-data-active/menu-button:text-sidebar-accent-foreground tw:group-focus-within/menu-item:opacity-100 tw:group-hover/menu-item:opacity-100 tw:aria-expanded:opacity-100 tw:md:opacity-0',
    ]);
  }
}
