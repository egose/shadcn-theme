import { Directive } from '@angular/core';
import { classes } from '@egose/shadcn-theme-ng/utils';

export const hlmH2 =
  'tw:scroll-m-20 tw:border-border tw:border-b tw:pb-2 tw:text-3xl tw:font-semibold tw:tracking-tight tw:transition-colors tw:first:mt-0';

@Directive({
  selector: '[hlmH2]',
})
export class HlmH2 {
  constructor() {
    classes(() => hlmH2);
  }
}
