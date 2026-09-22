import { Directive } from '@angular/core';
import { classes } from '@egose/shadcn-theme-ng/utils';

export const hlmP = 'tw:leading-7 tw:[&:not(:first-child)]:mt-6';

@Directive({
  selector: '[hlmP]',
})
export class HlmP {
  constructor() {
    classes(() => hlmP);
  }
}
