import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCheck } from '@ng-icons/lucide';
import { BrnComboboxItem } from '@spartan-ng/brain/combobox';
import { classes } from '@egose/shadcn-theme-ng/utils';

@Component({
  selector: 'hlm-combobox-item',
  imports: [NgIcon],
  providers: [provideIcons({ lucideCheck })],
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [{ directive: BrnComboboxItem, inputs: ['id', 'disabled', 'value'] }],
  host: { 'data-slot': 'combobox-item' },
  template: `
    <ng-content />
    @if (_active()) {
      <ng-icon
        name="lucideCheck"
        class="tw:absolute tw:end-2 tw:flex tw:items-center tw:justify-center tw:text-[length:--spacing(4)]"
        aria-hidden="true"
      />
    }
  `,
})
export class HlmComboboxItem {
  private readonly _brnComboboxItem = inject(BrnComboboxItem);

  protected readonly _active = this._brnComboboxItem.active;

  constructor() {
    classes(
      () =>
        'tw:data-highlighted:bg-accent tw:data-highlighted:text-accent-foreground tw:not-data-[variant=destructive]:data-highlighted:**:text-accent-foreground tw:gap-2 tw:rounded-sm tw:py-1.5 tw:ps-2 tw:pe-8 tw:text-sm tw:relative tw:flex tw:w-full tw:cursor-default tw:items-center tw:outline-hidden tw:select-none tw:data-disabled:pointer-events-none tw:data-disabled:opacity-50 tw:data-hidden:hidden tw:[&_ng-icon]:pointer-events-none tw:[&_ng-icon]:shrink-0',
    );
  }
}
