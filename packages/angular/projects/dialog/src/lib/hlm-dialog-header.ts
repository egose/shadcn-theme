import { Directive } from '@angular/core';
import { classes } from '@egose/shadcn-theme-ng/utils';

@Directive({
  selector: '[hlmDialogHeader],hlm-dialog-header',
  host: { 'data-slot': 'dialog-header' },
})
export class HlmDialogHeader {
  constructor() {
    classes(() => 'tw:gap-2 tw:flex tw:flex-col');
  }
}
