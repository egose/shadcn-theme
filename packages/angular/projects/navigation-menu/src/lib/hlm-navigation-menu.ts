import { Directive } from '@angular/core';
import { BrnNavigationMenu } from '@spartan-ng/brain/navigation-menu';
import { classes } from '@egose/shadcn-theme-ng/utils';

@Directive({
  selector: 'nav[hlmNavigationMenu]',
  hostDirectives: [
    {
      directive: BrnNavigationMenu,
      inputs: ['value', 'delayDuration', 'skipDelayDuration', 'orientation', 'openOn'],
      outputs: ['valueChange'],
    },
  ],
  host: {
    'data-slot': 'navigation-menu',
  },
})
export class HlmNavigationMenu {
  constructor() {
    classes(
      () => 'tw:group/navigation-menu tw:relative tw:flex tw:max-w-max tw:flex-1 tw:items-center tw:justify-center',
    );
  }
}
