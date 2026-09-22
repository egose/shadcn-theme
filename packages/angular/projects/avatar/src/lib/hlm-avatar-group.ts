import { Directive } from '@angular/core';
import { classes } from '@egose/shadcn-theme-ng/utils';

@Directive({
  selector: '[hlmAvatarGroup],hlm-avatar-group',
  host: {
    'data-slot': 'avatar-group',
  },
})
export class HlmAvatarGroup {
  constructor() {
    classes(
      () =>
        'tw:*:data-[slot=avatar]:ring-background tw:group/avatar-group tw:flex tw:-space-x-2 tw:*:data-[slot=avatar]:ring-2',
    );
  }
}
