/*
 * Public API Surface of kbd
 */

import { NgModule } from '@angular/core';

import { HlmKbd } from './lib/hlm-kbd';
import { HlmKbdGroup } from './lib/hlm-kbd-group';

export * from './lib/hlm-kbd';
export * from './lib/hlm-kbd-group';

export const HlmKbdImports = [HlmKbd, HlmKbdGroup] as const;

@NgModule({
  imports: [...HlmKbdImports],
  exports: [...HlmKbdImports],
})
export class HlmKbdModule {}
