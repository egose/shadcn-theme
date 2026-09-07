'use client';

import * as React from 'react';

import { ExamplePage, ExampleSection, ExampleStack } from '@/components/showcase-shell';
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from '@egose/shadcn-theme/components/ui/input-otp';

export default function InputOTPShowcase() {
  const [otp, setOtp] = React.useState('');

  return (
    <ExamplePage
      title="Input OTP"
      description="OTP inputs segment verification codes while preserving keyboard-friendly entry."
    >
      <ExampleSection
        title="Verification code"
        description="The controlled value below mirrors the currently entered code."
      >
        <ExampleStack>
          <InputOTP maxLength={6} value={otp} onChange={setOtp}>
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
            </InputOTPGroup>
            <InputOTPSeparator />
            <InputOTPGroup>
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
          <p className="text-sm text-muted-foreground">Current value: {otp || 'empty'}</p>
        </ExampleStack>
      </ExampleSection>
    </ExamplePage>
  );
}
