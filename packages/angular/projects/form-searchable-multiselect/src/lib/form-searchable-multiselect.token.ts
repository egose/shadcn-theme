import { inject, InjectionToken, type ValueProvider } from '@angular/core';

export interface EgFormSearchableMultiselectConfig {
  /**
   * Global class defaults for `eg-form-searchable-multiselect` styling slots.
   * Each is merged under the matching per-instance `*Class` input
   * (library base < global config < per-instance).
   */
  labelClass?: string;
  controlClass?: string;
  errorClass?: string;
  hintClass?: string;
}

const EgFormSearchableMultiselectConfigToken = new InjectionToken<EgFormSearchableMultiselectConfig>(
  'EgFormSearchableMultiselectConfig',
);

export function provideEgFormSearchableMultiselectConfig(
  config: Partial<EgFormSearchableMultiselectConfig>,
): ValueProvider {
  return { provide: EgFormSearchableMultiselectConfigToken, useValue: { ...config } };
}

export function injectEgFormSearchableMultiselectConfig(): EgFormSearchableMultiselectConfig {
  return inject(EgFormSearchableMultiselectConfigToken, { optional: true }) ?? {};
}
