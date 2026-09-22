import { CdkMenuBar } from '@angular/cdk/menu';
import { Directive } from '@angular/core';
import { classes } from '@egose/shadcn-theme-ng/utils';

@Directive({
  selector: '[hlmMenubar],hlm-menubar',
  hostDirectives: [CdkMenuBar],
  host: {
    'data-slot': 'menubar',
  },
})
export class HlmMenubar {
  constructor() {
    classes(
      () => 'tw:bg-background tw:h-9 tw:gap-1 tw:rounded-md tw:border tw:p-1 tw:shadow-xs tw:flex tw:items-center',
    );
  }
}
