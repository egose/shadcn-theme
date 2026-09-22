import { Directive, input } from '@angular/core';
import { BrnTabs } from '@spartan-ng/brain/tabs';
import { classes } from '@egose/shadcn-theme-ng/utils';

@Directive({
  selector: '[hlmTabs],hlm-tabs',
  hostDirectives: [
    {
      directive: BrnTabs,
      inputs: ['orientation', 'activationMode', 'brnTabs: tab'],
      outputs: ['tabActivated'],
    },
  ],
  host: {
    'data-slot': 'tabs',
  },
})
export class HlmTabs {
  public readonly tab = input.required<string>();

  constructor() {
    classes(() => 'tw:group/tabs tw:flex tw:gap-2 tw:data-[orientation=horizontal]:flex-col');
  }
}
