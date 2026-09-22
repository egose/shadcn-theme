import { Directive } from '@angular/core';
import { classes } from '@egose/shadcn-theme-ng/utils';

@Directive({
  selector: 'kbd[hlmKbdGroup]',
  host: {
    'data-slot': 'kbd-group',
  },
})
export class HlmKbdGroup {
  constructor() {
    classes(() => 'tw:gap-1 tw:inline-flex tw:items-center');
  }
}
