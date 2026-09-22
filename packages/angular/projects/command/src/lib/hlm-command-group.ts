import { Directive } from '@angular/core';
import { BrnCommandGroup } from '@spartan-ng/brain/command';
import { classes } from '@egose/shadcn-theme-ng/utils';

@Directive({
  selector: '[hlmCommandGroup],hlm-command-group',
  hostDirectives: [
    {
      directive: BrnCommandGroup,
      inputs: ['id'],
    },
  ],
  host: {
    'data-slot': 'command-group',
  },
})
export class HlmCommandGroup {
  constructor() {
    classes(
      () =>
        'tw:text-foreground tw:**:data-[slot=command-group-label]:text-muted-foreground tw:overflow-hidden tw:p-1 tw:**:data-[slot=command-group-label]:px-2 tw:**:data-[slot=command-group-label]:py-1.5 tw:**:data-[slot=command-group-label]:text-xs tw:**:data-[slot=command-group-label]:font-medium tw:block tw:data-hidden:hidden',
    );
  }
}
