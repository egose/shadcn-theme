/*
 * Public API Surface of collapsible
 */

import { NgModule } from '@angular/core';

import { HlmCollapsible } from './lib/hlm-collapsible';
import { HlmCollapsibleContent } from './lib/hlm-collapsible-content';
import { HlmCollapsibleTrigger } from './lib/hlm-collapsible-trigger';

export * from './lib/hlm-collapsible';
export * from './lib/hlm-collapsible-content';
export * from './lib/hlm-collapsible-trigger';

export const HlmCollapsibleImports = [HlmCollapsible, HlmCollapsibleContent, HlmCollapsibleTrigger] as const;

@NgModule({
  imports: [...HlmCollapsibleImports],
  exports: [...HlmCollapsibleImports],
})
export class HlmCollapsibleModule {}
