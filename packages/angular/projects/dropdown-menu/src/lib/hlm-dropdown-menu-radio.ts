import { type BooleanInput } from '@angular/cdk/coercion';
import { CdkMenuItem, CdkMenuItemRadio, CdkMenuItemSelectable } from '@angular/cdk/menu';
import { Directive, booleanAttribute, inject, input } from '@angular/core';
import { classes } from '@egose/shadcn-theme-ng/utils';
import { HlmDropdownMenuFocusOnHover } from './hlm-dropdown-menu-focus-on-hover';

/** @internal. Use HlmDropdownMenuRadio instead. */
@Directive({
  selector: '[hlmDropdownMenuRadioCdk]',
  providers: [
    { provide: CdkMenuItemRadio, useExisting: HlmDropdownMenuRadioCdk },
    { provide: CdkMenuItemSelectable, useExisting: HlmDropdownMenuRadioCdk },
    { provide: CdkMenuItem, useExisting: CdkMenuItemSelectable },
  ],
})
export class HlmDropdownMenuRadioCdk extends CdkMenuItemRadio {
  public readonly keepOpen = input<boolean, BooleanInput>(true, { transform: booleanAttribute });

  public override trigger(options?: { keepOpen: boolean }) {
    super.trigger({ ...options, keepOpen: this.keepOpen() });
  }
}

@Directive({
  selector: '[hlmDropdownMenuRadio]',
  hostDirectives: [
    {
      directive: HlmDropdownMenuRadioCdk,
      inputs: ['cdkMenuItemDisabled: disabled', 'cdkMenuItemChecked: checked', 'keepOpen'],
      outputs: ['cdkMenuItemTriggered: triggered'],
    },
    HlmDropdownMenuFocusOnHover,
  ],
  host: {
    'data-slot': 'dropdown-menu-radio-item',
    '[attr.data-disabled]': '_cdkMenuItem.disabled ? "" : null',
    '[attr.data-checked]': '_cdkMenuItem.checked ? "" : null',
  },
})
export class HlmDropdownMenuRadio {
  protected readonly _cdkMenuItem = inject(HlmDropdownMenuRadioCdk);

  constructor() {
    classes(
      () =>
        "tw:hover:bg-accent tw:focus:bg-accent tw:hover:text-accent-foreground tw:focus:text-accent-foreground tw:gap-2 tw:rounded-sm tw:py-1.5 tw:ps-2 tw:pe-8 tw:text-sm tw:data-inset:ps-8 tw:[&_ng-icon:not([class*='text-'])]:text-[length:--spacing(4)] tw:group/dropdown-menu-radio tw:relative tw:flex tw:w-full tw:cursor-default tw:items-center tw:outline-hidden tw:select-none tw:data-disabled:pointer-events-none tw:data-disabled:opacity-50 tw:[&_ng-icon]:pointer-events-none tw:[&_ng-icon]:shrink-0",
    );
  }
}
