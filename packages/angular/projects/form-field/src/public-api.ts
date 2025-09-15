/*
 * Public API Surface of form-field
 */

import { NgModule } from '@angular/core';
import { HlmError } from './lib/error';
import { HlmFormField } from './lib/form-field';
import { HlmHint } from './lib/hint';

export * from './lib/error';
export * from './lib/form-field';
export * from './lib/hint';

export const HlmFormFieldImports = [HlmFormField, HlmError, HlmHint];

@NgModule({
  imports: [...HlmFormFieldImports],
  exports: [...HlmFormFieldImports],
})
export class HlmFormFieldModule {}
