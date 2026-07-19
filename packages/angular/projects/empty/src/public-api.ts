/*
 * Public API Surface of empty
 */

import { NgModule } from '@angular/core';

import { HlmEmpty } from './lib/hlm-empty';
import { HlmEmptyContent } from './lib/hlm-empty-content';
import { HlmEmptyDescription } from './lib/hlm-empty-description';
import { HlmEmptyHeader } from './lib/hlm-empty-header';
import { HlmEmptyMedia } from './lib/hlm-empty-media';
import { HlmEmptyTitle } from './lib/hlm-empty-title';

export * from './lib/hlm-empty';
export * from './lib/hlm-empty-content';
export * from './lib/hlm-empty-description';
export * from './lib/hlm-empty-header';
export * from './lib/hlm-empty-media';
export * from './lib/hlm-empty-title';

export const HlmEmptyImports = [
  HlmEmpty,
  HlmEmptyContent,
  HlmEmptyDescription,
  HlmEmptyHeader,
  HlmEmptyTitle,
  HlmEmptyMedia,
] as const;

@NgModule({
  imports: [...HlmEmptyImports],
  exports: [...HlmEmptyImports],
})
export class HlmEmptyModule {}
