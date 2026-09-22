import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronRight } from '@ng-icons/lucide';
import { classes } from '@egose/shadcn-theme-ng/utils';

@Component({
  selector: 'hlm-dropdown-menu-item-sub-indicator',
  imports: [NgIcon],
  providers: [provideIcons({ lucideChevronRight })],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: ` <ng-icon name="lucideChevronRight" class="tw:text-[length:--spacing(4)] tw:rtl:rotate-180" /> `,
})
export class HlmDropdownMenuItemSubIndicator {
  constructor() {
    classes(() => 'tw:ms-auto tw:flex tw:items-center tw:justify-center');
  }
}
