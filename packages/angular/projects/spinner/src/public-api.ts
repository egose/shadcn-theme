/*
 * Public API Surface of spinner
 */

import { NgModule } from '@angular/core';
import { HlmSpinner } from './lib/spinner';

export * from './lib/spinner';

export const HlmSpinnerImports = [HlmSpinner] as const;

@NgModule({
  imports: [...HlmSpinnerImports],
  exports: [...HlmSpinnerImports],
})
export class HlmSpinnerModule {}
