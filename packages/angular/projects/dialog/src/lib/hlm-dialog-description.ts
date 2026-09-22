import { Directive } from '@angular/core';
import { BrnDialogDescription } from '@spartan-ng/brain/dialog';
import { classes } from '@egose/shadcn-theme-ng/utils';

@Directive({
  selector: '[hlmDialogDescription]',
  hostDirectives: [BrnDialogDescription],
  host: { 'data-slot': 'dialog-description' },
})
export class HlmDialogDescription {
  constructor() {
    classes(
      () =>
        'tw:text-muted-foreground tw:*:[a]:hover:text-foreground tw:text-sm tw:*:[a]:underline tw:*:[a]:underline-offset-3',
    );
  }
}
