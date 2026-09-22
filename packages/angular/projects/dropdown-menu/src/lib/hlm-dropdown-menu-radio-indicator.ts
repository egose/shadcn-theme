import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCheck } from '@ng-icons/lucide';
import { classes } from '@egose/shadcn-theme-ng/utils';

@Component({
  selector: 'hlm-dropdown-menu-radio-indicator',
  imports: [NgIcon],
  providers: [provideIcons({ lucideCheck })],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'data-slot': 'dropdown-menu-radio-item-indicator' },
  template: ` <ng-icon name="lucideCheck" /> `,
})
export class HlmDropdownMenuRadioIndicator {
  constructor() {
    classes(
      () =>
        'tw:absolute tw:end-2 tw:flex tw:items-center tw:justify-center tw:[&_ng-icon]:text-[length:--spacing(4)] tw:pointer-events-none tw:opacity-0 tw:group-data-checked/dropdown-menu-radio:opacity-100',
    );
  }
}
