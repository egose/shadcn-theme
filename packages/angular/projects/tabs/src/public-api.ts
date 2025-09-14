/*
 * Public API Surface of tabs
 */

import { NgModule } from '@angular/core';

import { HlmTabs } from './lib/tabs';
import { HlmTabsContent } from './lib/tabs-content';
import { HlmTabsList } from './lib/tabs-list';
import { HlmTabsPaginatedList } from './lib/tabs-paginated-list';
import { HlmTabsTrigger } from './lib/tabs-trigger';

export * from './lib/tabs';
export * from './lib/tabs-content';
export * from './lib/tabs-list';
export * from './lib/tabs-paginated-list';
export * from './lib/tabs-trigger';

export const HlmTabsImports = [HlmTabs, HlmTabsList, HlmTabsTrigger, HlmTabsContent, HlmTabsPaginatedList] as const;

@NgModule({
  imports: [...HlmTabsImports],
  exports: [...HlmTabsImports],
})
export class HlmTabsModule {}
