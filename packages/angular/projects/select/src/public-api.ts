/*
 * Public API Surface of select
 */

import { NgModule } from '@angular/core';
import { HlmSelect } from './lib/select';
import { HlmSelectContent } from './lib/select-content';
import { HlmSelectGroup } from './lib/select-group';
import { HlmSelectLabel } from './lib/select-label';
import { HlmSelectOption } from './lib/select-option';
import { HlmSelectScrollDown } from './lib/select-scroll-down';
import { HlmSelectScrollUp } from './lib/select-scroll-up';
import { HlmSelectTrigger } from './lib/select-trigger';
import { HlmSelectValue } from './lib/select-value';

export * from './lib/select';
export * from './lib/select-content';
export * from './lib/select-group';
export * from './lib/select-label';
export * from './lib/select-option';
export * from './lib/select-scroll-down';
export * from './lib/select-scroll-up';
export * from './lib/select-trigger';
export * from './lib/select-value';

export const HlmSelectImports = [
  HlmSelectContent,
  HlmSelectTrigger,
  HlmSelectOption,
  HlmSelectValue,
  HlmSelect,
  HlmSelectScrollUp,
  HlmSelectScrollDown,
  HlmSelectLabel,
  HlmSelectGroup,
] as const;

@NgModule({
  imports: [...HlmSelectImports],
  exports: [...HlmSelectImports],
})
export class HlmSelectModule {}
