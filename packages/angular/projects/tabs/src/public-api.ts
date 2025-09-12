/*
 * Public API Surface of tabs
 */

import { NgModule } from '@angular/core';

import { EgTabs } from './lib/tabs';
import { EgTabsContent } from './lib/tabs-content';
import { EgTabsList } from './lib/tabs-list';
import { EgTabsPaginatedList } from './lib/tabs-paginated-list';
import { EgTabsTrigger } from './lib/tabs-trigger';

export * from './lib/tabs';
export * from './lib/tabs-content';
export * from './lib/tabs-list';
export * from './lib/tabs-paginated-list';
export * from './lib/tabs-trigger';

export const EgTabsImports = [EgTabs, EgTabsList, EgTabsTrigger, EgTabsContent, EgTabsPaginatedList] as const;

@NgModule({
  imports: [...EgTabsImports],
  exports: [...EgTabsImports],
})
export class EgTabsModule {}
