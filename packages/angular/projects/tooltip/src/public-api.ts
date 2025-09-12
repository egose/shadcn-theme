/*
 * Public API Surface of tooltip
 */

import { NgModule } from '@angular/core';
import { EgTooltip } from './lib/tooltip';
import { EgTooltipTrigger } from './lib/tooltip-trigger';

export * from './lib/tooltip';
export * from './lib/tooltip-trigger';

export const EgTooltipImports = [EgTooltip, EgTooltipTrigger] as const;

@NgModule({
  imports: [...EgTooltipImports],
  exports: [...EgTooltipImports],
})
export class EgTooltipModule {}
