/*
 * Public API Surface of aspect-ratio
 */

import { NgModule } from '@angular/core';

import { HlmAspectRatio } from './lib/hlm-aspect-ratio';

export * from './lib/hlm-aspect-ratio';

export const HlmAspectRatioImports = [HlmAspectRatio] as const;

@NgModule({
  imports: [...HlmAspectRatioImports],
  exports: [...HlmAspectRatioImports],
})
export class HlmAspectRatioModule {}
