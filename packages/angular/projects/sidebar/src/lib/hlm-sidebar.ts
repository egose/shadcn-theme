import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, effect, inject, input } from '@angular/core';
import { BrnSheetImports } from '@spartan-ng/brain/sheet';
import { HlmSheetImports } from '@egose/shadcn-theme-ng/sheet';
import { classes, hlm } from '@egose/shadcn-theme-ng/utils';
import type { ClassValue } from 'clsx';
import { HlmSidebarService, type SidebarVariant } from './hlm-sidebar.service';
import { injectHlmSidebarConfig } from './hlm-sidebar.token';

@Component({
  selector: 'hlm-sidebar',
  imports: [NgTemplateOutlet, BrnSheetImports, HlmSheetImports],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.data-slot]': '_dataSlot()',
    '[attr.data-state]': '_dataState()',
    '[attr.data-collapsible]': '_dataCollapsible()',
    '[attr.data-variant]': '_dataVariant()',
    '[attr.data-side]': '_dataSide()',
  },
  template: `
    <ng-template #contentContainer>
      <ng-content />
    </ng-template>

    @if (collapsible() === 'none') {
      <ng-container *ngTemplateOutlet="contentContainer"></ng-container>
    } @else if (_sidebarService.isMobile()) {
      <hlm-sheet
        [side]="side()"
        [state]="_sidebarService.openMobile() ? 'open' : 'closed'"
        (stateChanged)="_sidebarService.setOpenMobile($event === 'open')"
      >
        <hlm-sheet-content
          *brnSheetContent="let ctx"
          data-slot="sidebar"
          data-sidebar="sidebar"
          data-mobile="true"
          class="tw:bg-sidebar tw:text-sidebar-foreground tw:h-svh tw:w-(--sidebar-width) tw:p-0 tw:[&>button]:hidden"
          [style.--sidebar-width]="sidebarWidthMobile()"
        >
          <div class="tw:flex tw:h-full tw:w-full tw:flex-col">
            <ng-container *ngTemplateOutlet="contentContainer" />
          </div>
        </hlm-sheet-content>
      </hlm-sheet>
    } @else {
      <!-- Sidebar gap on desktop -->
      <div data-slot="sidebar-gap" [class]="_sidebarGapComputedClass()"></div>
      <div data-slot="sidebar-container" [attr.data-side]="_dataSide()" [class]="_sidebarContainerComputedClass()">
        <div
          data-sidebar="sidebar"
          data-slot="sidebar-inner"
          class="tw:bg-sidebar tw:group-data-[variant=floating]:ring-sidebar-border tw:group-data-[variant=floating]:rounded-lg tw:group-data-[variant=floating]:shadow-sm tw:group-data-[variant=floating]:ring-1 tw:flex tw:size-full tw:flex-col"
        >
          <ng-container *ngTemplateOutlet="contentContainer" />
        </div>
      </div>
    }
  `,
})
export class HlmSidebar {
  protected readonly _sidebarService = inject(HlmSidebarService);
  private readonly _config = injectHlmSidebarConfig();
  public readonly sidebarWidthMobile = input<string>(this._config.sidebarWidthMobile);

  public readonly side = input<'left' | 'right'>('left');
  public readonly variant = input<SidebarVariant>(this._sidebarService.variant());
  public readonly collapsible = input<'offcanvas' | 'icon' | 'none'>('offcanvas');

  protected readonly _sidebarGapComputedClass = computed(() =>
    hlm(
      'tw:transition-[width] tw:duration-200 tw:ease-linear tw:relative tw:w-(--sidebar-width) tw:bg-transparent',
      'tw:group-data-[collapsible=offcanvas]:w-0',
      'tw:group-data-[side=right]:rotate-180',
      this.variant() === 'floating' || this.variant() === 'inset'
        ? 'tw:group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4)))]'
        : 'tw:group-data-[collapsible=icon]:w-(--sidebar-width-icon)',
    ),
  );

  public readonly sidebarContainerClass = input<ClassValue>('');
  protected readonly _sidebarContainerComputedClass = computed(() =>
    hlm(
      'tw:fixed tw:inset-y-0 tw:z-10 tw:hidden tw:h-svh tw:w-(--sidebar-width) tw:transition-[left,right,width] tw:duration-200 tw:ease-linear tw:data-[side=left]:left-0 tw:data-[side=left]:group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)] tw:data-[side=right]:right-0 tw:data-[side=right]:group-data-[collapsible=offcanvas]:right-[calc(var(--sidebar-width)*-1)] tw:md:flex',
      this.variant() === 'floating' || this.variant() === 'inset'
        ? 'tw:p-2 tw:group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4))+2px)]'
        : 'tw:group-data-[collapsible=icon]:w-(--sidebar-width-icon) tw:group-data-[side=left]:border-r tw:group-data-[side=right]:border-l',
      this.sidebarContainerClass(),
    ),
  );

  protected readonly _dataSlot = computed(() => {
    return !this._sidebarService.isMobile() ? 'sidebar' : undefined;
  });

  private readonly _collapsibleAndNonMobile = computed(() => {
    return this.collapsible() !== 'none' && !this._sidebarService.isMobile();
  });

  protected readonly _dataState = computed(() => {
    return this._collapsibleAndNonMobile() ? this._sidebarService.state() : undefined;
  });

  protected readonly _dataCollapsible = computed(() => {
    if (this._collapsibleAndNonMobile()) {
      return this._sidebarService.state() === 'collapsed' ? this.collapsible() : '';
    }
    return undefined;
  });

  protected readonly _dataVariant = computed(() => {
    return this._collapsibleAndNonMobile() ? this.variant() : undefined;
  });

  protected readonly _dataSide = computed(() => {
    return this._collapsibleAndNonMobile() ? this.side() : undefined;
  });

  constructor() {
    // Sync variant input with service
    effect(() => {
      this._sidebarService.setVariant(this.variant());
    });

    classes(() => {
      if (this.collapsible() === 'none') {
        return hlm('tw:bg-sidebar tw:text-sidebar-foreground tw:flex tw:h-svh tw:w-(--sidebar-width) tw:flex-col');
      } else if (this._sidebarService.isMobile()) {
        return '';
      } else {
        return hlm('tw:group tw:peer tw:text-sidebar-foreground tw:hidden tw:md:block');
      }
    });
  }
}
