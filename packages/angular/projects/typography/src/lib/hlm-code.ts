import { Directive } from '@angular/core';
import { classes } from '@egose/shadcn-theme-ng/utils';

export const hlmCode =
  'tw:relative tw:rounded tw:bg-muted tw:px-[0.3rem] tw:py-[0.2rem] tw:font-mono tw:text-sm tw:font-semibold';

@Directive({
  selector: '[hlmCode]',
})
export class HlmCode {
  constructor() {
    classes(() => hlmCode);
  }
}
