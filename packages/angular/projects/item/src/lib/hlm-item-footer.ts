import { Directive } from '@angular/core';
import { classes } from '@egose/shadcn-theme-ng/utils';

@Directive({
  selector: '[hlmItemFooter],hlm-item-footer',
  host: { 'data-slot': 'item-footer' },
})
export class HlmItemFooter {
  constructor() {
    classes(() => 'tw:gap-2 tw:flex tw:basis-full tw:min-w-0 tw:flex-wrap tw:items-center tw:justify-between');
  }
}
