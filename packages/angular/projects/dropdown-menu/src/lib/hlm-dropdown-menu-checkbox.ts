import { type BooleanInput } from '@angular/cdk/coercion';
import { CdkMenuItem, CdkMenuItemCheckbox, CdkMenuItemSelectable } from '@angular/cdk/menu';
import { Directive, booleanAttribute, inject, input } from '@angular/core';
import { classes } from '@egose/shadcn-theme-ng/utils';
import { HlmDropdownMenuFocusOnHover } from './hlm-dropdown-menu-focus-on-hover';

/** @internal. Use HlmDropdownMenuCheckbox instead. */
@Directive({
  selector: '[hlmDropdownMenuCheckboxCdk]',
  providers: [
    { provide: CdkMenuItemCheckbox, useExisting: HlmDropdownMenuCheckboxCdk },
    { provide: CdkMenuItemSelectable, useExisting: HlmDropdownMenuCheckboxCdk },
    { provide: CdkMenuItem, useExisting: CdkMenuItemSelectable },
  ],
})
export class HlmDropdownMenuCheckboxCdk extends CdkMenuItemCheckbox {
  public readonly keepOpen = input<boolean, BooleanInput>(true, { transform: booleanAttribute });

  public override trigger(options?: { keepOpen: boolean }) {
    super.trigger({ ...options, keepOpen: this.keepOpen() });
  }
}

@Directive({
  selector: '[hlmDropdownMenuCheckbox],[hlmDropdownMenuCheckboxItem]',
  hostDirectives: [
    {
      directive: HlmDropdownMenuCheckboxCdk,
      inputs: ['cdkMenuItemDisabled: disabled', 'cdkMenuItemChecked: checked', 'keepOpen'],
      outputs: ['cdkMenuItemTriggered: triggered'],
    },
    HlmDropdownMenuFocusOnHover,
  ],
  host: {
    'data-slot': 'dropdown-menu-checkbox-item',
    '[attr.data-disabled]': '_cdkMenuItem.disabled ? "" : null',
    '[attr.data-checked]': '_cdkMenuItem.checked ? "" : null',
    '[attr.data-inset]': 'inset() ? "" : null',
  },
})
export class HlmDropdownMenuCheckbox {
  protected readonly _cdkMenuItem = inject(HlmDropdownMenuCheckboxCdk);

  public readonly inset = input<boolean, BooleanInput>(false, {
    transform: booleanAttribute,
  });

  constructor() {
    classes(
      () =>
        "tw:hover:bg-accent tw:focus:bg-accent tw:hover:text-accent-foreground tw:focus:text-accent-foreground tw:gap-2 tw:rounded-sm tw:py-1.5 tw:ps-2 tw:pe-8 tw:text-sm tw:data-inset:ps-8 tw:[&_ng-icon:not([class*='text-'])]:text-[length:--spacing(4)] tw:group/dropdown-menu-checkbox tw:relative tw:flex tw:w-full tw:cursor-default tw:items-center tw:outline-hidden tw:select-none tw:data-disabled:pointer-events-none tw:data-disabled:opacity-50 tw:[&_ng-icon]:pointer-events-none tw:[&_ng-icon]:shrink-0",
    );
  }
}
