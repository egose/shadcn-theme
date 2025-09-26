/*
 * Public API Surface of sheet
 */

import { NgModule } from '@angular/core';

import { HlmSheet } from './lib/sheet';
import { HlmSheetClose } from './lib/sheet-close';
import { HlmSheetContent } from './lib/sheet-content';
import { HlmSheetDescription } from './lib/sheet-description';
import { HlmSheetFooter } from './lib/sheet-footer';
import { HlmSheetHeader } from './lib/sheet-header';
import { HlmSheetOverlay } from './lib/sheet-overlay';
import { HlmSheetTitle } from './lib/sheet-title';

export * from './lib/sheet';
export * from './lib/sheet-close';
export * from './lib/sheet-content';
export * from './lib/sheet-description';
export * from './lib/sheet-footer';
export * from './lib/sheet-header';
export * from './lib/sheet-overlay';
export * from './lib/sheet-title';

export const HlmSheetImports = [
  HlmSheet,
  HlmSheetClose,
  HlmSheetContent,
  HlmSheetDescription,
  HlmSheetFooter,
  HlmSheetHeader,
  HlmSheetOverlay,
  HlmSheetTitle,
] as const;

@NgModule({
  imports: [...HlmSheetImports],
  exports: [...HlmSheetImports],
})
export class HlmSheetModule {}
