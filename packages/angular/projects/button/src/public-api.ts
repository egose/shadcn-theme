/*
 * Public API Surface of button
 */

import { NgModule } from '@angular/core';
import { HlmButton } from './lib/button';
export * from './lib/button';

export const HlmButtonImports = [HlmButton] as const;

@NgModule({
  imports: [...HlmButtonImports],
  exports: [...HlmButtonImports],
})
export class HlmButtonModule {}
