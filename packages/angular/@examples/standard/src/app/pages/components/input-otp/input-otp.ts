import { Component } from '@angular/core';
import { DemoHeaderComponent } from '../../../shared/demo-header';
import { BrnInputOtp } from '@spartan-ng/brain/input-otp';
import { HlmInputOtpImports } from '@egose/shadcn-theme-ng/input-otp';

@Component({
  selector: 'app-input-otp-page',
  imports: [DemoHeaderComponent, BrnInputOtp, HlmInputOtpImports],
  template: `
    <app-demo-header
      title="Input OTP"
      description="A six-digit verification code input with a visible label bound to the code group."
    />

    <div class="tw:grid tw:gap-2">
      <label for="otp-code" class="tw:text-sm tw:font-medium tw:text-slate-700">Verification code</label>
      <brn-input-otp hlmInputOtp [length]="6" inputId="otp-code">
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
    </div>
  `,
})
export class InputOtpPage {}
