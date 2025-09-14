/*
 * Public API Surface of switch
 */

import { NgModule } from '@angular/core';

import { HlmSwitch } from './lib/switch';
import { HlmSwitchThumb } from './lib/switch-thumb';

export * from './lib/switch';
export * from './lib/switch-thumb';

export const HlmSwitchImports = [HlmSwitch, HlmSwitchThumb] as const;
@NgModule({
  imports: [...HlmSwitchImports],
  exports: [...HlmSwitchImports],
})
export class HlmSwitchModule {}
