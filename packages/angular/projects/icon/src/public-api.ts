/*
 * Public API Surface of icon
 */

import { NgModule } from '@angular/core';
import { EgIcon } from './lib/icon';

export * from './lib/icon';
export * from './lib/icon.token';

export const EgIconImports = [EgIcon] as const;

@NgModule({
  imports: [...EgIconImports],
  exports: [...EgIconImports],
})
export class EgIconModule {}
