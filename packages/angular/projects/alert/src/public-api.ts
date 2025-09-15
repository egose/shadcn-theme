/*
 * Public API Surface of alert
 */

import { NgModule } from '@angular/core';

import { HlmAlert } from './lib/alert';
import { HlmAlertDescription } from './lib/alert-description';
import { HlmAlertIcon } from './lib/alert-icon';
import { HlmAlertTitle } from './lib/alert-title';

export * from './lib/alert';
export * from './lib/alert-description';
export * from './lib/alert-icon';
export * from './lib/alert-title';

export const HlmAlertImports = [HlmAlert, HlmAlertTitle, HlmAlertDescription, HlmAlertIcon] as const;

@NgModule({
  imports: [...HlmAlertImports],
  exports: [...HlmAlertImports],
})
export class HlmAlertModule {}
