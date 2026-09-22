import { Directive } from '@angular/core';
import { classes } from '@egose/shadcn-theme-ng/utils';

@Directive({
  selector: '[hlmCommandShortcut],hlm-command-shortcut',
  host: {
    'data-slot': 'command-shortcut',
  },
})
export class HlmCommandShortcut {
  constructor() {
    classes(
      () =>
        'tw:text-muted-foreground tw:group-data-[selected]/command-item:text-foreground tw:ms-auto tw:text-xs tw:tracking-widest',
    );
  }
}
