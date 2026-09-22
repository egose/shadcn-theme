import { Directive } from '@angular/core';
import { classes } from '@egose/shadcn-theme-ng/utils';

@Directive({
  selector: '[hlmCardTitle]',
  host: { 'data-slot': 'card-title' },
})
export class HlmCardTitle {
  constructor() {
    classes(() => 'tw:text-base tw:leading-normal tw:font-medium tw:group-data-[size=sm]/card:text-sm');
  }
}
