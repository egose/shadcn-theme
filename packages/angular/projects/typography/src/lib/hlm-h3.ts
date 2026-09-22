import { Directive } from '@angular/core';
import { classes } from '@egose/shadcn-theme-ng/utils';

export const hlmH3 = 'tw:scroll-m-20 tw:text-2xl tw:font-semibold tw:tracking-tight';

@Directive({
  selector: '[hlmH3]',
})
export class HlmH3 {
  constructor() {
    classes(() => hlmH3);
  }
}
