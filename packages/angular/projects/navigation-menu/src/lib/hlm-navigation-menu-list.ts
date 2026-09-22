import { Directive } from '@angular/core';
import { BrnNavigationMenuList } from '@spartan-ng/brain/navigation-menu';
import { classes } from '@egose/shadcn-theme-ng/utils';

@Directive({
  selector: 'ul[hlmNavigationMenuList]',
  hostDirectives: [
    {
      directive: BrnNavigationMenuList,
    },
  ],
  host: {
    'data-slot': 'navigation-menu-list',
  },
})
export class HlmNavigationMenuList {
  constructor() {
    classes(() => [
      'tw:gap-0 tw:group tw:flex tw:flex-1 tw:list-none tw:items-center tw:justify-center',
      'tw:data-[orientation=vertical]:flex-col',
    ]);
  }
}
