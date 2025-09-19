/*
 * Public API Surface of separator
 */

import { NgModule } from '@angular/core';
import { HlmSeparator } from './lib/separator';

export * from './lib/separator';

export const HlmSeparatorImports = [HlmSeparator] as const;

@NgModule({
  imports: [...HlmSeparatorImports],
  exports: [...HlmSeparatorImports],
})
export class HlmSeparatorModule {}
