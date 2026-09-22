import { Directive } from '@angular/core';
import { classes } from '@egose/shadcn-theme-ng/utils';

export const hlmH1 = 'tw:scroll-m-20 tw:text-4xl tw:font-extrabold tw:tracking-tight tw:lg:text-5xl';

@Directive({
  selector: '[hlmH1]',
})
export class HlmH1 {
  constructor() {
    classes(() => hlmH1);
  }
}
