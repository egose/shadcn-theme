/*
 * Public API Surface of button
 */

import { NgModule } from '@angular/core';
import { HlmBtn } from './lib/btn';
import { HlmButton } from './lib/button';
export * from './lib/btn';
export * from './lib/button';
export * from './lib/button.token';

export const HlmButtonImports = [HlmButton, HlmBtn] as const;

@NgModule({
  imports: [...HlmButtonImports],
  exports: [...HlmButtonImports],
})
export class HlmButtonModule {}
