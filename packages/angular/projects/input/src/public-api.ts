/*
 * Public API Surface of input
 */

import { NgModule } from '@angular/core';
import { HlmInput } from './lib/input';

export * from './lib/input';

export const HlmInputImpots = [HlmInput] as const;

@NgModule({
  imports: [...HlmInputImpots],
  exports: [...HlmInputImpots],
})
export class HlmInputModule {}
