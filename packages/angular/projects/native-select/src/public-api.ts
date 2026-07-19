/*
 * Public API Surface of native-select
 */

import { NgModule } from '@angular/core';

import { HlmNativeSelect } from './lib/hlm-native-select';
import { HlmNativeSelectOptGroup } from './lib/hlm-native-select-opt-group';
import { HlmNativeSelectOption } from './lib/hlm-native-select-option';

export * from './lib/hlm-native-select';
export * from './lib/hlm-native-select-opt-group';
export * from './lib/hlm-native-select-option';

export const HlmNativeSelectImports = [HlmNativeSelect, HlmNativeSelectOption, HlmNativeSelectOptGroup] as const;

@NgModule({
  imports: [...HlmNativeSelectImports],
  exports: [...HlmNativeSelectImports],
})
export class HlmNativeSelectModule {}
