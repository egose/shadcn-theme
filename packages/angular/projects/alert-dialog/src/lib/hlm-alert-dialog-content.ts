import { Directive, input, signal } from '@angular/core';
import { injectExposesStateProvider } from '@spartan-ng/brain/core';
import { classes } from '@egose/shadcn-theme-ng/utils';

@Directive({
  selector: '[hlmAlertDialogContent],hlm-alert-dialog-content',
  host: {
    'data-slot': 'alert-dialog-content',
    '[attr.data-state]': 'state()',
    '[attr.data-size]': 'size()',
  },
})
export class HlmAlertDialogContent {
  private readonly _stateProvider = injectExposesStateProvider({ optional: true, host: true });
  public readonly state = this._stateProvider?.state ?? signal('closed');

  public readonly size = input<'sm' | 'default'>('default');

  constructor() {
    classes(
      () =>
        'tw:data-open:animate-in tw:data-closed:animate-out data-closed:fade-out-0 data-open:fade-in-0 tw:data-closed:zoom-out-95 tw:data-open:zoom-in-95 tw:bg-popover tw:text-popover-foreground tw:ring-foreground/10 tw:gap-6 tw:rounded-xl tw:p-6 tw:ring-1 tw:duration-100 tw:data-[size=default]:max-w-xs tw:data-[size=sm]:max-w-xs tw:data-[size=default]:sm:max-w-lg tw:group/alert-dialog-content tw:grid tw:w-full tw:outline-none',
    );
  }
}
