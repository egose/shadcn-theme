/*
 * Public API Surface of form-field
 */

import { NgModule } from '@angular/core';
import { EgError } from './lib/error';
import { EgFormField } from './lib/form-field';
import { EgHint } from './lib/hint';

export * from './lib/error';
export * from './lib/form-field';
export * from './lib/hint';

export const EgFormFieldImports = [EgFormField, EgError, EgHint];

@NgModule({
  imports: [...EgFormFieldImports],
  exports: [...EgFormFieldImports],
})
export class EgFormFieldModule {}
