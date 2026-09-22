import { Directive } from '@angular/core';
import { classes } from '@egose/shadcn-theme-ng/utils';

@Directive({
  selector: '[hlmItemTitle],hlm-item-title',
  host: { 'data-slot': 'item-title' },
})
export class HlmItemTitle {
  constructor() {
    classes(
      () =>
        'tw:gap-2 tw:text-sm tw:leading-snug tw:font-medium tw:underline-offset-4 tw:line-clamp-1 tw:flex tw:w-fit tw:items-center',
    );
  }
}
