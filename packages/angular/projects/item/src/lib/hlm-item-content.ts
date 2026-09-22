import { Directive } from '@angular/core';
import { classes } from '@egose/shadcn-theme-ng/utils';

@Directive({
  selector: '[hlmItemContent],hlm-item-content',
  host: { 'data-slot': 'item-content' },
})
export class HlmItemContent {
  constructor() {
    classes(
      () =>
        'tw:gap-1 tw:group-data-[size=xs]/item:gap-0 tw:flex tw:flex-1 tw:flex-col tw:[&+[data-slot=item-content]]:flex-none',
    );
  }
}
