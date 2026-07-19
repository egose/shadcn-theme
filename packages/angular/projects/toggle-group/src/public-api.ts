/*
 * Public API Surface of toggle-group
 */

import { NgModule } from '@angular/core';

import { HlmToggleGroup } from './lib/hlm-toggle-group';
import { HlmToggleGroupItem } from './lib/hlm-toggle-group-item';

export * from './lib/hlm-toggle-group';
export * from './lib/hlm-toggle-group-item';
export * from './lib/hlm-toggle-group.token';

export const HlmToggleGroupImports = [HlmToggleGroup, HlmToggleGroupItem] as const;

@NgModule({
  imports: [...HlmToggleGroupImports],
  exports: [...HlmToggleGroupImports],
})
export class HlmToggleGroupModule {}
