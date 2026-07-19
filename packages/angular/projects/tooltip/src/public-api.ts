/*
 * Public API Surface of tooltip
 */

import { NgModule } from '@angular/core';

import { HlmTooltip } from './lib/hlm-tooltip';

export * from './lib/hlm-tooltip';

export const HlmTooltipImports = [HlmTooltip] as const;

@NgModule({
  imports: [...HlmTooltipImports],
  exports: [...HlmTooltipImports],
})
export class HlmTooltipModule {}
