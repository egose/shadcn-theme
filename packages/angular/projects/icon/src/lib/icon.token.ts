import { InjectionToken, ValueProvider, inject } from '@angular/core';
import type { IconSize } from './icon';

export interface EgIconConfig {
  size: IconSize;
}

const defaultConfig: EgIconConfig = {
  size: 'base',
};

const EgIconConfigToken = new InjectionToken<EgIconConfig>('EgIconConfig');

export function provideEgIconConfig(config: Partial<EgIconConfig>): ValueProvider {
  return { provide: EgIconConfigToken, useValue: { ...defaultConfig, ...config } };
}

export function injectEgIconConfig(): EgIconConfig {
  return inject(EgIconConfigToken, { optional: true }) ?? defaultConfig;
}
