import { Directive } from '@angular/core';
import { classes } from '@egose/shadcn-theme-ng/utils';

export const hlmLarge = 'tw:text-lg tw:font-semibold';

@Directive({
  selector: '[hlmLarge]',
})
export class HlmLarge {
  constructor() {
    classes(() => hlmLarge);
  }
}
