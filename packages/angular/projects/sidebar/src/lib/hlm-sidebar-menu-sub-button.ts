import { type BooleanInput } from '@angular/cdk/coercion';
import { booleanAttribute, Directive, inject, input } from '@angular/core';
import { classes } from '@egose/shadcn-theme-ng/utils';
import { HlmSidebarService } from './hlm-sidebar.service';
import { injectHlmSidebarConfig } from './hlm-sidebar.token';

@Directive({
  selector: 'a[hlmSidebarMenuSubButton], button[hlmSidebarMenuSubButton]',
  host: {
    'data-slot': 'sidebar-menu-sub-button',
    'data-sidebar': 'menu-sub-button',
    '[attr.data-active]': 'isActive()',
    '[attr.data-size]': 'size()',
    '(click)': 'onClick()',
  },
})
export class HlmSidebarMenuSubButton {
  private readonly _sidebarService = inject(HlmSidebarService);
  private readonly _config = injectHlmSidebarConfig();

  public readonly closeMobileSidebarOnClick = input<boolean, BooleanInput>(
    this._config.closeMobileSidebarOnMenuButtonClick,
    { transform: booleanAttribute },
  );

  public readonly size = input<'sm' | 'md'>('md');
  public readonly isActive = input<boolean, BooleanInput>(false, { transform: booleanAttribute });

  constructor() {
    classes(
      () =>
        'tw:text-sidebar-foreground tw:ring-sidebar-ring tw:hover:bg-sidebar-accent tw:hover:text-sidebar-accent-foreground tw:active:bg-sidebar-accent tw:active:text-sidebar-accent-foreground tw:[&>svg]:text-sidebar-accent-foreground tw:data-active:bg-sidebar-accent tw:data-active:text-sidebar-accent-foreground tw:h-7 tw:gap-2 tw:rounded-md tw:px-2 tw:focus-visible:ring-2 tw:data-[size=md]:text-sm tw:data-[size=sm]:text-xs tw:[&>ng-icon]:text-[length:--spacing(4)] tw:flex tw:min-w-0 tw:-translate-x-px tw:items-center tw:overflow-hidden tw:outline-hidden tw:group-data-[collapsible=icon]:hidden tw:disabled:pointer-events-none tw:disabled:opacity-50 tw:aria-disabled:pointer-events-none tw:aria-disabled:opacity-50 tw:[&>ng-icon]:shrink-0 tw:[&>span:last-child]:truncate',
    );
  }

  protected onClick(): void {
    if (this.closeMobileSidebarOnClick()) {
      this._sidebarService.setOpenMobile(false);
    }
  }
}
