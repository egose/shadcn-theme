/*
 * Public API Surface of alert
 */

import { NgModule } from '@angular/core';

import { EgAlert } from './lib/alert';
import { EgAlertDescription } from './lib/alert-description';
import { EgAlertIcon } from './lib/alert-icon';
import { EgAlertTitle } from './lib/alert-title';

export * from './lib/alert';
export * from './lib/alert-description';
export * from './lib/alert-icon';
export * from './lib/alert-title';

export const EgAlertImports = [EgAlert, EgAlertTitle, EgAlertDescription, EgAlertIcon] as const;

@NgModule({
  imports: [...EgAlertImports],
  exports: [...EgAlertImports],
})
export class EgAlertModule {}
