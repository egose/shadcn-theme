import { Directive } from '@angular/core';
import { classes } from '@egose/shadcn-theme-ng/utils';

@Directive({
  selector: '[hlmCommandEmpty]',
  host: {
    'data-slot': 'command-empty',
  },
})
export class HlmCommandEmpty {
  constructor() {
    classes(() => 'tw:py-6 tw:text-center tw:text-sm');
  }
}
