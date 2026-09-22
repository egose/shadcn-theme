import { Directive } from '@angular/core';
import { classes } from '@egose/shadcn-theme-ng/utils';

@Directive({
  selector: '[hlmDrawerHeader],hlm-drawer-header',
  host: { 'data-slot': 'drawer-header' },
})
export class HlmDrawerHeader {
  constructor() {
    classes(
      () =>
        'tw:gap-0.5 tw:p-4 tw:group-data-[vaul-drawer-direction=bottom]/drawer-content:text-center tw:group-data-[vaul-drawer-direction=top]/drawer-content:text-center tw:md:gap-1.5 tw:md:text-start tw:flex tw:flex-col',
    );
  }
}
