import { inject, InjectionToken, type ValueProvider } from '@angular/core';

export interface EgFormComboboxConfig {
  /**
   * Global class defaults for `eg-form-combobox` styling slots.
   * Each is merged under the matching per-instance `*Class` input
   * (library base < global config < per-instance).
   */
  labelClass?: string;
  controlClass?: string;
  chipsClass?: string;
  errorClass?: string;
  hintClass?: string;
}

const EgFormComboboxConfigToken = new InjectionToken<EgFormComboboxConfig>('EgFormComboboxConfig');

export function provideEgFormComboboxConfig(config: Partial<EgFormComboboxConfig>): ValueProvider {
  return { provide: EgFormComboboxConfigToken, useValue: { ...config } };
}

export function injectEgFormComboboxConfig(): EgFormComboboxConfig {
  return inject(EgFormComboboxConfigToken, { optional: true }) ?? {};
}
