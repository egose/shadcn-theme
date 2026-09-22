import { Directive } from '@angular/core';
import { classes } from '@egose/shadcn-theme-ng/utils';

@Directive({
  selector: '[hlmAlertDialogFooter],hlm-alert-dialog-footer',
  host: { 'data-slot': 'alert-dialog-footer' },
})
export class HlmAlertDialogFooter {
  constructor() {
    classes(
      () =>
        'tw:flex tw:flex-col-reverse tw:gap-2 tw:group-data-[size=sm]/alert-dialog-content:grid tw:group-data-[size=sm]/alert-dialog-content:grid-cols-2 tw:sm:flex-row tw:sm:justify-end',
    );
  }
}
