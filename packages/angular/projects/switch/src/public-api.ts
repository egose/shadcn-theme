/*
 * Public API Surface of switch
 */

import { NgModule } from '@angular/core';

import { EgSwitch } from './lib/switch';
import { EgSwitchThumb } from './lib/switch-thumb';

export * from './lib/switch';
export * from './lib/switch-thumb';

export const EgSwitchImports = [EgSwitch, EgSwitchThumb] as const;
@NgModule({
  imports: [...EgSwitchImports],
  exports: [...EgSwitchImports],
})
export class EgSwitchModule {}
