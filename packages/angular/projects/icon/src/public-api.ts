/*
 * Public API Surface of icon
 */

import { NgModule } from '@angular/core';
import { HlmIcon } from './lib/icon';

export * from './lib/icon';
export * from './lib/icon.token';

export const HlmIconImports = [HlmIcon] as const;

@NgModule({
  imports: [...HlmIconImports],
  exports: [...HlmIconImports],
})
export class HlmIconModule {}
