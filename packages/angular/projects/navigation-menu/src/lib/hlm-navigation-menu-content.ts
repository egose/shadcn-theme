import { type NumberInput } from '@angular/cdk/coercion';
import { Directive, input, numberAttribute } from '@angular/core';
import { classes } from '@egose/shadcn-theme-ng/utils';

@Directive({
  selector: '[hlmNavigationMenuContent],hlm-navigation-menu-content',
  host: {
    'data-slot': 'navigation-menu-content',
    '[style.--nav-offset]': 'navOffset()',
  },
})
export class HlmNavigationMenuContent {
  public readonly navOffset = input<number, NumberInput>(1.5, { transform: numberAttribute });

  constructor() {
    classes(() => [
      'tw:data-[motion^=from-]:animate-in tw:data-[motion^=to-]:animate-out data-[motion^=from-]:fade-in data-[motion^=to-]:fade-out tw:top-0 tw:left-0 tw:w-full tw:p-2 tw:pr-2.5 tw:md:w-auto',
      'data-[orientation=horizontal]:data-[motion=from-end]:slide-in-from-right-52 data-[orientation=horizontal]:data-[motion=from-start]:slide-in-from-left-52 data-[orientation=horizontal]:data-[motion=to-end]:slide-out-to-right-52 data-[orientation=horizontal]:data-[motion=to-start]:slide-out-to-left-52',
      'data-[orientation=vertical]:data-[motion=from-end]:slide-in-from-bottom-52 data-[orientation=vertical]:data-[motion=from-start]:slide-in-from-top-52 data-[orientation=vertical]:data-[motion=to-end]:slide-out-to-bottom-52 data-[orientation=vertical]:data-[motion=to-start]:slide-out-to-top-52',
      'tw:data-[orientation=horizontal]:mt-[--spacing(var(--nav-offset))] tw:data-[orientation=vertical]:mx-[--spacing(var(--nav-offset))]',
      'tw:bg-popover tw:text-popover-foreground tw:ring-foreground/10 tw:rounded-lg tw:shadow tw:ring-1 tw:transition-all tw:ease-[cubic-bezier(0.22,1,0.36,1)] tw:outline-none tw:data-ending-style:scale-90 tw:data-ending-style:opacity-0 tw:data-ending-style:duration-150 tw:data-starting-style:scale-90 tw:data-starting-style:opacity-0 tw:block',
    ]);
  }
}
