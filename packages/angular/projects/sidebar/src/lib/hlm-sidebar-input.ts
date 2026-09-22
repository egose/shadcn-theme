import { Directive } from '@angular/core';
import { HlmInput } from '@egose/shadcn-theme-ng/input';
import { classes } from '@egose/shadcn-theme-ng/utils';

@Directive({
  selector: 'input[hlmSidebarInput]',
  hostDirectives: [HlmInput],
  host: {
    'data-slot': 'sidebar-input',
    'data-sidebar': 'input',
  },
})
export class HlmSidebarInput {
  constructor() {
    classes(() => 'tw:bg-background tw:h-8 tw:w-full tw:shadow-none');
  }
}
