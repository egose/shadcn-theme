import { Directive } from '@angular/core';
import { classes } from '@egose/shadcn-theme-ng/utils';

@Directive({
  selector: '[hlmAlertDialogHeader],hlm-alert-dialog-header',
  host: { 'data-slot': 'alert-dialog-header' },
})
export class HlmAlertDialogHeader {
  constructor() {
    classes(
      () =>
        'tw:grid tw:grid-rows-[auto_1fr] tw:place-items-center tw:gap-1.5 tw:text-center tw:has-data-[slot=alert-dialog-media]:grid-rows-[auto_auto_1fr] tw:has-data-[slot=alert-dialog-media]:gap-x-6 tw:sm:group-data-[size=default]/alert-dialog-content:place-items-start tw:sm:group-data-[size=default]/alert-dialog-content:text-start tw:sm:group-data-[size=default]/alert-dialog-content:has-data-[slot=alert-dialog-media]:grid-rows-[auto_1fr]',
    );
  }
}
