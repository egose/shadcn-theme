import { type BooleanInput } from '@angular/cdk/coercion';
import { booleanAttribute, computed, Directive, effect, inject, input } from '@angular/core';
import { BrnTooltip, BrnTooltipPosition, provideBrnTooltipDefaultOptions } from '@spartan-ng/brain/tooltip';
import {
  DEFAULT_TOOLTIP_CONTENT_CLASSES,
  DEFAULT_TOOLTIP_SVG_CLASS,
  tooltipPositionVariants,
} from '@egose/shadcn-theme-ng/tooltip';
import { classes, hlm } from '@egose/shadcn-theme-ng/utils';
import { cva } from 'class-variance-authority';
import { HlmSidebarService } from './hlm-sidebar.service';
import { injectHlmSidebarConfig } from './hlm-sidebar.token';

const sidebarMenuButtonVariants = cva(
  'tw:ring-sidebar-ring tw:hover:bg-sidebar-accent tw:hover:text-sidebar-accent-foreground tw:active:bg-sidebar-accent tw:active:text-sidebar-accent-foreground tw:data-active:bg-sidebar-accent tw:data-active:text-sidebar-accent-foreground tw:data-open:hover:bg-sidebar-accent tw:data-open:hover:text-sidebar-accent-foreground tw:gap-2 tw:rounded-md tw:p-2 tw:text-start tw:text-sm tw:transition-[width,height,padding] tw:group-has-data-[sidebar=menu-action]/menu-item:pe-8 tw:group-data-[collapsible=icon]:size-8! tw:group-data-[collapsible=icon]:p-2! tw:focus-visible:ring-2 tw:data-active:font-medium tw:peer/menu-button tw:group/menu-button tw:flex tw:w-full tw:items-center tw:overflow-hidden tw:outline-hidden tw:disabled:pointer-events-none tw:disabled:opacity-50 tw:aria-disabled:pointer-events-none tw:aria-disabled:opacity-50 tw:[&_ng-icon]:shrink-0 tw:[&_ng-icon]:text-[length:--spacing(4)] tw:[&>span:last-child]:truncate',
  {
    variants: {
      variant: {
        default: 'tw:hover:bg-sidebar-accent tw:hover:text-sidebar-accent-foreground',
        outline:
          'tw:bg-background tw:hover:bg-sidebar-accent tw:hover:text-sidebar-accent-foreground tw:shadow-[0_0_0_1px_var(--sidebar-border)] tw:hover:shadow-[0_0_0_1px_var(--sidebar-accent)]',
      },
      size: {
        default: 'tw:h-8 tw:text-sm',
        sm: 'tw:h-7 tw:text-xs',
        lg: 'tw:h-12 tw:text-sm tw:group-data-[collapsible=icon]:p-0!',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

@Directive({
  selector: 'button[hlmSidebarMenuButton], a[hlmSidebarMenuButton]',
  providers: [
    provideBrnTooltipDefaultOptions({
      showDelay: 150,
      hideDelay: 0,
      tooltipContentClasses: DEFAULT_TOOLTIP_CONTENT_CLASSES,
      svgClasses: DEFAULT_TOOLTIP_SVG_CLASS,
      arrowClasses: (position: BrnTooltipPosition) => hlm(tooltipPositionVariants({ position })),
      position: 'right',
    }),
  ],
  hostDirectives: [
    {
      directive: BrnTooltip,
      inputs: ['brnTooltip: tooltip'],
    },
  ],
  host: {
    'data-slot': 'sidebar-menu-button',
    'data-sidebar': 'menu-button',
    '[attr.data-size]': 'size()',
    '[attr.data-active]': 'isActive()',
    '(click)': 'onClick()',
  },
})
export class HlmSidebarMenuButton {
  private readonly _config = injectHlmSidebarConfig();
  private readonly _sidebarService = inject(HlmSidebarService);
  private readonly _brnTooltip = inject(BrnTooltip);

  public readonly variant = input<'default' | 'outline'>('default');
  public readonly size = input<'default' | 'sm' | 'lg'>('default');
  public readonly isActive = input<boolean, BooleanInput>(false, { transform: booleanAttribute });
  public readonly closeMobileSidebarOnClick = input<boolean, BooleanInput>(
    this._config.closeMobileSidebarOnMenuButtonClick,
    { transform: booleanAttribute },
  );

  protected readonly _isTooltipHidden = computed(
    () => this._sidebarService.state() !== 'collapsed' || this._sidebarService.isMobile(),
  );

  constructor() {
    classes(() => sidebarMenuButtonVariants({ variant: this.variant(), size: this.size() }));
    effect(() => this._brnTooltip.mutableTooltipDisabled.set(this._isTooltipHidden()));
  }

  protected onClick(): void {
    if (this.closeMobileSidebarOnClick()) {
      this._sidebarService.setOpenMobile(false);
    }
  }
}
