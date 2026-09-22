import { Directive } from '@angular/core';
import { classes } from '@egose/shadcn-theme-ng/utils';

@Directive({
  selector: '[hlmItemHeader],hlm-item-header',
  host: { 'data-slot': 'item-header' },
})
export class HlmItemHeader {
  constructor() {
    classes(() => 'tw:gap-2 tw:flex tw:basis-full tw:items-center tw:justify-between');
  }
}
