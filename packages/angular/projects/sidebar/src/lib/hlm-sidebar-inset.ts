import { Directive } from '@angular/core';
import { classes } from '@egose/shadcn-theme-ng/utils';

@Directive({
  selector: 'main[hlmSidebarInset]',
  host: { 'data-slot': 'sidebar-inset' },
})
export class HlmSidebarInset {
  constructor() {
    classes(
      () =>
        'tw:bg-background tw:md:peer-data-[variant=inset]:m-2 tw:md:peer-data-[variant=inset]:ms-0 tw:md:peer-data-[variant=inset]:rounded-xl tw:md:peer-data-[variant=inset]:shadow-sm tw:md:peer-data-[variant=inset]:peer-data-[state=collapsed]:ms-2 tw:relative tw:flex tw:w-full tw:flex-1 tw:flex-col',
    );
  }
}
