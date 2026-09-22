import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCheck } from '@ng-icons/lucide';
import { classes } from '@egose/shadcn-theme-ng/utils';

@Component({
  selector: 'hlm-dropdown-menu-checkbox-indicator',
  imports: [NgIcon],
  providers: [provideIcons({ lucideCheck })],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'data-slot': 'dropdown-menu-checkbox-item-indicator' },
  template: ` <ng-icon name="lucideCheck" /> `,
})
export class HlmDropdownMenuCheckboxIndicator {
  constructor() {
    classes(
      () =>
        'tw:absolute tw:end-2 tw:flex tw:items-center tw:justify-center tw:[&_ng-icon]:text-[length:--spacing(4)] tw:pointer-events-none tw:opacity-0 tw:group-data-checked/dropdown-menu-checkbox:opacity-100',
    );
  }
}
