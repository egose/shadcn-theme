import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideEllipsis } from '@ng-icons/lucide';
import { classes } from '@egose/shadcn-theme-ng/utils';

@Component({
  selector: 'hlm-breadcrumb-ellipsis',
  imports: [NgIcon],
  providers: [provideIcons({ lucideEllipsis })],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'data-slot': 'breadcrumb-ellipsis',
    role: 'presentation',
  },
  template: `
    <ng-icon name="lucideEllipsis" />
    <span class="tw:sr-only">{{ srOnlyText() }}</span>
  `,
})
export class HlmBreadcrumbEllipsis {
  /** Screen reader only text for the ellipsis */
  public readonly srOnlyText = input<string>('More');

  constructor() {
    classes(() => 'tw:size-5 tw:[&>ng-icon]:text-[length:--spacing(4)] tw:flex tw:items-center tw:justify-center');
  }
}
