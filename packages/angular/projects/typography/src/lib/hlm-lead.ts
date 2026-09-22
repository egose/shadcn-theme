import { Directive } from '@angular/core';
import { classes } from '@egose/shadcn-theme-ng/utils';

export const hlmLead = 'tw:text-xl tw:text-muted-foreground';

@Directive({
  selector: '[hlmLead]',
})
export class HlmLead {
  constructor() {
    classes(() => hlmLead);
  }
}
