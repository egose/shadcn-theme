import { Directive } from '@angular/core';
import { classes } from '@egose/shadcn-theme-ng/utils';

@Directive({
  selector: 'brn-input-otp[hlmInputOtp], brn-input-otp[hlm]',
  host: { 'data-slot': 'input-otp' },
})
export class HlmInputOtp {
  constructor() {
    classes(() => 'tw:gap-2 tw:flex tw:items-center tw:has-disabled:opacity-50');
  }
}
