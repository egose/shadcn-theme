/*
 * Public API Surface of context-menu
 */

import { NgModule } from '@angular/core';

import { HlmContextMenuTrigger } from './lib/hlm-context-menu-trigger';

export * from './lib/hlm-context-menu-token';
export * from './lib/hlm-context-menu-trigger';

export const HlmContextMenuImports = [HlmContextMenuTrigger] as const;

@NgModule({
  imports: [...HlmContextMenuImports],
  exports: [...HlmContextMenuImports],
})
export class HlmContextMenuModule {}
