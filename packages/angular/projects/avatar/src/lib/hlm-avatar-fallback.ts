import { Directive } from '@angular/core';
import { BrnAvatarFallback } from '@spartan-ng/brain/avatar';
import { classes } from '@egose/shadcn-theme-ng/utils';

@Directive({
  selector: '[hlmAvatarFallback]',
  exportAs: 'hlmAvatarFallback',
  hostDirectives: [BrnAvatarFallback],
  host: {
    'data-slot': 'avatar-fallback',
  },
})
export class HlmAvatarFallback {
  constructor() {
    classes(
      () =>
        'tw:bg-muted tw:text-muted-foreground tw:rounded-full tw:flex tw:size-full tw:items-center tw:justify-center tw:text-sm tw:group-data-[size=sm]/avatar:text-xs',
    );
  }
}
