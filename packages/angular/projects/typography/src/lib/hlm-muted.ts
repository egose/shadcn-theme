import { Directive } from '@angular/core';
import { classes } from '@egose/shadcn-theme-ng/utils';

export const hlmMuted = 'tw:text-sm tw:text-muted-foreground';

@Directive({
  selector: '[hlmMuted]',
})
export class HlmMuted {
  constructor() {
    classes(() => hlmMuted);
  }
}
