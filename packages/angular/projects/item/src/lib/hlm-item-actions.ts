import { Directive } from '@angular/core';
import { classes } from '@egose/shadcn-theme-ng/utils';

@Directive({
  selector: '[hlmItemActions],hlm-item-actions',
  host: { 'data-slot': 'item-actions' },
})
export class HlmItemActions {
  constructor() {
    classes(() => 'tw:gap-2 tw:flex tw:min-w-0 tw:max-w-full tw:flex-wrap tw:items-center');
  }
}
