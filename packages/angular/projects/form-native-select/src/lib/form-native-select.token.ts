import { inject, InjectionToken, type ValueProvider } from '@angular/core';

export interface EgFormNativeSelectConfig {
  /**
   * Global class defaults for `eg-form-native-select` styling slots.
   * Each is merged under the matching per-instance `*Class` input
   * (library base < global config < per-instance).
   */
  labelClass?: string;
  selectClass?: string;
  errorClass?: string;
  hintClass?: string;
}

const EgFormNativeSelectConfigToken = new InjectionToken<EgFormNativeSelectConfig>('EgFormNativeSelectConfig');

export function provideEgFormNativeSelectConfig(config: Partial<EgFormNativeSelectConfig>): ValueProvider {
  return { provide: EgFormNativeSelectConfigToken, useValue: { ...config } };
}

export function injectEgFormNativeSelectConfig(): EgFormNativeSelectConfig {
  return inject(EgFormNativeSelectConfigToken, { optional: true }) ?? {};
}
