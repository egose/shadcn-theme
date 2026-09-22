import { Directive } from '@angular/core';
import { classes } from '@egose/shadcn-theme-ng/utils';

export const hlmUl = 'tw:my-6 tw:ml-6 tw:list-disc tw:[&>li]:mt-2';

@Directive({
  selector: '[hlmUl]',
})
export class HlmUl {
  constructor() {
    classes(() => hlmUl);
  }
}
