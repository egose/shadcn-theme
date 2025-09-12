/*
 * Public API Surface of spinner
 */

import { NgModule } from '@angular/core';
import { EgSpinner } from './lib/spinner';

export * from './lib/spinner';

export const EgSpinnerImports = [EgSpinner] as const;

@NgModule({
  imports: [...EgSpinnerImports],
  exports: [...EgSpinnerImports],
})
export class EgSpinnerModule {}
