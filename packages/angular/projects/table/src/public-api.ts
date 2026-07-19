/*
 * Public API Surface of table
 */

import { NgModule } from '@angular/core';

import {
  HlmCaption,
  HlmTable,
  HlmTableContainer,
  HlmTBody,
  HlmTd,
  HlmTFoot,
  HlmTh,
  HlmTHead,
  HlmTr,
} from './lib/hlm-table';

export * from './lib/hlm-table';

export const HlmTableImports = [
  HlmCaption,
  HlmTableContainer,
  HlmTable,
  HlmTBody,
  HlmTd,
  HlmTFoot,
  HlmTh,
  HlmTHead,
  HlmTr,
] as const;

@NgModule({
  imports: [...HlmTableImports],
  exports: [...HlmTableImports],
})
export class HlmTableModule {}
