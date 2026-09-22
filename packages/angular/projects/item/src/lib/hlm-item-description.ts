import { Directive } from '@angular/core';
import { classes } from '@egose/shadcn-theme-ng/utils';

@Directive({
  selector: '[hlmItemDescription],hlm-item-description',
  host: { 'data-slot': 'item-description' },
})
export class HlmItemDescription {
  constructor() {
    classes(
      () =>
        'tw:text-muted-foreground tw:text-start tw:text-sm tw:leading-normal tw:group-data-[size=xs]/item:text-xs tw:[&>a:hover]:text-primary tw:line-clamp-2 tw:flex tw:font-normal tw:[&>a]:underline tw:[&>a]:underline-offset-4',
    );
  }
}
