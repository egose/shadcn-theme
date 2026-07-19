/*
 * Public API Surface of button-group
 */

import { NgModule } from '@angular/core';

import { HlmButtonGroup } from './lib/hlm-button-group';
import { HlmButtonGroupSeparator } from './lib/hlm-button-group-separator';
import { HlmButtonGroupText } from './lib/hlm-button-group-text';

export * from './lib/hlm-button-group';
export * from './lib/hlm-button-group-separator';
export * from './lib/hlm-button-group-text';

export const HlmButtonGroupImports = [HlmButtonGroup, HlmButtonGroupText, HlmButtonGroupSeparator] as const;

@NgModule({
  imports: [...HlmButtonGroupImports],
  exports: [...HlmButtonGroupImports],
})
export class HlmButtonGroupModule {}
