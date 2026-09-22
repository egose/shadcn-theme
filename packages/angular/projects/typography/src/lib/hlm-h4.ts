import { Directive } from '@angular/core';
import { classes } from '@egose/shadcn-theme-ng/utils';

export const hlmH4 = 'tw:scroll-m-20 tw:text-xl tw:font-semibold tw:tracking-tight';

@Directive({
  selector: '[hlmH4]',
})
export class HlmH4 {
  constructor() {
    classes(() => hlmH4);
  }
}
