import { inject, InjectionToken, type ValueProvider } from '@angular/core';

export interface EgFormPhoneInputConfig {
  /**
   * Global class defaults for `eg-form-phone-input` styling slots.
   * Each is merged under the matching per-instance `*Class` input
   * (library base < global config < per-instance).
   */
  labelClass?: string;
  inputClass?: string;
  errorClass?: string;
  hintClass?: string;
}

const EgFormPhoneInputConfigToken = new InjectionToken<EgFormPhoneInputConfig>('EgFormPhoneInputConfig');

export function provideEgFormPhoneInputConfig(config: Partial<EgFormPhoneInputConfig>): ValueProvider {
  return { provide: EgFormPhoneInputConfigToken, useValue: { ...config } };
}

export function injectEgFormPhoneInputConfig(): EgFormPhoneInputConfig {
  return inject(EgFormPhoneInputConfigToken, { optional: true }) ?? {};
}
