import { Directive } from '@angular/core';
import { classes } from '@egose/shadcn-theme-ng/utils';

@Directive({
  selector: '[hlmButtonGroupText],hlm-button-group-text',
  host: {
    'data-slot': 'button-group-text',
  },
})
export class HlmButtonGroupText {
  constructor() {
    classes(
      () =>
        "tw:bg-muted tw:gap-2 tw:rounded-lg tw:border tw:px-2.5 tw:text-sm tw:font-medium tw:shadow-xs tw:[&_ng-icon:not([class*='text-'])]:text-[length:--spacing(4)] tw:flex tw:items-center tw:[&_ng-icon]:pointer-events-none",
    );
  }
}
