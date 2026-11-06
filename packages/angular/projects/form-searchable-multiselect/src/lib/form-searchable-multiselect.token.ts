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
  /**
   * Global default for whether the picker popover renders its search field.
   * An explicit per-instance `showSearch` input wins over this.
   */
  showSearch?: boolean;
  /**
   * Global default for whether the selected chips row renders above the trigger.
   * An explicit per-instance `showSelectedChips` input wins over this.
   */
  showSelectedChips?: boolean;
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
