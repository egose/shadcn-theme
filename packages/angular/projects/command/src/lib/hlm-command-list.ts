import { Directive } from '@angular/core';
import { BrnCommandList } from '@spartan-ng/brain/command';
import { classes } from '@egose/shadcn-theme-ng/utils';

@Directive({
  selector: '[hlmCommandList],hlm-command-list',
  hostDirectives: [
    {
      directive: BrnCommandList,
      inputs: ['id'],
    },
  ],
  host: {
    'data-slot': 'command-list',
  },
})
export class HlmCommandList {
  constructor() {
    classes(() => 'no-scrollbar tw:max-h-72 tw:scroll-py-1 tw:outline-none tw:overflow-x-hidden tw:overflow-y-auto');
  }
}
