/*
 * Public API Surface of textarea
 */

import { NgModule } from '@angular/core';

import { HlmTextarea } from './lib/hlm-textarea';

export * from './lib/hlm-textarea';

export const HlmTextareaImports = [HlmTextarea] as const;

@NgModule({
  imports: [...HlmTextareaImports],
  exports: [...HlmTextareaImports],
})
export class HlmTextareaModule {}
