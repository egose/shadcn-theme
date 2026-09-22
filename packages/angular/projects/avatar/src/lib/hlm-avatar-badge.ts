import { Directive } from '@angular/core';
import { classes } from '@egose/shadcn-theme-ng/utils';

@Directive({
  selector: '[hlmAvatarBadge],hlm-avatar-badge',
  host: {
    'data-slot': 'avatar-badge',
  },
})
export class HlmAvatarBadge {
  constructor() {
    classes(() => [
      'tw:bg-primary tw:text-primary-foreground tw:ring-background tw:absolute tw:right-0 tw:bottom-0 tw:z-10 tw:inline-flex tw:items-center tw:justify-center tw:rounded-full tw:bg-blend-color tw:ring-2 tw:select-none',
      'tw:group-data-[size=sm]/avatar:size-2 tw:group-data-[size=sm]/avatar:[&>ng-icon]:hidden',
      'tw:group-data-[size=default]/avatar:size-2.5 tw:group-data-[size=default]/avatar:[&>ng-icon]:text-[length:--spacing(2)]',
      'tw:group-data-[size=lg]/avatar:size-3 tw:group-data-[size=lg]/avatar:[&>ng-icon]:text-[length:--spacing(2)]',
    ]);
  }
}
