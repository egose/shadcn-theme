import { Directive, input } from '@angular/core';
import { classes } from '@egose/shadcn-theme-ng/utils';
import { injectHlmSidebarConfig } from './hlm-sidebar.token';

@Directive({
  selector: '[hlmSidebarWrapper],hlm-sidebar-wrapper',
  host: {
    'data-slot': 'sidebar-wrapper',
    '[style.--sidebar-width]': 'sidebarWidth()',
    '[style.--sidebar-width-icon]': 'sidebarWidthIcon()',
  },
})
export class HlmSidebarWrapper {
  private readonly _config = injectHlmSidebarConfig();

  public readonly sidebarWidth = input<string>(this._config.sidebarWidth);
  public readonly sidebarWidthIcon = input<string>(this._config.sidebarWidthIcon);

  constructor() {
    classes(() => 'tw:group/sidebar-wrapper tw:has-data-[variant=inset]:bg-sidebar tw:flex tw:min-h-svh tw:w-full');
  }
}
