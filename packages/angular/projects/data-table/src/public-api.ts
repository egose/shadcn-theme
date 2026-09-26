/*
 * Public API Surface of data-table
 */

import { NgModule } from '@angular/core';

import { EgDataTable } from './lib/eg-data-table';
import { EgDataTableColumnHeader } from './lib/eg-data-table-column-header';
import { EgDataTablePagination } from './lib/eg-data-table-pagination';
import { EgDataTableViewOptions } from './lib/eg-data-table-view-options';
import { EgTableHeadSelection, EgTableRowSelection } from './lib/eg-data-table-selection';

export * from './lib/eg-data-table';
export * from './lib/eg-data-table-column-header';
export * from './lib/eg-data-table-features';
export * from './lib/eg-data-table-pagination';
export * from './lib/eg-data-table-selection';
export * from './lib/eg-data-table-view-options';
export * from './lib/eg-paginated-response';

export const EgDataTableImports = [
  EgDataTable,
  EgDataTableColumnHeader,
  EgDataTablePagination,
  EgDataTableViewOptions,
  EgTableHeadSelection,
  EgTableRowSelection,
] as const;

@NgModule({
  imports: [...EgDataTableImports],
  exports: [...EgDataTableImports],
})
export class EgDataTableModule {}
