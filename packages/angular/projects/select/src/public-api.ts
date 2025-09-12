/*
 * Public API Surface of select
 */

import { NgModule } from '@angular/core';
import { EgSelect } from './lib/select';
import { EgSelectContent } from './lib/select-content';
import { EgSelectGroup } from './lib/select-group';
import { EgSelectLabel } from './lib/select-label';
import { EgSelectOption } from './lib/select-option';
import { EgSelectScrollDown } from './lib/select-scroll-down';
import { EgSelectScrollUp } from './lib/select-scroll-up';
import { EgSelectTrigger } from './lib/select-trigger';
import { EgSelectValue } from './lib/select-value';

export * from './lib/select';
export * from './lib/select-content';
export * from './lib/select-group';
export * from './lib/select-label';
export * from './lib/select-option';
export * from './lib/select-scroll-down';
export * from './lib/select-scroll-up';
export * from './lib/select-trigger';
export * from './lib/select-value';

export const EgSelectImports = [
  EgSelectContent,
  EgSelectTrigger,
  EgSelectOption,
  EgSelectValue,
  EgSelect,
  EgSelectScrollUp,
  EgSelectScrollDown,
  EgSelectLabel,
  EgSelectGroup,
] as const;

@NgModule({
  imports: [...EgSelectImports],
  exports: [...EgSelectImports],
})
export class EgSelectModule {}
