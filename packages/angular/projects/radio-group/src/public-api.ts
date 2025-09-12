/*
 * Public API Surface of radio-group
 */

import { NgModule } from '@angular/core';

import { EgRadio } from './lib/radio';
import { EgRadioGroup } from './lib/radio-group';
import { EgRadioIndicator } from './lib/radio-indicator';

export * from './lib/radio';
export * from './lib/radio-group';
export * from './lib/radio-indicator';

export const EgRadioGroupImports = [EgRadioGroup, EgRadio, EgRadioIndicator];

@NgModule({
  imports: [...EgRadioGroupImports],
  exports: [...EgRadioGroupImports],
})
export class EgRadioGroupModule {}
