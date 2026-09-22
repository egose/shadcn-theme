import { Directive } from '@angular/core';
import { classes } from '@egose/shadcn-theme-ng/utils';

@Directive({
  selector: 'kbd[hlmKbd]',
  host: {
    'data-slot': 'kbd',
  },
})
export class HlmKbd {
  constructor() {
    classes(
      () =>
        "tw:bg-muted tw:text-muted-foreground tw:in-data-[slot=tooltip-content]:bg-background/20 tw:in-data-[slot=tooltip-content]:text-background tw:dark:in-data-[slot=tooltip-content]:bg-background/10 tw:h-5 tw:w-fit tw:min-w-5 tw:gap-1 tw:rounded-sm tw:px-1 tw:font-sans tw:text-xs tw:font-medium tw:[&_ng-icon:not([class*='text-'])]:text-[length:--spacing(3)] tw:pointer-events-none tw:inline-flex tw:items-center tw:justify-center tw:select-none",
    );
  }
}
