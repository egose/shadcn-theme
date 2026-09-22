import { Directive } from '@angular/core';
import { classes } from '@egose/shadcn-theme-ng/utils';

@Directive({
  selector: '[hlmCardFooter],hlm-card-footer',
  host: { 'data-slot': 'card-footer' },
})
export class HlmCardFooter {
  constructor() {
    classes(() => 'tw:rounded-b-xl tw:px-(--card-spacing) tw:[.border-t]:pt-(--card-spacing) tw:flex tw:items-center');
  }
}
