import { Directive } from '@angular/core';
import { BrnResizableGroup } from '@spartan-ng/brain/resizable';
import { classes } from '@egose/shadcn-theme-ng/utils';

@Directive({
  selector: '[hlmResizableGroup],hlm-resizable-group',
  hostDirectives: [
    {
      directive: BrnResizableGroup,
      inputs: ['direction', 'layout'],
      outputs: ['dragEnd', 'dragStart', 'layoutChange'],
    },
  ],
  host: {
    'data-slot': 'resizable-group',
  },
})
export class HlmResizableGroup {
  constructor() {
    classes(() => 'tw:group tw:flex tw:h-full tw:w-full tw:data-[panel-group-direction=vertical]:flex-col');
  }
}
