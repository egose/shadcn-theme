/*
 * Public API Surface of label
 */

import { NgModule } from '@angular/core';
import { HlmLabel } from './lib/label';

export * from './lib/label';

export const HlmLabelImports = [HlmLabel] as const;

@NgModule({
  imports: [...HlmLabelImports],
  exports: [...HlmLabelImports],
})
export class HlmLabelModule {}
