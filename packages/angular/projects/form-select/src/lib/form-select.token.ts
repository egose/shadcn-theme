import { inject, InjectionToken, type ValueProvider } from '@angular/core';

export interface EgFormSelectConfig {
  /**
   * Global class defaults for `eg-form-select` styling slots.
   * Each is merged under the matching per-instance `*Class` input
   * (library base < global config < per-instance).
   */
  labelClass?: string;
  selectClass?: string;
  errorClass?: string;
  hintClass?: string;
}

const EgFormSelectConfigToken = new InjectionToken<EgFormSelectConfig>('EgFormSelectConfig');

export function provideEgFormSelectConfig(config: Partial<EgFormSelectConfig>): ValueProvider {
  return { provide: EgFormSelectConfigToken, useValue: { ...config } };
}

export function injectEgFormSelectConfig(): EgFormSelectConfig {
  return inject(EgFormSelectConfigToken, { optional: true }) ?? {};
}
