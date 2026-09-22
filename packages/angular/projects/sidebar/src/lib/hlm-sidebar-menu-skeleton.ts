import { type BooleanInput } from '@angular/cdk/coercion';
import { booleanAttribute, ChangeDetectionStrategy, Component, input } from '@angular/core';
import { HlmSkeletonImports } from '@egose/shadcn-theme-ng/skeleton';
import { classes } from '@egose/shadcn-theme-ng/utils';

@Component({
  selector: 'hlm-sidebar-menu-skeleton,div[hlmSidebarMenuSkeleton]',
  imports: [HlmSkeletonImports],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'data-slot': 'sidebar-menu-skeleton',
    'data-sidebar': 'menu-skeleton',
  },
  template: `
    @if (showIcon()) {
      <hlm-skeleton data-sidebar="menu-skeleton-icon" class="tw:size-4 tw:rounded-md" />
    } @else {
      <hlm-skeleton
        data-sidebar="menu-skeleton-text"
        class="tw:h-4 tw:max-w-(--skeleton-width) tw:flex-1"
        [style.--skeleton-width]="_width"
      />
    }
  `,
})
export class HlmSidebarMenuSkeleton {
  public readonly showIcon = input<boolean, BooleanInput>(false, { transform: booleanAttribute });
  protected readonly _width = `${Math.floor(Math.random() * 40) + 50}%`;

  constructor() {
    classes(() => 'tw:h-8 tw:gap-2 tw:rounded-md tw:px-2 tw:flex tw:items-center');
  }
}
