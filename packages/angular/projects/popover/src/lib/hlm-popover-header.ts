import { Directive } from '@angular/core';
import { classes } from '@egose/shadcn-theme-ng/utils';

@Directive({
  selector: '[hlmPopoverHeader],hlm-popover-header',
  host: { 'data-slot': 'popover-header' },
})
export class HlmPopoverHeader {
  constructor() {
    classes(() => 'tw:flex tw:flex-col tw:gap-1 tw:text-sm');
  }
}
