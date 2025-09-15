/*
 * Public API Surface of popover
 */

import { NgModule } from '@angular/core';

import { HlmPopoverClose } from './lib/popover-close';
import { HlmPopoverContent } from './lib/popover-content';

export * from './lib/popover-close';
export * from './lib/popover-content';

export const HlmPopoverImports = [HlmPopoverContent, HlmPopoverClose] as const;

@NgModule({
  imports: [...HlmPopoverImports],
  exports: [...HlmPopoverImports],
})
export class HlmPopoverModule {}
