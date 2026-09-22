import { Directive, inject, input } from '@angular/core';
import { classes } from '@egose/shadcn-theme-ng/utils';
import { HlmSidebarService } from './hlm-sidebar.service';

@Directive({
  selector: 'button[hlmSidebarRail]',
  host: {
    'data-sidebar': 'rail',
    'data-slot': 'sidebar-rail',
    '[attr.aria-label]': 'ariaLabel()',
    tabindex: '-1',
    '(click)': 'onClick()',
  },
})
export class HlmSidebarRail {
  private readonly _sidebarService = inject(HlmSidebarService);

  public readonly ariaLabel = input<string>('Toggle Sidebar', { alias: 'aria-label' });

  constructor() {
    classes(() => [
      'tw:hover:after:bg-sidebar-border tw:absolute tw:inset-y-0 tw:z-20 tw:hidden tw:w-4 tw:transition-all tw:ease-linear tw:group-data-[side=left]:-right-4 tw:group-data-[side=right]:left-0 tw:after:absolute tw:after:inset-y-0 tw:after:start-1/2 tw:after:w-[2px] tw:sm:flex tw:ltr:-translate-x-1/2 tw:rtl:-translate-x-1/2',
      'tw:in-data-[side=left]:cursor-w-resize tw:in-data-[side=right]:cursor-e-resize',
      'tw:[[data-side=left][data-state=collapsed]_&]:cursor-e-resize tw:[[data-side=right][data-state=collapsed]_&]:cursor-w-resize',
      'tw:hover:group-data-[collapsible=offcanvas]:bg-sidebar tw:group-data-[collapsible=offcanvas]:translate-x-0 tw:group-data-[collapsible=offcanvas]:after:left-full',
      'tw:[[data-side=left][data-collapsible=offcanvas]_&]:-right-2',
      'tw:[[data-side=right][data-collapsible=offcanvas]_&]:-left-2',
    ]);
  }

  protected onClick(): void {
    this._sidebarService.toggleSidebar();
  }
}
