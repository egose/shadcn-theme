import { inject, InjectionToken, type ValueProvider } from '@angular/core';

export interface EgFormToggleGroupConfig {
  /**
   * Global class defaults for `eg-form-toggle-group` styling slots.
   * Each is merged under the matching per-instance `*Class` input
   * (library base < global config < per-instance).
   */
  labelClass?: string;
  groupClass?: string;
  errorClass?: string;
  hintClass?: string;
}

const EgFormToggleGroupConfigToken = new InjectionToken<EgFormToggleGroupConfig>('EgFormToggleGroupConfig');

export function provideEgFormToggleGroupConfig(config: Partial<EgFormToggleGroupConfig>): ValueProvider {
  return { provide: EgFormToggleGroupConfigToken, useValue: { ...config } };
}

export function injectEgFormToggleGroupConfig(): EgFormToggleGroupConfig {
  return inject(EgFormToggleGroupConfigToken, { optional: true }) ?? {};
}
