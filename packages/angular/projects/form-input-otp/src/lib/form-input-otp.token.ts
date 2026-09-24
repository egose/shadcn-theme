import { inject, InjectionToken, type ValueProvider } from '@angular/core';

export interface EgFormInputOtpConfig {
  /**
   * Global class defaults for `eg-form-input-otp` styling slots.
   * Each is merged under the matching per-instance `*Class` input
   * (library base < global config < per-instance).
   */
  labelClass?: string;
  otpClass?: string;
  errorClass?: string;
  hintClass?: string;
}

const EgFormInputOtpConfigToken = new InjectionToken<EgFormInputOtpConfig>('EgFormInputOtpConfig');

export function provideEgFormInputOtpConfig(config: Partial<EgFormInputOtpConfig>): ValueProvider {
  return { provide: EgFormInputOtpConfigToken, useValue: { ...config } };
}

export function injectEgFormInputOtpConfig(): EgFormInputOtpConfig {
  return inject(EgFormInputOtpConfigToken, { optional: true }) ?? {};
}
