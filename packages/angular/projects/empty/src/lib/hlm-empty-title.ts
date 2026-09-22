import { Directive } from '@angular/core';
import { classes } from '@egose/shadcn-theme-ng/utils';

@Directive({
  selector: '[hlmEmptyTitle]',
  host: { 'data-slot': 'empty-title' },
})
export class HlmEmptyTitle {
  constructor() {
    classes(() => 'tw:text-lg tw:font-medium tw:tracking-tight');
  }
}
