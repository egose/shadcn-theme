import { type BooleanInput } from '@angular/cdk/coercion';
import { booleanAttribute, Directive, input } from '@angular/core';
import { classes } from '@egose/shadcn-theme-ng/utils';

@Directive({
  selector: '[hlmDropdownMenuLabel],hlm-dropdown-menu-label',
  host: {
    'data-slot': 'dropdown-menu-label',
    '[attr.data-inset]': 'inset() ? "" : null',
  },
})
export class HlmDropdownMenuLabel {
  public readonly inset = input<boolean, BooleanInput>(false, {
    transform: booleanAttribute,
  });

  constructor() {
    classes(() => 'tw:text-muted-foreground tw:px-2 tw:py-1.5 tw:text-xs tw:font-medium tw:data-inset:ps-8 tw:block');
  }
}
