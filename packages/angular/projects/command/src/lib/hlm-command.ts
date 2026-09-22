import { Directive } from '@angular/core';
import { BrnCommand } from '@spartan-ng/brain/command';
import { classes } from '@egose/shadcn-theme-ng/utils';

@Directive({
  selector: '[hlmCommand],hlm-command',
  hostDirectives: [
    {
      directive: BrnCommand,
      inputs: ['id', 'filter', 'search', 'disabled'],
      outputs: ['valueChange', 'searchChange'],
    },
  ],
  host: {
    'data-slot': 'command',
  },
})
export class HlmCommand {
  constructor() {
    classes(
      () =>
        'tw:bg-popover tw:text-popover-foreground tw:rounded-xl! tw:p-1 tw:flex tw:size-full tw:flex-col tw:overflow-hidden',
    );
  }
}
