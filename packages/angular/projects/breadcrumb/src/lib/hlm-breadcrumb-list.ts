import { Directive } from '@angular/core';
import { classes } from '@egose/shadcn-theme-ng/utils';

@Directive({
  selector: '[hlmBreadcrumbList]',
  host: {
    'data-slot': 'breadcrumb-list',
  },
})
export class HlmBreadcrumbList {
  constructor() {
    classes(
      () =>
        'tw:text-muted-foreground tw:gap-1.5 tw:text-sm tw:sm:gap-2.5 tw:flex tw:flex-wrap tw:items-center tw:wrap-break-word',
    );
  }
}
