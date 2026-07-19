/*
 * Public API Surface of menubar
 */

import { NgModule } from '@angular/core';

import { HlmMenubar } from './lib/hlm-menubar';
import { HlmMenubarTrigger } from './lib/hlm-menubar-trigger';

export * from './lib/hlm-menubar';
export * from './lib/hlm-menubar-token';
export * from './lib/hlm-menubar-trigger';

export const HlmMenubarImports = [HlmMenubar, HlmMenubarTrigger] as const;

@NgModule({
  imports: [...HlmMenubarImports],
  exports: [...HlmMenubarImports],
})
export class HlmMenubarModule {}
