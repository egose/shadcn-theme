/*
 * Public API Surface of checkbox
 */

import { NgModule } from '@angular/core';

import { HlmCheckbox } from './lib/checkbox';

export * from './lib/checkbox';

export const HlmCheckboxImports = [HlmCheckbox] as const;
@NgModule({
  imports: [...HlmCheckboxImports],
  exports: [...HlmCheckboxImports],
})
export class HlmCheckboxModule {}
