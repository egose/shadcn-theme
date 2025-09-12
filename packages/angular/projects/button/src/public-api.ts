/*
 * Public API Surface of button
 */

import { NgModule } from '@angular/core';
import { EgButton } from './lib/button';
export * from './lib/button';

export const EgButtonImports = [EgButton] as const;

@NgModule({
  imports: [...EgButtonImports],
  exports: [...EgButtonImports],
})
export class EgButtonModule {}
