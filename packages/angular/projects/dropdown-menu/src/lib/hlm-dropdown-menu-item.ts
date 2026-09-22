import { type BooleanInput } from '@angular/cdk/coercion';
import { CdkMenuItem } from '@angular/cdk/menu';
import { booleanAttribute, Directive, HOST_TAG_NAME, inject, input } from '@angular/core';
import { classes } from '@egose/shadcn-theme-ng/utils';
import { HlmDropdownMenuFocusOnHover } from './hlm-dropdown-menu-focus-on-hover';

@Directive({
  selector: '[hlmDropdownMenuItem],hlm-dropdown-menu-item',
  hostDirectives: [
    {
      directive: CdkMenuItem,
      inputs: ['cdkMenuItemDisabled: disabled'],
      outputs: ['cdkMenuItemTriggered: triggered'],
    },
    HlmDropdownMenuFocusOnHover,
  ],
  host: {
    'data-slot': 'dropdown-menu-item',
    '[attr.disabled]': '_isButton && disabled() ? "" : null',
    '[attr.data-disabled]': 'disabled() ? "" : null',
    '[attr.data-variant]': 'variant()',
    '[attr.data-inset]': 'inset() ? "" : null',
  },
})
export class HlmDropdownMenuItem {
  protected readonly _isButton = inject(HOST_TAG_NAME) === 'button';

  public readonly disabled = input<boolean, BooleanInput>(false, { transform: booleanAttribute });

  public readonly variant = input<'default' | 'destructive'>('default');

  public readonly inset = input<boolean, BooleanInput>(false, {
    transform: booleanAttribute,
  });

  constructor() {
    classes(
      () =>
        "tw:hover:bg-accent tw:focus:bg-accent tw:hover:text-accent-foreground tw:focus:text-accent-foreground tw:data-[variant=destructive]:text-destructive tw:data-[variant=destructive]:hover:bg-destructive/10 tw:data-[variant=destructive]:focus:bg-destructive/10 tw:dark:data-[variant=destructive]:hover:bg-destructive/20 tw:dark:data-[variant=destructive]:focus:bg-destructive/20 tw:data-[variant=destructive]:hover:text-destructive tw:data-[variant=destructive]:focus:text-destructive tw:data-[variant=destructive]:*:[ng-icon]:text-destructive tw:not-data-[variant=destructive]:hover:**:text-accent-foreground tw:not-data-[variant=destructive]:focus:**:text-accent-foreground tw:gap-2 tw:rounded-sm tw:px-2 tw:py-1.5 tw:text-sm tw:data-inset:ps-8 tw:[&_ng-icon:not([class*='text-'])]:text-[length:--spacing(4)] tw:group/dropdown-menu-item tw:relative tw:flex tw:w-full tw:cursor-default tw:items-center tw:outline-hidden tw:select-none tw:data-disabled:pointer-events-none tw:data-disabled:opacity-50 tw:[&_ng-icon]:pointer-events-none tw:[&_ng-icon]:shrink-0",
    );
  }
}
