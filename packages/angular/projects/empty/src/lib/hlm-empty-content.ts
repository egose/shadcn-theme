import { Directive } from '@angular/core';
import { classes } from '@egose/shadcn-theme-ng/utils';

@Directive({
  selector: '[hlmEmptyContent],hlm-empty-content',
  host: { 'data-slot': 'empty-content' },
})
export class HlmEmptyContent {
  constructor() {
    classes(
      () => 'tw:gap-4 tw:text-sm tw:flex tw:w-full tw:max-w-sm tw:min-w-0 tw:flex-col tw:items-center tw:text-balance',
    );
  }
}
