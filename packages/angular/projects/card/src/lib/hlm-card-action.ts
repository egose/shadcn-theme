import { Directive } from '@angular/core';
import { classes } from '@egose/shadcn-theme-ng/utils';

@Directive({
  selector: '[hlmCardAction]',
  host: { 'data-slot': 'card-action' },
})
export class HlmCardAction {
  constructor() {
    classes(() => 'tw:col-start-2 tw:row-span-2 tw:row-start-1 tw:self-start tw:justify-self-end');
  }
}
