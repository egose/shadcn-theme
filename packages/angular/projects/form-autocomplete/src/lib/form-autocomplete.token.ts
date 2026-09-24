import { inject, InjectionToken, type ValueProvider } from '@angular/core';

export interface EgFormAutocompleteConfig {
  /**
   * Global class defaults for `eg-form-autocomplete` styling slots.
   * Each is merged under the matching per-instance `*Class` input
   * (library base < global config < per-instance).
   */
  labelClass?: string;
  controlClass?: string;
  inputClass?: string;
  errorClass?: string;
  hintClass?: string;
}

const EgFormAutocompleteConfigToken = new InjectionToken<EgFormAutocompleteConfig>('EgFormAutocompleteConfig');

export function provideEgFormAutocompleteConfig(config: Partial<EgFormAutocompleteConfig>): ValueProvider {
  return { provide: EgFormAutocompleteConfigToken, useValue: { ...config } };
}

export function injectEgFormAutocompleteConfig(): EgFormAutocompleteConfig {
  return inject(EgFormAutocompleteConfigToken, { optional: true }) ?? {};
}
