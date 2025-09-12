/*
 * Public API Surface of sonner
 */

import { NgModule } from '@angular/core';

import { EgToaster } from './lib/toaster';

export * from './lib/toaster';

export const EgToasterImports = [EgToaster] as const;

@NgModule({
  imports: [...EgToasterImports],
  exports: [...EgToasterImports],
})
export class EgToasterModule {}
