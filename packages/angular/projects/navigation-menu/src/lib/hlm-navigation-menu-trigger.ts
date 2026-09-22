import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronDown } from '@ng-icons/lucide';
import { BrnNavigationMenuTrigger } from '@spartan-ng/brain/navigation-menu';
import { classes } from '@egose/shadcn-theme-ng/utils';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'button[hlmNavigationMenuTrigger]',
  imports: [NgIcon],
  providers: [provideIcons({ lucideChevronDown })],
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [{ directive: BrnNavigationMenuTrigger, inputs: ['align'] }],
  host: { 'data-slot': 'navigation-menu-trigger' },
  template: `
    <ng-content />
    <ng-icon
      name="lucideChevronDown"
      class="tw:relative tw:top-px tw:ml-1 tw:size-3 tw:transition tw:duration-300 tw:group-data-open/navigation-menu-trigger:rotate-180 tw:group-data-popup-open/navigation-menu-trigger:rotate-180"
    />
  `,
})
export class HlmNavigationMenuTrigger {
  constructor() {
    classes(
      () =>
        'tw:bg-background tw:hover:bg-muted tw:focus:bg-muted tw:data-open:hover:bg-muted tw:data-open:focus:bg-muted tw:data-open:bg-muted/50 tw:focus-visible:ring-ring/50 tw:rounded-md tw:px-4 tw:py-2 tw:text-sm tw:font-medium tw:transition-all tw:focus-visible:ring-3 tw:focus-visible:outline-1 tw:disabled:opacity-50 tw:group/navigation-menu-trigger tw:inline-flex tw:h-9 tw:w-max tw:items-center tw:justify-center tw:outline-none tw:disabled:pointer-events-none',
    );
  }
}
