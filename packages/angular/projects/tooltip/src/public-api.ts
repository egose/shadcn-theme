/*
 * Public API Surface of tooltip
 */

import { NgModule } from '@angular/core';
import { HlmTooltip } from './lib/tooltip';
import { HlmTooltipTrigger } from './lib/tooltip-trigger';

export * from './lib/tooltip';
export * from './lib/tooltip-trigger';

export const HlmTooltipImports = [HlmTooltip, HlmTooltipTrigger] as const;

@NgModule({
  imports: [...HlmTooltipImports],
  exports: [...HlmTooltipImports],
})
export class HlmTooltipModule {}
