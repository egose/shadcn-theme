import { inject, InjectionToken, type ValueProvider } from '@angular/core';

export interface EgFormToggleConfig {
  /**
   * Global class defaults for `eg-form-toggle` styling slots.
   * Each is merged under the matching per-instance `*Class` input
   * (library base < global config < per-instance).
   */
  toggleClass?: string;
  labelClass?: string;
  errorClass?: string;
  hintClass?: string;
}

const EgFormToggleConfigToken = new InjectionToken<EgFormToggleConfig>('EgFormToggleConfig');

export function provideEgFormToggleConfig(config: Partial<EgFormToggleConfig>): ValueProvider {
  return { provide: EgFormToggleConfigToken, useValue: { ...config } };
}

export function injectEgFormToggleConfig(): EgFormToggleConfig {
  return inject(EgFormToggleConfigToken, { optional: true }) ?? {};
}
