import { Directive } from '@angular/core';
import { BrnNavigationMenuLink } from '@spartan-ng/brain/navigation-menu';
import { classes } from '@egose/shadcn-theme-ng/utils';

@Directive({
  selector: 'a[hlmNavigationMenuLink]',
  hostDirectives: [{ directive: BrnNavigationMenuLink, inputs: ['active'] }],
  host: {
    'data-slot': 'navigation-menu-link',
  },
})
export class HlmNavigationMenuLink {
  constructor() {
    classes(
      () =>
        "tw:data-[active=true]:focus:bg-muted tw:data-[active=true]:hover:bg-muted tw:data-[active=true]:bg-muted/50 tw:focus-visible:ring-ring/50 tw:hover:bg-muted tw:focus:bg-muted tw:flex tw:items-center tw:gap-1.5 tw:rounded-sm tw:p-2 tw:text-sm tw:transition-all tw:outline-none tw:focus-visible:ring-3 tw:focus-visible:outline-1 tw:[&_ng-icon:not([class*='text-'])]:text-[length:--spacing(4)]",
    );
  }
}
