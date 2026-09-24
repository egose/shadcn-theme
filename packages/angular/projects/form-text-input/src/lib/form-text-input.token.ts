import { inject, InjectionToken, type ValueProvider } from '@angular/core';

export interface EgFormTextInputConfig {
  /**
   * Global class defaults for `eg-form-text-input` styling slots.
   * Each is merged under the matching per-instance `*Class` input
   * (library base < global config < per-instance).
   */
  labelClass?: string;
  inputClass?: string;
  errorClass?: string;
  hintClass?: string;
}

const EgFormTextInputConfigToken = new InjectionToken<EgFormTextInputConfig>('EgFormTextInputConfig');

export function provideEgFormTextInputConfig(config: Partial<EgFormTextInputConfig>): ValueProvider {
  return { provide: EgFormTextInputConfigToken, useValue: { ...config } };
}

export function injectEgFormTextInputConfig(): EgFormTextInputConfig {
  return inject(EgFormTextInputConfigToken, { optional: true }) ?? {};
}
