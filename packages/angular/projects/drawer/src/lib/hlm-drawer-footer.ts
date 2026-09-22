import { Directive } from '@angular/core';
import { classes } from '@egose/shadcn-theme-ng/utils';

@Directive({
  selector: '[hlmDrawerFooter],hlm-drawer-footer',
  host: { 'data-slot': 'drawer-footer' },
})
export class HlmDrawerFooter {
  constructor() {
    classes(() => 'tw:gap-2 tw:p-4 tw:mt-auto tw:flex tw:flex-col');
  }
}
