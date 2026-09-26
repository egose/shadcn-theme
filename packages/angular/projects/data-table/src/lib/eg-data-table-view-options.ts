import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { HlmButton } from '@egose/shadcn-theme-ng/button';
import { HlmDropdownMenuImports } from '@egose/shadcn-theme-ng/dropdown-menu';
import { HlmIcon } from '@egose/shadcn-theme-ng/icon';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideSettings2 } from '@ng-icons/lucide';
import { injectTableContext } from '@tanstack/angular-table';
import { hlm } from '@egose/shadcn-theme-ng/utils';
import type { HlmTableSize } from '@egose/shadcn-theme-ng/table';

/**
 * Column-visibility toggle.
 *
 * Reads the table from the nearest `[tanStackTable]` directive — no table
 * input or generics needed. Only columns with an `accessorFn` that can hide
 * are listed (display columns like `select` / `actions` stay fixed).
 */
@Component({
  selector: 'eg-data-table-view-options',
  imports: [HlmButton, HlmDropdownMenuImports, NgIcon, HlmIcon],
  providers: [provideIcons({ lucideSettings2 })],
  template: `
    <button
      hlmButton
      variant="secondary"
      appearance="outline"
      size="sm"
      [class]="_buttonClass()"
      type="button"
      [hlmDropdownMenuTrigger]="_menu"
    >
      <ng-icon hlm name="lucideSettings2" />
      View
    </button>
    <ng-template #_menu>
      <div hlmDropdownMenu class="tw:w-[150px]">
        <div hlmDropdownMenuLabel>Toggle columns</div>
        <div hlmDropdownMenuSeparator></div>
        @for (column of _hidableColumns(); track column.id) {
          <button
            hlmDropdownMenuCheckbox
            class="tw:capitalize"
            [checked]="column.getIsVisible()"
            (triggered)="column.toggleVisibility()"
          >
            <hlm-dropdown-menu-checkbox-indicator />
            {{ column.id }}
          </button>
        }
      </div>
    </ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EgDataTableViewOptions {
  /** Density of the toggle button. */
  public readonly size = input<HlmTableSize>('default');

  protected readonly _table = injectTableContext();

  /** Height per density; hidden below `lg` like the pager edge buttons. Merged by `hlmButton`. */
  protected readonly _buttonClass = computed(() =>
    hlm(
      'tw:ml-auto tw:hidden tw:lg:flex',
      this.size() === 'sm' ? 'tw:h-7' : this.size() === 'lg' ? 'tw:h-9' : 'tw:h-8',
    ),
  );

  protected readonly _hidableColumns = computed(() =>
    this._table()
      .getAllColumns()
      .filter((column) => typeof column.accessorFn !== 'undefined' && column.getCanHide()),
  );
}
