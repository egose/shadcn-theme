import { Directive } from '@angular/core';
import { classes } from '@egose/shadcn-theme-ng/utils';

@Directive({
  selector: '[hlmAvatarGroupCount],hlm-avatar-group-count',
  host: {
    'data-slot': 'avatar-group-count',
  },
})
export class HlmAvatarGroupCount {
  constructor() {
    classes(
      () =>
        'tw:bg-muted tw:text-muted-foreground tw:ring-background tw:relative tw:flex tw:size-8 tw:shrink-0 tw:items-center tw:justify-center tw:rounded-full tw:text-sm tw:ring-2 tw:group-has-data-[size=lg]/avatar-group:size-10 tw:group-has-data-[size=sm]/avatar-group:size-6 tw:[&>ng-icon]:text-base tw:group-has-data-[size=lg]/avatar-group:[&>ng-icon]:text-xl tw:group-has-data-[size=sm]/avatar-group:[&>ng-icon]:text-xs',
    );
  }
}
