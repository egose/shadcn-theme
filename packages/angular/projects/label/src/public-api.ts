/*
 * Public API Surface of label
 */

import { NgModule } from '@angular/core';
import { EgLabel } from './lib/label';

export * from './lib/label';

export const EgLabelImports = [EgLabel] as const;

@NgModule({
  imports: [...EgLabelImports],
  exports: [...EgLabelImports],
})
export class EgLabelModule {}
