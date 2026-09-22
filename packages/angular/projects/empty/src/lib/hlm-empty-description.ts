import { Directive } from '@angular/core';
import { classes } from '@egose/shadcn-theme-ng/utils';

@Directive({
  selector: '[hlmEmptyDescription]',
  host: { 'data-slot': 'empty-description' },
})
export class HlmEmptyDescription {
  constructor() {
    classes(
      () =>
        'tw:text-sm/relaxed tw:text-muted-foreground tw:[&>a:hover]:text-primary tw:[&>a]:underline tw:[&>a]:underline-offset-4',
    );
  }
}
