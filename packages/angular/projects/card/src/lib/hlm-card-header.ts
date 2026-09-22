import { Directive } from '@angular/core';
import { classes } from '@egose/shadcn-theme-ng/utils';

@Directive({
  selector: '[hlmCardHeader],hlm-card-header',
  host: { 'data-slot': 'card-header' },
})
export class HlmCardHeader {
  constructor() {
    classes(
      () =>
        'tw:gap-1 tw:rounded-t-xl tw:px-(--card-spacing) tw:[.border-b]:pb-(--card-spacing) tw:group/card-header tw:@container/card-header tw:grid tw:auto-rows-min tw:items-start tw:has-data-[slot=card-action]:grid-cols-[1fr_auto] tw:has-data-[slot=card-description]:grid-rows-[auto_auto]',
    );
  }
}
