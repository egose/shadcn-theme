import { Directive } from '@angular/core';
import { BrnSelectPlaceholder } from '@spartan-ng/brain/select';
import { classes } from '@egose/shadcn-theme-ng/utils';

@Directive({
  selector: '[hlmSelectPlaceholder],hlm-select-placeholder',
  hostDirectives: [BrnSelectPlaceholder],
  host: { 'data-slot': 'select-placeholder' },
})
export class HlmSelectPlaceholder {
  constructor() {
    classes(
      () =>
        "tw:gap-2 tw:[&_ng-icon:not([class*='text-'])]:text-[length:--spacing(4)] tw:flex tw:items-center tw:data-hidden:hidden tw:[&_ng-icon]:pointer-events-none tw:[&_ng-icon]:shrink-0",
    );
  }
}
