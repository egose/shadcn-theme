import { Directive } from '@angular/core';
import { classes } from '@egose/shadcn-theme-ng/utils';

@Directive({
  selector: '[hlmSidebarGroup],hlm-sidebar-group',
  host: {
    'data-slot': 'sidebar-group',
    'data-sidebar': 'group',
  },
})
export class HlmSidebarGroup {
  constructor() {
    classes(() => 'tw:p-2 tw:relative tw:flex tw:w-full tw:min-w-0 tw:flex-col');
  }
}
