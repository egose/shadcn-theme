import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { HlmCheckbox } from '@egose/shadcn-theme-ng/checkbox';
import type { Row, Table } from '@tanstack/angular-table';
import type { RowData } from '@tanstack/angular-table';
import type { EgDataTableFeatures } from './eg-data-table-features';

/**
 * Header selection checkbox: toggles all page rows.
 *
 * Generic over `TData` so the same component works with any table; the table
 * instance is passed explicitly (no DI needed inside column definitions).
 * `HlmCheckbox.checked` accepts `'indeterminate'`, so the tri-state is derived
 * via `computed` instead of a separate input.
 */
@Component({
  selector: 'eg-table-head-selection',
  imports: [HlmCheckbox],
  host: { class: 'tw:flex', '[attr.aria-label]': 'ariaLabel()' },
  template: ` <hlm-checkbox [checked]="_checked()" (changed)="table().toggleAllPageRowsSelected($event)" /> `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EgTableHeadSelection<TData extends RowData> {
  public readonly table = input.required<Table<EgDataTableFeatures, TData>>();
  public readonly ariaLabel = input<string>('Select all');

  protected readonly _checked = computed(() => {
    const table = this.table();
    if (table.getIsAllPageRowsSelected()) return true as const;
    if (table.getIsSomePageRowsSelected()) return 'indeterminate' as const;
    return false as const;
  });
}

/**
 * Row selection checkbox: toggles a single row.
 */
@Component({
  selector: 'eg-table-row-selection',
  imports: [HlmCheckbox],
  host: { class: 'tw:flex', '[attr.aria-label]': 'ariaLabel()' },
  template: ` <hlm-checkbox [checked]="row().getIsSelected()" (changed)="row().toggleSelected($event)" /> `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EgTableRowSelection<TData extends RowData> {
  public readonly row = input.required<Row<EgDataTableFeatures, TData>>();
  public readonly ariaLabel = input<string>('Select row');
}
