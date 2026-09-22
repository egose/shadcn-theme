import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronDown } from '@ng-icons/lucide';
import { BrnSelectScrollDown } from '@spartan-ng/brain/select';
import { classes } from '@egose/shadcn-theme-ng/utils';

@Component({
  selector: 'hlm-select-scroll-down',
  imports: [NgIcon],
  providers: [provideIcons({ lucideChevronDown })],
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [BrnSelectScrollDown],
  template: ` <ng-icon name="lucideChevronDown" /> `,
})
export class HlmSelectScrollDown {
  constructor() {
    classes(
      () =>
        "tw:bg-popover tw:z-10 tw:flex tw:cursor-default tw:items-center tw:justify-center tw:py-1 tw:[&_ng-icon:not([class*='text-'])]:text-[length:--spacing(4)] tw:sticky tw:bottom-0 tw:w-full tw:data-hidden:hidden",
    );
  }
}
