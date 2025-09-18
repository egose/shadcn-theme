/*
 * Public API Surface of dialog
 */
import { NgModule } from '@angular/core';

import { HlmDialog } from './lib/dialog';
import { HlmDialogClose } from './lib/dialog-close';
import { HlmDialogContent } from './lib/dialog-content';
import { HlmDialogDescription } from './lib/dialog-description';
import { HlmDialogFooter } from './lib/dialog-footer';
import { HlmDialogHeader } from './lib/dialog-header';
import { HlmDialogOverlay } from './lib/dialog-overlay';
import { HlmDialogTitle } from './lib/dialog-title';

export * from './lib/dialog';
export * from './lib/dialog-close';
export * from './lib/dialog-content';
export * from './lib/dialog-description';
export * from './lib/dialog-footer';
export * from './lib/dialog-header';
export * from './lib/dialog-overlay';
export * from './lib/dialog-title';
export * from './lib/dialog.service';

export const HlmDialogImports = [
  HlmDialog,
  HlmDialogClose,
  HlmDialogContent,
  HlmDialogDescription,
  HlmDialogFooter,
  HlmDialogHeader,
  HlmDialogOverlay,
  HlmDialogTitle,
] as const;

@NgModule({
  imports: [...HlmDialogImports],
  exports: [...HlmDialogImports],
})
export class HlmDialogModule {}
