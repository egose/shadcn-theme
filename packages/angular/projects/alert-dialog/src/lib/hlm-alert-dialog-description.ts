import { Directive } from '@angular/core';
import { BrnAlertDialogDescription } from '@spartan-ng/brain/alert-dialog';
import { classes } from '@egose/shadcn-theme-ng/utils';

@Directive({
  selector: '[hlmAlertDialogDescription]',
  hostDirectives: [BrnAlertDialogDescription],
  host: { 'data-slot': 'alert-dialog-description' },
})
export class HlmAlertDialogDescription {
  constructor() {
    classes(
      () =>
        'tw:text-muted-foreground tw:*:[a]:hover:text-foreground tw:text-sm tw:text-balance tw:md:text-pretty tw:*:[a]:underline tw:*:[a]:underline-offset-3',
    );
  }
}
