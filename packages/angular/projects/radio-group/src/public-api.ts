/*
 * Public API Surface of radio-group
 */

import { NgModule } from '@angular/core';

import { HlmRadio } from './lib/radio';
import { HlmRadioGroup } from './lib/radio-group';
import { HlmRadioIndicator } from './lib/radio-indicator';

export * from './lib/radio';
export * from './lib/radio-group';
export * from './lib/radio-indicator';

export const HlmRadioGroupImports = [HlmRadioGroup, HlmRadio, HlmRadioIndicator];

@NgModule({
  imports: [...HlmRadioGroupImports],
  exports: [...HlmRadioGroupImports],
})
export class HlmRadioGroupModule {}
