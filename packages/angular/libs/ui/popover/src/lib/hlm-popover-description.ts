import { Directive } from '@angular/core';
import { classes } from '@egose/shadcn-theme-ng/utils';

@Directive({
  selector: '[hlmPopoverDescription]',
  host: { 'data-slot': 'popover-description' },
})
export class HlmPopoverDescription {
  constructor() {
    classes(() => 'text-muted-foreground');
  }
}
