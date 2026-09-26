import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  input,
  linkedSignal,
  model,
  OnInit,
  output,
  signal,
  type TemplateRef,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { HlmButton } from '@egose/shadcn-theme-ng/button';
import { HlmCard, HlmCardContent } from '@egose/shadcn-theme-ng/card';
import { HlmIcon } from '@egose/shadcn-theme-ng/icon';
import { HlmInput } from '@egose/shadcn-theme-ng/input';
import { HlmSpinner } from '@egose/shadcn-theme-ng/spinner';
import { HlmTableImports } from '@egose/shadcn-theme-ng/table';
import { HlmToggleGroup, HlmToggleGroupItem } from '@egose/shadcn-theme-ng/toggle-group';
import { hlm } from '@egose/shadcn-theme-ng/utils';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideArrowDown,
  lucideArrowUp,
  lucideChevronsUpDown,
  lucideLayoutGrid,
  lucideLayoutList,
} from '@ng-icons/lucide';
import {
  FlexRender,
  TanStackTable,
  createColumnHelper,
  injectTable,
  type Cell,
  type CellData,
  type ColumnDef,
  type ColumnFiltersState,
  type ColumnVisibilityState,
  type Header,
  type PaginationState,
  type Row,
  type RowData,
  type RowSelectionState,
  type SortingState,
} from '@tanstack/angular-table';
import { defaultEgDataTableFeatures, type EgDataTableFeatures } from './eg-data-table-features';
import { EgDataTablePagination, type EgPaginationNavMode } from './eg-data-table-pagination';
import { EgDataTableViewOptions } from './eg-data-table-view-options';
import { EgTableHeadSelection, EgTableRowSelection } from './eg-data-table-selection';
import type { EgPaginatedResponse } from './eg-paginated-response';

/** Presentation mode of `EgDataTable`. Two-way bindable via `layout`. */
export type EgDataTableLayout = 'table' | 'grid';

/**
 * Generic data table with TanStack-powered sorting, filtering, pagination,
 * selection, column visibility, plus a React-parity grid layout.
 *
 * The caller passes `columns` (and optionally `gridColumns`) — everything else
 * is owned internally with change notifications via outputs:
 *
 * - Client mode: pass `data` as an array. Pagination/sorting/filtering run in-browser.
 *   `filterRows` can pre-filter the array before the built-in pipeline.
 * - Server mode: pass `data` as a page slice (`{items,total,limit,offset,hasPrevious,hasNext}`)
 *   with `manualPagination` set. The slice renders as-is — sorting/filtering
 *   are not applied client-side. Page, sort and filter interactions emit
 *   `pageChange` / `pageSizeChange` / `sortingChange` / `filterChange`
 *   (`columnFiltersChange`) so the caller can fetch the next slice.
 * - Selection: set `enableSelection` to auto-prepend a checkbox column;
 *   selected rows are emitted via `selectionChange` (array of `TData`).
 * - Grid mode: pass `gridColumns` to enable the layout toggle. Columns with
 *   `meta: { hideInTable: true }` are table-hidden; `meta: { thumbnail: true }`
 *   renders as the card banner.
 */
@Component({
  selector: 'eg-data-table',
  imports: [
    FlexRender,
    TanStackTable,
    NgTemplateOutlet,
    HlmTableImports,
    HlmButton,
    HlmCard,
    HlmCardContent,
    HlmIcon,
    HlmInput,
    HlmSpinner,
    HlmToggleGroup,
    HlmToggleGroupItem,
    NgIcon,
    EgDataTablePagination,
    EgDataTableViewOptions,
  ],
  providers: [
    provideIcons({ lucideArrowDown, lucideArrowUp, lucideChevronsUpDown, lucideLayoutGrid, lucideLayoutList }),
  ],
  template: `
    <div [class]="_containerClass()">
      @if (_showLayoutToggle()) {
        <div class="tw:flex tw:items-center tw:justify-between">
          <div hlmToggleGroup type="single" [value]="_effectiveLayout()" (valueChange)="_onLayoutToggle($event)">
            <button hlmToggleGroupItem value="table" aria-label="Table view">
              <ng-icon hlm name="lucideLayoutList" />
            </button>
            <button hlmToggleGroupItem value="grid" aria-label="Grid view">
              <ng-icon hlm name="lucideLayoutGrid" />
            </button>
          </div>
          <div></div>
        </div>
      }

      @if (showToolbar() || toolbarActions()) {
        <div class="tw:flex tw:flex-wrap tw:items-center tw:justify-between tw:gap-2 tw:py-1" [tanStackTable]="_table">
          @if (showToolbar()) {
            <div class="tw:flex tw:flex-wrap tw:items-center tw:gap-2">
              <input
                hlmInput
                class="tw:w-full tw:min-w-0 tw:md:w-80"
                [placeholder]="filterPlaceholder()"
                (input)="_onFilterInput($event)"
              />
              @if (showColumnToggle()) {
                <eg-data-table-view-options />
              }
            </div>
          }
          @if (toolbarActions()) {
            <div class="tw:flex tw:flex-wrap tw:items-center tw:gap-2">
              <ng-container *ngTemplateOutlet="toolbarActions()" />
            </div>
          }
        </div>
      }

      @if (_effectiveLayout() === 'grid') {
        <ng-container *ngTemplateOutlet="_gridView" />
      } @else {
        <ng-container *ngTemplateOutlet="_tableView" />
      }

      <ng-template #_tableView>
        <div class="tw:overflow-hidden tw:rounded-md tw:border">
          <div hlmTableContainer>
            <table hlmTable>
              <thead hlmTHead>
                @for (headerGroup of _table.getHeaderGroups(); track headerGroup.id) {
                  <tr hlmTr>
                    @for (header of headerGroup.headers; track header.id) {
                      <th hlmTh [attr.colSpan]="header.colSpan">
                        @if (!header.isPlaceholder) {
                          <div class="tw:flex tw:items-center tw:gap-1">
                            <ng-container
                              *flexRender="header.column.columnDef.header; props: header.getContext(); let headerText"
                            >
                              <div [innerHTML]="headerText"></div>
                            </ng-container>
                            @if (_showHeaderSortButton(header)) {
                              <button
                                hlmButton
                                variant="ghost"
                                size="sm"
                                class="tw:h-6 tw:w-6 tw:p-0"
                                type="button"
                                [attr.aria-label]="'Sort by ' + header.column.id"
                                (click)="_toggleHeaderSorting(header)"
                              >
                                @switch (header.column.getIsSorted()) {
                                  @case ('asc') {
                                    <ng-icon hlm size="sm" name="lucideArrowUp" />
                                  }
                                  @case ('desc') {
                                    <ng-icon hlm size="sm" name="lucideArrowDown" />
                                  }
                                  @default {
                                    <ng-icon hlm size="sm" name="lucideChevronsUpDown" />
                                  }
                                }
                              </button>
                            }
                          </div>
                        }
                      </th>
                    }
                  </tr>
                }
              </thead>
              <tbody hlmTBody>
                @if (isLoading()) {
                  <tr hlmTr>
                    <td hlmTd [attr.colspan]="_visibleColumnCount()" class="tw:h-24 tw:text-center">
                      <hlm-spinner class="tw:inline-flex" />
                    </td>
                  </tr>
                } @else if (_table.getRowModel().rows.length === 0) {
                  <tr hlmTr>
                    <td hlmTd [attr.colspan]="_visibleColumnCount()" class="tw:h-24 tw:text-center">
                      {{ emptyMessage() }}
                    </td>
                  </tr>
                } @else {
                  @for (row of _table.getRowModel().rows; track row.id) {
                    <tr
                      hlmTr
                      [attr.data-state]="row.getIsSelected() ? 'selected' : null"
                      (click)="_onRowClick($event, row)"
                    >
                      @for (cell of row.getVisibleCells(); track cell.id) {
                        <td hlmTd>
                          <ng-container
                            *flexRender="cell.column.columnDef.cell; props: cell.getContext(); let cellText"
                          >
                            <div [innerHTML]="cellText"></div>
                          </ng-container>
                        </td>
                      }
                    </tr>
                  }
                }
              </tbody>
            </table>
          </div>
        </div>
      </ng-template>

      <ng-template #_gridView>
        @if (isLoading()) {
          <div
            class="tw:flex tw:h-64 tw:items-center tw:justify-center tw:rounded-lg tw:border tw:border-dashed"
            role="status"
          >
            <hlm-spinner />
          </div>
        } @else if (_table.getRowModel().rows.length === 0) {
          <div
            class="tw:text-muted-foreground tw:flex tw:h-64 tw:items-center tw:justify-center tw:rounded-lg tw:border tw:border-dashed"
          >
            {{ emptyMessage() }}
          </div>
        } @else {
          <div class="tw:grid tw:grid-cols-1 tw:gap-4 tw:md:grid-cols-2 tw:xl:grid-cols-3 tw:2xl:grid-cols-4">
            @for (row of _table.getRowModel().rows; track row.id) {
              <div
                hlmCard
                class="tw:group tw:relative tw:transition-all tw:hover:shadow-md tw:data-[state=selected]:border-primary tw:data-[state=selected]:ring-1 tw:data-[state=selected]:ring-primary/20"
                [attr.data-state]="row.getIsSelected() ? 'selected' : null"
                (click)="_onRowClick($event, row)"
              >
                @if (_thumbnailCell(row); as thumbnail) {
                  <div class="tw:border-b tw:bg-muted/30">
                    <ng-container
                      *flexRender="thumbnail.column.columnDef.cell; props: thumbnail.getContext(); let thumbHtml"
                    >
                      <div [innerHTML]="thumbHtml"></div>
                    </ng-container>
                  </div>
                }
                @if (_selectionCell(row); as selection) {
                  <div class="tw:absolute tw:top-4 tw:right-4">
                    <ng-container
                      *flexRender="selection.column.columnDef.cell; props: selection.getContext(); let selectHtml"
                    >
                      <div [innerHTML]="selectHtml"></div>
                    </ng-container>
                  </div>
                }
                <div hlmCardContent class="tw:space-y-3">
                  @for (cell of _contentCells(row); track cell.id) {
                    <div class="tw:flex tw:flex-col">
                      <dt
                        class="tw:text-[10px] tw:font-bold tw:tracking-wider tw:uppercase tw:text-muted-foreground/80"
                      >
                        {{ _cellLabel(cell) }}
                      </dt>
                      <dd class="tw:mt-0.5 tw:text-sm tw:leading-none tw:font-medium">
                        <ng-container *flexRender="cell.column.columnDef.cell; props: cell.getContext(); let valueHtml">
                          <div [innerHTML]="valueHtml"></div>
                        </ng-container>
                      </dd>
                    </div>
                  }
                </div>
              </div>
            }
          </div>
        }
      </ng-template>

      @if (!hideFooter()) {
        <div
          class="tw:flex tw:flex-col tw:gap-2 tw:px-2 tw:py-4 tw:sm:flex-row tw:sm:items-center tw:sm:justify-between"
          [tanStackTable]="_table"
        >
          <div class="tw:text-muted-foreground tw:flex-1 tw:text-sm">{{ _statusText() }}</div>
          <eg-data-table-pagination
            [showStatus]="false"
            [showPageSize]="showPageSize()"
            [pageSizes]="pageSizes()"
            [navMode]="navMode()"
          />
        </div>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EgDataTable<TData extends RowData> implements OnInit {
  /** Column definitions for table layout (required). */
  public readonly columns = input.required<ColumnDef<EgDataTableFeatures, TData>[]>();
  /** Column definitions for grid layout; falls back to `columns` when omitted. */
  public readonly gridColumns = input<ColumnDef<EgDataTableFeatures, TData>[]>();
  /** Client rows, or a server page slice when `manualPagination` is set (`null` while loading). */
  public readonly data = input<readonly TData[] | EgPaginatedResponse<TData> | null>([]);
  /** When true, `data` is a server page slice and the table uses TanStack `manualPagination`. Sorting and filtering are then display-only: the slice is shown as-is while `sortingChange` / `filterChange` (`columnFiltersChange`) notify the caller to refetch. */
  public readonly manualPagination = input<boolean>(false);
  /** TanStack feature registry. Defaults to filtering + visibility + pagination + selection + sorting. */
  public readonly features = input<EgDataTableFeatures>(defaultEgDataTableFeatures);
  public readonly isLoading = input<boolean>(false);
  public readonly emptyMessage = input<string>('No results found.');
  /** When true, a checkbox column is auto-prepended and `selectionChange` emits the selected rows. */
  public readonly enableSelection = input<boolean>(false);
  public readonly hideFooter = input<boolean>(false);
  /** Presentation mode. Two-way bindable: `[(layout)]`. Grid requires `gridColumns`. */
  public readonly layout = model<EgDataTableLayout>('table');
  /** Show the table/grid toggle (only rendered when `gridColumns` is set). */
  public readonly showLayoutToggle = input<boolean>(true);
  /** Show the toolbar (filter input, plus the column-visibility dropdown when `showColumnToggle` is set). */
  public readonly showToolbar = input<boolean>(false);
  /** Column id the toolbar filter input writes to (e.g. `'email'`). Empty means client-side filtering is skipped and keystrokes only emit `filterChange` (server-side pattern). */
  public readonly filterColumnId = input<string>('');
  public readonly filterPlaceholder = input<string>('Filter...');
  /** Show the column-visibility dropdown inside the toolbar. Off by default; opt in per table. */
  public readonly showColumnToggle = input<boolean>(false);
  /** Custom right-side toolbar content (e.g. action buttons) as a template. Renders the toolbar row even when `showToolbar` is false; built-ins stay on the left. */
  public readonly toolbarActions = input<TemplateRef<unknown> | undefined>(undefined);
  /** Default client-side page size. Changing it later resets the pager to the new size. */
  public readonly defaultPageSize = input<number>(10);
  /** Caller-provided frontend filter: receives all client rows, returns the kept rows. Runs before built-in filtering/sorting/pagination; ignored in server mode. Must be pure. */
  public readonly filterRows = input<((rows: readonly TData[]) => readonly TData[]) | null>(null);
  /** Seeds the sorting state once at creation. Later changes are ignored — use `sortingChange` to stay in sync. */
  public readonly initialSorting = input<SortingState>([]);
  /** Seeds the column-filter state once at creation. Later changes are ignored. */
  public readonly initialColumnFilters = input<ColumnFiltersState>([]);
  /** Seeds the column-visibility state once at creation. Later changes are ignored. */
  public readonly initialColumnVisibility = input<ColumnVisibilityState>({});
  /** Seeds the row-selection state once at creation (keys are row ids). Later changes are ignored. */
  public readonly initialRowSelection = input<RowSelectionState>({});
  /** Show the rows-per-page selector in the footer pager. */
  public readonly showPageSize = input<boolean>(true);
  /** Page-size options for the footer selector. The current size is appended when absent. */
  public readonly pageSizes = input<readonly number[]>([10, 20, 30, 40, 50]);
  /** Footer navigation-button content: icons only, text labels only, or both. */
  public readonly navMode = input<EgPaginationNavMode>('icons');
  public readonly userClass = input<string>('', { alias: 'class' });

  /** Emits the selected rows whenever selection changes (requires `enableSelection`). */
  public readonly selectionChange = output<readonly TData[]>();
  /** Emits the target page index on pager navigation (primary hook for server fetching). */
  public readonly pageChange = output<number>();
  public readonly pageSizeChange = output<number>();
  /** Emits the row's data when a row (table) or card (grid) is clicked. Clicks from nested interactive elements (buttons, links, inputs, checkboxes, selects) are ignored. */
  public readonly rowClick = output<TData>();
  public readonly sortingChange = output<SortingState>();
  public readonly columnFiltersChange = output<ColumnFiltersState>();
  /** Emits the toolbar filter string whenever it changes. Empty when cleared or unset. */
  public readonly filterChange = output<string>();
  public readonly columnVisibilityChange = output<ColumnVisibilityState>();

  protected readonly _containerClass = computed(() => hlm('tw:space-y-2', this.userClass()));

  private readonly _sorting = signal<SortingState>([]);
  private readonly _columnFilters = signal<ColumnFiltersState>([]);
  private readonly _columnVisibility = signal<ColumnVisibilityState>({});
  private readonly _rowSelection = signal<RowSelectionState>({});
  private readonly _clientPageIndex = signal<number>(0);
  // Linked so the bound `defaultPageSize` applies once inputs are set, while
  // pager-driven `set()` writes below are preserved until it changes again.
  private readonly _clientPageSize = linkedSignal<number>(() => this.defaultPageSize());
  private readonly _isServer = computed(() => this.manualPagination());

  /** The server page slice when in server mode; `null` for client data, misuse shapes, or `null` while loading. */
  private readonly _page = computed<EgPaginatedResponse<TData> | null>(() => {
    if (!this._isServer()) return null;
    const data: unknown = this.data();
    if (data !== null && typeof data === 'object' && 'items' in data) {
      return data as EgPaginatedResponse<TData>;
    }
    return null;
  });

  private readonly _items = computed<readonly TData[]>(() => {
    const page = this._page();
    if (page) return page.items;
    const data: unknown = this.data();
    const rows: readonly TData[] = Array.isArray(data)
      ? (data as readonly TData[])
      : ((data as EgPaginatedResponse<TData> | null)?.items ?? []);
    const filter = this.filterRows();
    return filter ? filter(rows) : rows;
  });

  private readonly _serverPageCount = computed(() => {
    const paginated = this._page();
    if (!paginated || paginated.limit <= 0) return 1;
    return Math.max(1, Math.ceil(paginated.total / paginated.limit));
  });

  private readonly _serverPageIndex = computed(() => {
    const paginated = this._page();
    if (!paginated || paginated.limit <= 0) return 0;
    return Math.floor(paginated.offset / paginated.limit);
  });

  private readonly _paginationState = computed<PaginationState>(() => {
    const paginated = this._page();
    if (paginated) return { pageIndex: this._serverPageIndex(), pageSize: paginated.limit };
    return { pageIndex: this._clientPageIndex(), pageSize: this._clientPageSize() };
  });

  private readonly _selectionHelper = computed(() => createColumnHelper<EgDataTableFeatures, TData>());

  /** Caller columns + auto-injected selection column + layout filtering. */
  protected readonly _finalColumns = computed<ColumnDef<EgDataTableFeatures, TData>[]>(() => {
    const isGrid = this._effectiveLayout() === 'grid';
    const base = isGrid ? (this.gridColumns() ?? this.columns()) : this.columns();
    const visible = isGrid ? base : base.filter((column) => column.meta?.hideInTable !== true);
    if (!this.enableSelection()) return [...visible];
    const helper = this._selectionHelper();
    const selectionColumn = helper.display({
      id: 'select',
      header: () => EgTableHeadSelection,
      cell: () => EgTableRowSelection,
      enableSorting: false,
      enableHiding: false,
    });
    return [selectionColumn, ...visible];
  });

  protected readonly _table = injectTable(() => {
    const server = this._isServer();
    return {
      features: this.features(),
      columns: this._finalColumns(),
      data: [...this._items()],
      manualPagination: server,
      manualSorting: server,
      manualFiltering: server,
      ...(server ? { pageCount: this._serverPageCount() } : {}),
      state: {
        sorting: this._sorting(),
        columnFilters: this._columnFilters(),
        columnVisibility: this._columnVisibility(),
        rowSelection: this._rowSelection(),
        pagination: this._paginationState(),
      },
      onSortingChange: (updater) => {
        const next = typeof updater === 'function' ? updater(this._sorting()) : updater;
        this._sorting.set(next);
        this.sortingChange.emit(next);
      },
      onColumnFiltersChange: (updater) => {
        const next = typeof updater === 'function' ? updater(this._columnFilters()) : updater;
        this._columnFilters.set(next);
        this.columnFiltersChange.emit(next);
        const filterId = this.filterColumnId();
        if (filterId) {
          const value = next.find((filter) => filter.id === filterId)?.value;
          this.filterChange.emit(typeof value === 'string' ? value : '');
        }
      },
      onColumnVisibilityChange: (updater) => {
        const next = typeof updater === 'function' ? updater(this._columnVisibility()) : updater;
        this._columnVisibility.set(next);
        this.columnVisibilityChange.emit(next);
      },
      onRowSelectionChange: (updater) => {
        const next = typeof updater === 'function' ? updater(this._rowSelection()) : updater;
        this._rowSelection.set(next);
      },
      onPaginationChange: (updater) => {
        const current = this._paginationState();
        const next = typeof updater === 'function' ? updater(current) : updater;
        if (next.pageIndex !== current.pageIndex) this.pageChange.emit(next.pageIndex);
        if (next.pageSize !== current.pageSize) this.pageSizeChange.emit(next.pageSize);
        if (!this._isServer()) {
          this._clientPageIndex.set(next.pageIndex);
          this._clientPageSize.set(next.pageSize);
        }
      },
    };
  });

  private readonly _emitSelection = effect(() => {
    this._rowSelection();
    const selected = this._table.getSelectedRowModel().rows.map((row) => row.original);
    this.selectionChange.emit(selected);
  });

  /**
   * Seeds internal state from the `initial*` inputs. Runs in `ngOnInit` (after
   * first bindings, before first render) exactly once, so inline-literal
   * bindings (new references every change detection) cannot clobber user
   * interaction afterwards. Values are copied to avoid aliasing caller data.
   */
  public ngOnInit(): void {
    this._sorting.set([...this.initialSorting()]);
    this._columnFilters.set([...this.initialColumnFilters()]);
    this._columnVisibility.set({ ...this.initialColumnVisibility() });
    this._rowSelection.set({ ...this.initialRowSelection() });
  }

  protected readonly _hasGrid = computed(() => this.gridColumns() !== undefined);
  protected readonly _effectiveLayout = computed<EgDataTableLayout>(() =>
    this.layout() === 'grid' && this._hasGrid() ? 'grid' : 'table',
  );
  protected readonly _showLayoutToggle = computed(() => this.showLayoutToggle() && this._hasGrid());

  protected readonly _visibleColumnCount = computed(() => {
    const count = this._table.getVisibleLeafColumns().length;
    return count > 0 ? count : 1;
  });

  protected readonly _statusText = computed(() => {
    const paginated = this._page();
    const table = this._table;
    const selected = table.getFilteredSelectedRowModel().rows.length;
    if (this.enableSelection() && selected > 0) {
      const total = paginated ? paginated.total : table.getFilteredRowModel().rows.length;
      return `${selected} of ${total} row(s) selected`;
    }
    if (paginated) {
      const from = paginated.items.length === 0 ? 0 : paginated.offset + 1;
      const to = paginated.offset + paginated.items.length;
      return `Showing ${from} to ${to} of ${paginated.total} records`;
    }
    const total = table.getFilteredRowModel().rows.length;
    return `${total} row(s).`;
  });

  protected _onLayoutToggle(value: unknown): void {
    if (value === 'table' || value === 'grid') this.layout.set(value);
  }

  protected _onFilterInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    const id = this.filterColumnId();
    if (!id) {
      this.filterChange.emit(value);
      return;
    }
    this._table.getColumn(id)?.setFilterValue(value);
  }

  /**
   * Row/card click handler. Ignores clicks originating from nested interactive
   * elements (selection checkboxes, action buttons, links, inputs) so those
   * controls keep working without also firing `rowClick`.
   */
  protected _onRowClick(event: MouseEvent, row: Row<EgDataTableFeatures, TData>): void {
    const target = event.target as Element | null;
    if (target instanceof Element && target.closest('button, a, input, select, textarea, [role="checkbox"]')) {
      return;
    }
    this.rowClick.emit(row.original);
  }

  /** Show the inline TH sort button only for sortable plain-string headers (component headers own their UI). */
  protected _showHeaderSortButton(header: Header<EgDataTableFeatures, TData, unknown>): boolean {
    return header.column.getCanSort() && typeof header.column.columnDef.header === 'string';
  }

  protected _toggleHeaderSorting(header: Header<EgDataTableFeatures, TData, unknown>): void {
    header.column.toggleSorting(header.column.getIsSorted() === 'asc');
  }

  protected _selectionCell(
    row: Row<EgDataTableFeatures, TData>,
  ): Cell<EgDataTableFeatures, TData, CellData> | undefined {
    return row.getVisibleCells().find((cell) => cell.column.id === 'select') as
      | Cell<EgDataTableFeatures, TData, CellData>
      | undefined;
  }

  protected _thumbnailCell(
    row: Row<EgDataTableFeatures, TData>,
  ): Cell<EgDataTableFeatures, TData, CellData> | undefined {
    return row.getVisibleCells().find((cell) => cell.column.columnDef.meta?.thumbnail === true) as
      | Cell<EgDataTableFeatures, TData, CellData>
      | undefined;
  }

  protected _contentCells(row: Row<EgDataTableFeatures, TData>): Cell<EgDataTableFeatures, TData, CellData>[] {
    return row
      .getVisibleCells()
      .filter((cell) => cell.column.id !== 'select' && cell.column.columnDef.meta?.thumbnail !== true) as Cell<
      EgDataTableFeatures,
      TData,
      CellData
    >[];
  }

  protected _cellLabel(cell: Cell<EgDataTableFeatures, TData, CellData>): string {
    const header = cell.column.columnDef.header;
    if (typeof header === 'string') return header;
    return cell.column.id.replace(/_/g, ' ');
  }
}
