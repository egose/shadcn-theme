import { inject, InjectionToken, type ValueProvider } from '@angular/core';

export interface EgFormRadioGroupConfig {
  /**
   * Global class defaults for `eg-form-radio-group` styling slots.
   * Each is merged under the matching per-instance `*Class` input
   * (library base < global config < per-instance).
   */
  labelClass?: string;
  groupClass?: string;
  errorClass?: string;
  hintClass?: string;
}

const EgFormRadioGroupConfigToken = new InjectionToken<EgFormRadioGroupConfig>('EgFormRadioGroupConfig');

export function provideEgFormRadioGroupConfig(config: Partial<EgFormRadioGroupConfig>): ValueProvider {
  return { provide: EgFormRadioGroupConfigToken, useValue: { ...config } };
}

export function injectEgFormRadioGroupConfig(): EgFormRadioGroupConfig {
  return inject(EgFormRadioGroupConfigToken, { optional: true }) ?? {};
}
