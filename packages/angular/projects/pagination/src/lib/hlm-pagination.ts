import { Directive, input } from '@angular/core';
import { classes } from '@egose/shadcn-theme-ng/utils';

@Directive({
  selector: '[hlmPagination],hlm-pagination',
  host: {
    'data-slot': 'pagination',
    role: 'navigation',
    '[attr.aria-label]': 'ariaLabel()',
  },
})
export class HlmPagination {
  /** The aria-label for the pagination component. */
  public readonly ariaLabel = input<string>('pagination', { alias: 'aria-label' });

  constructor() {
    classes(() => 'tw:mx-auto tw:flex tw:w-full tw:justify-center');
  }
}
