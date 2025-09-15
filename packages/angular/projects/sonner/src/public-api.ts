/*
 * Public API Surface of sonner
 */

import { NgModule } from '@angular/core';

import { HlmToaster } from './lib/toaster';

export * from './lib/toaster';

export const HlmToasterImports = [HlmToaster] as const;

@NgModule({
  imports: [...HlmToasterImports],
  exports: [...HlmToasterImports],
})
export class HlmToasterModule {}
