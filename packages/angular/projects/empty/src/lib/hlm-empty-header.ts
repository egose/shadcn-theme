import { Directive } from '@angular/core';
import { classes } from '@egose/shadcn-theme-ng/utils';

@Directive({
  selector: '[hlmEmptyHeader],hlm-empty-header',
  host: { 'data-slot': 'empty-header' },
})
export class HlmEmptyHeader {
  constructor() {
    classes(() => 'tw:gap-2 tw:flex tw:max-w-sm tw:flex-col tw:items-center');
  }
}
