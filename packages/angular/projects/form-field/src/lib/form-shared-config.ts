import { inject, InjectionToken, type ValueProvider } from '@angular/core';

/**
 * Global styling defaults applied to every `eg-form-*` wrapper that follows
 * the shared label / control / error / hint skeleton.
 *
 * `labelClass` / `errorClass` / `hintClass` apply to every wrapper.
 * Each control slot only applies to wrappers that declare the matching slot
 * (e.g. `inputClass` → text-input, phone-input, autocomplete, date-pickers;
 * `selectClass` → select, native-select; `pickerClass` → date-pickers).
 *
 * Each slot is merged under the matching per-component global config and the
 * per-instance `*Class` input:
 *
 * library base < shared global < component global < per-instance
 *
 * `eg-form-toggle` picks up only the `labelClass` / `errorClass` / `hintClass`
 * slots (it keeps its own CVA / exclusive error-hint behavior and local
 * `toggleClass`).
 */
export interface EgFormSharedConfig {
  labelClass?: string;
  errorClass?: string;
  hintClass?: string;
  inputClass?: string;
  textareaClass?: string;
  selectClass?: string;
  controlClass?: string;
  chipsClass?: string;
  checkboxClass?: string;
  switchClass?: string;
  sliderClass?: string;
  groupClass?: string;
  otpClass?: string;
  pickerClass?: string;
}

const EgFormSharedConfigToken = new InjectionToken<EgFormSharedConfig>('EgFormSharedConfig');

/**
 * Sets shared label / error / hint / control classes app-wide, e.g.:
 *
 * ```ts
 * provideEgFormSharedConfig({ labelClass: 'tw:font-semibold', errorClass: 'tw:text-red-600' })
 * provideEgFormSharedConfig({ inputClass: 'tw:border-dashed', selectClass: 'tw:rounded-none' })
 * ```
 */
export function provideEgFormSharedConfig(config: Partial<EgFormSharedConfig>): ValueProvider {
  return { provide: EgFormSharedConfigToken, useValue: { ...config } };
}

/** Merged shared config (empty object when not provided). */
export function injectEgFormSharedConfig(): EgFormSharedConfig {
  return inject(EgFormSharedConfigToken, { optional: true }) ?? {};
}
