import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { injectExposedSideProvider, injectExposesStateProvider } from '@spartan-ng/brain/core';
import { BrnDrawerHandle } from '@spartan-ng/brain/drawer';
import { classes } from '@egose/shadcn-theme-ng/utils';

@Component({
  selector: 'hlm-drawer-content',
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [{ directive: BrnDrawerHandle, inputs: ['closeThreshold'] }],
  host: {
    'data-slot': 'drawer-content',
    '[attr.data-vaul-drawer-direction]': '_sideProvider.side()',
    '[attr.data-state]': 'state()',
  },
  template: `
    <div
      class="tw:bg-muted tw:mx-auto tw:mt-4 tw:hidden tw:h-1.5 tw:w-[100px] tw:shrink-0 tw:rounded-full tw:group-data-[vaul-drawer-direction=bottom]/drawer-content:block"
    ></div>
    <ng-content />
  `,
})
export class HlmDrawerContent {
  private readonly _stateProvider = injectExposesStateProvider({ host: true });
  protected readonly _sideProvider = injectExposedSideProvider({ host: true });
  public readonly state = this._stateProvider.state ?? signal('closed');

  constructor() {
    classes(() => [
      'tw:bg-background tw:fixed tw:z-50 tw:flex tw:h-auto tw:flex-col tw:text-sm tw:data-[vaul-drawer-direction=bottom]:inset-x-0 tw:data-[vaul-drawer-direction=bottom]:bottom-0 tw:data-[vaul-drawer-direction=bottom]:mt-24 tw:data-[vaul-drawer-direction=bottom]:max-h-[80vh] tw:data-[vaul-drawer-direction=bottom]:rounded-t-xl tw:data-[vaul-drawer-direction=bottom]:border-t tw:data-[vaul-drawer-direction=left]:inset-y-0 tw:data-[vaul-drawer-direction=left]:left-0 tw:data-[vaul-drawer-direction=left]:w-3/4 tw:data-[vaul-drawer-direction=left]:rounded-r-xl tw:data-[vaul-drawer-direction=left]:border-r tw:data-[vaul-drawer-direction=right]:inset-y-0 tw:data-[vaul-drawer-direction=right]:right-0 tw:data-[vaul-drawer-direction=right]:w-3/4 tw:data-[vaul-drawer-direction=right]:rounded-l-xl tw:data-[vaul-drawer-direction=right]:border-l tw:data-[vaul-drawer-direction=top]:inset-x-0 tw:data-[vaul-drawer-direction=top]:top-0 tw:data-[vaul-drawer-direction=top]:mb-24 tw:data-[vaul-drawer-direction=top]:max-h-[80vh] tw:data-[vaul-drawer-direction=top]:rounded-b-xl tw:data-[vaul-drawer-direction=top]:border-b tw:data-[vaul-drawer-direction=left]:sm:max-w-sm tw:data-[vaul-drawer-direction=right]:sm:max-w-sm',
      'tw:group/drawer-content',
      'tw:data-open:animate-in tw:data-closed:animate-out',
      'data-[vaul-drawer-direction=bottom]:data-closed:slide-out-to-bottom data-[vaul-drawer-direction=bottom]:data-open:slide-in-from-bottom',
      'data-[vaul-drawer-direction=top]:data-closed:slide-out-to-top data-[vaul-drawer-direction=top]:data-open:slide-in-from-top',
      'data-[vaul-drawer-direction=left]:data-closed:slide-out-to-left data-[vaul-drawer-direction=left]:data-open:slide-in-from-left',
      'data-[vaul-drawer-direction=right]:data-closed:slide-out-to-right data-[vaul-drawer-direction=right]:data-open:slide-in-from-right',
    ]);
  }
}
