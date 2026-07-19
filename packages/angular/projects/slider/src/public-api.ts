/*
 * Public API Surface of slider
 */

import { NgModule } from '@angular/core';

export * from './lib/hlm-slider';
import { HlmSlider } from './lib/hlm-slider';

export const HlmSliderImports = [HlmSlider] as const;

@NgModule({
  imports: [...HlmSliderImports],
  exports: [...HlmSliderImports],
})
export class HlmSliderModule {}
