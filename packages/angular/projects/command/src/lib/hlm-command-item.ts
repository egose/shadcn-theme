import { Directive } from '@angular/core';
import { BrnCommandItem } from '@spartan-ng/brain/command';
import { classes } from '@egose/shadcn-theme-ng/utils';

@Directive({
  selector: 'button[hlmCommandItem],button[hlm-command-item]',
  hostDirectives: [
    {
      directive: BrnCommandItem,
      inputs: ['value', 'disabled', 'id'],
      outputs: ['selected'],
    },
  ],
  host: {
    'data-slot': 'command-item',
  },
})
export class HlmCommandItem {
  constructor() {
    classes(
      () =>
        "tw:data-selected:bg-muted tw:data-selected:text-foreground tw:relative tw:flex tw:cursor-default tw:items-center tw:gap-2 tw:rounded-sm tw:px-2 tw:py-1.5 tw:text-sm tw:outline-hidden tw:select-none tw:in-data-[slot=dialog-content]:rounded-lg! tw:[&_ng-icon:not([class*='text-'])]:text-[length:--spacing(4)] tw:group/command-item tw:w-full tw:data-disabled:pointer-events-none tw:data-disabled:opacity-50 tw:data-hidden:hidden tw:[&>ng-icon]:pointer-events-none tw:[&>ng-icon]:shrink-0",
    );
  }
}
