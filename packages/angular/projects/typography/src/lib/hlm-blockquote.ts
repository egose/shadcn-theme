import { Directive } from '@angular/core';
import { classes } from '@egose/shadcn-theme-ng/utils';

export const hlmBlockquote = 'tw:mt-6 tw:border-border tw:border-l-2 tw:pl-6 tw:italic';

@Directive({
  selector: '[hlmBlockquote]',
})
export class HlmBlockquote {
  constructor() {
    classes(() => hlmBlockquote);
  }
}
