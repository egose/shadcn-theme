import { inject, InjectionToken, type ValueProvider } from '@angular/core';

export interface EgFormSwitchConfig {
  /**
   * Global class defaults for `eg-form-switch` styling slots.
   * Each is merged under the matching per-instance `*Class` input
   * (library base < global config < per-instance).
   */
  switchClass?: string;
  labelClass?: string;
  errorClass?: string;
  hintClass?: string;
}

const EgFormSwitchConfigToken = new InjectionToken<EgFormSwitchConfig>('EgFormSwitchConfig');

export function provideEgFormSwitchConfig(config: Partial<EgFormSwitchConfig>): ValueProvider {
  return { provide: EgFormSwitchConfigToken, useValue: { ...config } };
}

export function injectEgFormSwitchConfig(): EgFormSwitchConfig {
  return inject(EgFormSwitchConfigToken, { optional: true }) ?? {};
}
