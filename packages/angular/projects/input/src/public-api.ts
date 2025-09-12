/*
 * Public API Surface of input
 */

import { NgModule } from '@angular/core';
import { EgInput } from './lib/input';

export * from './lib/input';

export const EgInputImpots = [EgInput] as const;

@NgModule({
  imports: [...EgInputImpots],
  exports: [...EgInputImpots],
})
export class EgInputModule {}
