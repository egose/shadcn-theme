import { inject, InjectionToken, type ValueProvider } from '@angular/core';

export interface EgFormCheckboxConfig {
  /**
   * Global class defaults for `eg-form-checkbox` styling slots.
   * Each is merged under the matching per-instance `*Class` input
   * (library base < global config < per-instance).
   */
  checkboxClass?: string;
  labelClass?: string;
  errorClass?: string;
  hintClass?: string;
}

const EgFormCheckboxConfigToken = new InjectionToken<EgFormCheckboxConfig>('EgFormCheckboxConfig');

export function provideEgFormCheckboxConfig(config: Partial<EgFormCheckboxConfig>): ValueProvider {
  return { provide: EgFormCheckboxConfigToken, useValue: { ...config } };
}

export function injectEgFormCheckboxConfig(): EgFormCheckboxConfig {
  return inject(EgFormCheckboxConfigToken, { optional: true }) ?? {};
}
