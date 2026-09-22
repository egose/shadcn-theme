import { Directive } from '@angular/core';
import { classes } from '@egose/shadcn-theme-ng/utils';

export const hlmSmall = 'tw:text-sm tw:font-medium tw:leading-none';

@Directive({
  selector: '[hlmSmall]',
})
export class HlmSmall {
  constructor() {
    classes(() => hlmSmall);
  }
}
