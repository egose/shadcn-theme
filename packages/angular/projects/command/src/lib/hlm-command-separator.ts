import { Directive } from '@angular/core';
import { BrnCommandSeparator } from '@spartan-ng/brain/command';
import { classes } from '@egose/shadcn-theme-ng/utils';

@Directive({
  selector: '[hlmCommandSeparator],hlm-command-separator',
  hostDirectives: [BrnCommandSeparator],
  host: {
    'data-slot': 'command-separator',
  },
})
export class HlmCommandSeparator {
  constructor() {
    classes(() => 'tw:bg-border tw:-mx-1 tw:h-px tw:w-auto tw:block tw:data-hidden:hidden');
  }
}
