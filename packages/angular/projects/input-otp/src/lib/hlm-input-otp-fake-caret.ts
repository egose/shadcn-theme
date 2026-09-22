import { ChangeDetectionStrategy, Component } from '@angular/core';
import { classes } from '@egose/shadcn-theme-ng/utils';

@Component({
  selector: 'hlm-input-otp-fake-caret',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: ` <div class="tw:animate-caret-blink tw:bg-foreground tw:h-4 tw:w-px tw:duration-1000"></div> `,
})
export class HlmInputOtpFakeCaret {
  constructor() {
    classes(() => 'tw:pointer-events-none tw:absolute tw:inset-0 tw:flex tw:items-center tw:justify-center');
  }
}
