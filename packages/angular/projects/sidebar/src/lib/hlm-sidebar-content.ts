import { Directive } from '@angular/core';
import { classes } from '@egose/shadcn-theme-ng/utils';

@Directive({
  selector: '[hlmSidebarContent],hlm-sidebar-content',
  host: {
    'data-slot': 'sidebar-content',
    'data-sidebar': 'content',
  },
})
export class HlmSidebarContent {
  constructor() {
    classes(
      () =>
        'no-scrollbar tw:gap-2 tw:flex tw:min-h-0 tw:flex-1 tw:flex-col tw:overflow-auto tw:group-data-[collapsible=icon]:overflow-hidden',
    );
  }
}
