import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { HlmButton } from '@egose/shadcn-theme-ng/button';
import { HlmDropdownMenuImports } from '@egose/shadcn-theme-ng/dropdown-menu';
import { HlmIcon } from '@egose/shadcn-theme-ng/icon';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideArrowDown, lucideArrowUp, lucideChevronsUpDown, lucideEyeOff } from '@ng-icons/lucide';
import type { SortDirection } from '@tanstack/angular-table';

/**
 * Minimal column surface `EgDataTableColumnHeader` needs.
 *
 * A real TanStack `Column` always satisfies this (its methods only use
 * primitive params/returns), while the structural type keeps this component
 * generic over any `TData`/`TValue` without variance friction when wiring
 * `flexRenderComponent(..., { inputs: { column, title } })`.
 */
export interface EgSortableColumn {
  readonly id: string;
  getCanSort(): boolean;
  getIsSorted(): false | SortDirection;
  toggleSorting(desc?: boolean): void;
  toggleVisibility(value?: boolean): void;
}

/**
 * Sortable + hideable column header.
 *
 * Render via `flexRenderComponent(EgDataTableColumnHeader, { inputs: { column, title } })`
 * so the extra `title` input flows alongside the flex-render `column` context.
 * Non-sortable columns render a plain label.
 */
@Component({
  selector: 'eg-data-table-column-header',
  imports: [HlmButton, HlmDropdownMenuImports, NgIcon, HlmIcon],
  providers: [provideIcons({ lucideArrowDown, lucideArrowUp, lucideChevronsUpDown, lucideEyeOff })],
  template: `
    @if (column().getCanSort()) {
      <div class="tw:flex tw:items-center tw:gap-2">
        <button
          hlmButton
          variant="ghost"
          size="sm"
          class="tw:-ml-3 tw:h-8"
          type="button"
          [hlmDropdownMenuTrigger]="_menu"
        >
          <span>{{ title() }}</span>
          @switch (_sorted()) {
            @case ('desc') {
              <ng-icon hlm size="sm" name="lucideArrowDown" />
            }
            @case ('asc') {
              <ng-icon hlm size="sm" name="lucideArrowUp" />
            }
            @default {
              <ng-icon hlm size="sm" name="lucideChevronsUpDown" />
            }
          }
        </button>
        <ng-template #_menu>
          <div hlmDropdownMenu>
            <button hlmDropdownMenuItem type="button" (click)="column().toggleSorting(false)">
              <ng-icon hlm size="sm" name="lucideArrowUp" />
              Asc
            </button>
            <button hlmDropdownMenuItem type="button" (click)="column().toggleSorting(true)">
              <ng-icon hlm size="sm" name="lucideArrowDown" />
              Desc
            </button>
            <div hlmDropdownMenuSeparator></div>
            <button hlmDropdownMenuItem type="button" (click)="column().toggleVisibility(false)">
              <ng-icon hlm size="sm" name="lucideEyeOff" />
              Hide
            </button>
          </div>
        </ng-template>
      </div>
    } @else {
      <div>{{ title() }}</div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EgDataTableColumnHeader {
  public readonly column = input.required<EgSortableColumn>();
  public readonly title = input.required<string>();

  protected readonly _sorted = computed(() => this.column().getIsSorted());
}
