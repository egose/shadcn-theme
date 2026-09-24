import { inject, InjectionToken, type ValueProvider } from '@angular/core';

export interface EgFormTextareaConfig {
  /**
   * Global class defaults for `eg-form-textarea` styling slots.
   * Each is merged under the matching per-instance `*Class` input
   * (library base < global config < per-instance).
   */
  labelClass?: string;
  textareaClass?: string;
  errorClass?: string;
  hintClass?: string;
}

const EgFormTextareaConfigToken = new InjectionToken<EgFormTextareaConfig>('EgFormTextareaConfig');

export function provideEgFormTextareaConfig(config: Partial<EgFormTextareaConfig>): ValueProvider {
  return { provide: EgFormTextareaConfigToken, useValue: { ...config } };
}

export function injectEgFormTextareaConfig(): EgFormTextareaConfig {
  return inject(EgFormTextareaConfigToken, { optional: true }) ?? {};
}
