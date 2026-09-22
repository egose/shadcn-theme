import { Directive } from '@angular/core';
import { classes } from '@egose/shadcn-theme-ng/utils';

@Directive({
  selector: '[hlmAlertDialogMedia],hlm-alert-dialog-media',
  host: { 'data-slot': 'alert-dialog-media' },
})
export class HlmAlertDialogMedia {
  constructor() {
    classes(
      () =>
        "tw:bg-muted tw:mb-2 tw:inline-flex tw:size-16 tw:items-center tw:justify-center tw:rounded-md tw:sm:group-data-[size=default]/alert-dialog-content:row-span-2 tw:*:[ng-icon:not([class*='text-'])]:text-[length:--spacing(8)]",
    );
  }
}
