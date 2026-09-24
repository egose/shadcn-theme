import { inject, InjectionToken, type ValueProvider } from '@angular/core';

export interface EgFormSliderConfig {
  /**
   * Global class defaults for `eg-form-slider` styling slots.
   * Each is merged under the matching per-instance `*Class` input
   * (library base < global config < per-instance).
   */
  labelClass?: string;
  sliderClass?: string;
  errorClass?: string;
  hintClass?: string;
}

const EgFormSliderConfigToken = new InjectionToken<EgFormSliderConfig>('EgFormSliderConfig');

export function provideEgFormSliderConfig(config: Partial<EgFormSliderConfig>): ValueProvider {
  return { provide: EgFormSliderConfigToken, useValue: { ...config } };
}

export function injectEgFormSliderConfig(): EgFormSliderConfig {
  return inject(EgFormSliderConfigToken, { optional: true }) ?? {};
}
