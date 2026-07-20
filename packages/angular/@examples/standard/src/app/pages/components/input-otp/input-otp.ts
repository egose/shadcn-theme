import { Component } from '@angular/core';
import { BrnInputOtp } from '@spartan-ng/brain/input-otp';
import { HlmInputOtpImports } from '@egose/shadcn-theme-ng/input-otp';

@Component({
  selector: 'app-input-otp-page',
  imports: [BrnInputOtp, HlmInputOtpImports],
  template: `
    <h3 class="tw:text-2xl tw:font-bold tw:mb-2">Input OTP</h3>
    <p class="tw:text-gray-500 tw:mb-4">One-time password input.</p>

    <brn-input-otp hlmInputOtp maxLength="6">
      <div hlmInputOtpGroup>
        <hlm-input-otp-slot index="0" />
        <hlm-input-otp-slot index="1" />
        <hlm-input-otp-slot index="2" />
      </div>
      <hlm-input-otp-separator />
      <div hlmInputOtpGroup>
        <hlm-input-otp-slot index="3" />
        <hlm-input-otp-slot index="4" />
        <hlm-input-otp-slot index="5" />
      </div>
    </brn-input-otp>
  `,
})
export class InputOtpPage {}
