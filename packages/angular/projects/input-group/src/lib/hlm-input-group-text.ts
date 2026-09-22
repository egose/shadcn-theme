import { Directive } from '@angular/core';
import { classes } from '@egose/shadcn-theme-ng/utils';

@Directive({
  selector: '[hlmInputGroupText],hlm-input-group-text',
})
export class HlmInputGroupText {
  constructor() {
    classes(
      () =>
        "tw:text-muted-foreground tw:gap-2 tw:text-sm tw:[&_ng-icon:not([class*='text-'])]:text-[length:--spacing(4)] tw:flex tw:items-center tw:[&_ng-icon]:pointer-events-none",
    );
  }
}
