import { Directive } from '@angular/core';
import { classes } from '@egose/shadcn-theme-ng/utils';

@Directive({
  selector: '[hlmDialogFooter],hlm-dialog-footer',
  host: { 'data-slot': 'dialog-footer' },
})
export class HlmDialogFooter {
  constructor() {
    classes(() => 'tw:flex tw:flex-col-reverse tw:gap-2 tw:sm:flex-row tw:sm:justify-end');
  }
}
