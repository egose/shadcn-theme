import { Component, computed, signal } from '@angular/core';
import { DemoHeaderComponent } from '../../../shared/demo-header';
import { DemoSectionComponent } from '../../../shared/demo-section';
import { HlmButton } from '@egose/shadcn-theme-ng/button';
import {
  EgDataTable,
  EgDataTableColumnHeader,
  type EgDataTableFeatures,
  type EgDataTableLayout,
  type EgPaginatedResponse,
  type EgPaginationNavMode,
} from '@egose/shadcn-theme-ng/data-table';
import { createColumnHelper, flexRenderComponent } from '@tanstack/angular-table';

interface Payment {
  readonly id: string;
  readonly amount: number;
  readonly status: 'pending' | 'processing' | 'success' | 'failed';
  readonly email: string;
}

const helper = createColumnHelper<EgDataTableFeatures, Payment>();

const columns = helper.columns([
  helper.accessor('status', {
    header: 'Status',
    cell: (info) => `<span class="tw:capitalize">${info.getValue<string>()}</span>`,
  }),
  helper.accessor('email', {
    header: ({ column }) => flexRenderComponent(EgDataTableColumnHeader, { inputs: { column, title: 'Email' } }),
    cell: (info) => `<div class="tw:lowercase">${info.getValue<string>()}</div>`,
  }),
  helper.accessor('amount', {
    header: 'Amount',
    meta: { hideInTable: false },
    cell: (info) => {
      const formatted = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(
        info.getValue<number>(),
      );
      return `<div class="tw:text-right tw:font-medium">${formatted}</div>`;
    },
  }),
]);

const gridColumns = helper.columns([
  helper.accessor('email', {
    header: 'Email',
    meta: { thumbnail: false },
    cell: (info) => `<div class="tw:lowercase">${info.getValue<string>()}</div>`,
  }),
  helper.accessor('status', {
    header: 'Status',
    cell: (info) => `<span class="tw:capitalize">${info.getValue<string>()}</span>`,
  }),
  helper.accessor('amount', {
    header: 'Amount',
    meta: { hideInTable: true },
    cell: (info) => `<div class="tw:font-semibold">${info.getValue<number>()}</div>`,
  }),
]);

const ALL_PAYMENTS: Payment[] = [
  { id: 'm5gr84i9', amount: 316, status: 'success', email: 'ken99@yahoo.com' },
  { id: '3u1reuv4', amount: 242, status: 'success', email: 'abe45@gmail.com' },
  { id: 'derv1ws0', amount: 837, status: 'processing', email: 'monserrat44@gmail.com' },
  { id: '5kma53ae', amount: 874, status: 'success', email: 'silas22@gmail.com' },
  { id: 'bhqecj4p', amount: 721, status: 'failed', email: 'carmella@hotmail.com' },
  { id: 'k9f2h8s1', amount: 150, status: 'pending', email: 'june44@example.com' },
  { id: 'p4q7r2t9', amount: 990, status: 'processing', email: 'omar@example.com' },
  { id: 'x1y2z3w4', amount: 430, status: 'success', email: 'priya@example.com' },
  { id: 'a7b8c9d0', amount: 275, status: 'failed', email: 'luis@example.com' },
  { id: 'e5f6g7h8', amount: 510, status: 'pending', email: 'nora@example.com' },
  { id: 'i9j0k1l2', amount: 660, status: 'success', email: 'felix@example.com' },
  { id: 'm3n4o5p6', amount: 120, status: 'processing', email: 'ana@example.com' },
];

const PAGE_SIZE = 5;

function slice(pageIndex: number): EgPaginatedResponse<Payment> {
  const offset = pageIndex * PAGE_SIZE;
  const items = ALL_PAYMENTS.slice(offset, offset + PAGE_SIZE);
  return {
    items,
    total: ALL_PAYMENTS.length,
    limit: PAGE_SIZE,
    offset,
    hasPrevious: pageIndex > 0,
    hasNext: offset + PAGE_SIZE < ALL_PAYMENTS.length,
  };
}

@Component({
  selector: 'app-data-table-page',
  imports: [DemoHeaderComponent, DemoSectionComponent, EgDataTable, HlmButton],
  template: `
    <app-demo-header
      title="Data Table"
      description="A generic TanStack-powered table with sorting, filtering, selection, pagination, and an optional card-grid layout."
    />

    <div class="tw:space-y-6">
      <app-demo-section
        kicker="Client"
        title="Sort, filter, select"
        description="Filter input, sortable email header, auto selection column, and footer pager running fully client-side."
      >
        <eg-data-table
          [columns]="columns"
          [data]="payments()"
          [enableSelection]="true"
          [showToolbar]="true"
          filterColumnId="email"
          filterPlaceholder="Filter emails..."
          [showColumnToggle]="true"
          [pageSizes]="[5, 10, 20]"
          [toolbarActions]="clientActions"
          (selectionChange)="selected.set($event)"
          (filterChange)="filterText.set($event)"
        />
        <ng-template #clientActions>
          <button hlmButton variant="secondary" size="sm" type="button" (click)="exportCsv()">Export</button>
        </ng-template>
        <p class="tw:mt-2 tw:text-sm tw:text-slate-600" role="status">
          {{ selected().length }} of {{ payments().length }} row(s) selected. Filter: {{ filterText() || '—' }}
        </p>
      </app-demo-section>

      <app-demo-section
        kicker="Client"
        title="Pre-filter rows"
        description="filterRows pre-filters the array before built-in filtering, sorting, and pagination."
      >
        <label class="tw:mb-2 tw:flex tw:cursor-pointer tw:items-center tw:gap-2 tw:text-sm">
          <input
            type="checkbox"
            class="tw:size-4 tw:accent-slate-900"
            [checked]="hideFailed()"
            (change)="setHideFailed($event)"
          />
          Hide failed payments
        </label>
        <eg-data-table [columns]="columns" [data]="payments()" [filterRows]="paymentFilter()" />
      </app-demo-section>

      <app-demo-section
        kicker="Layout"
        title="Table or grid"
        description="Grid columns reuse the same definitions; the amount column hides in table layout via column meta."
      >
        <eg-data-table [columns]="columns" [gridColumns]="gridColumns" [data]="payments()" [(layout)]="layout" />
      </app-demo-section>

      <app-demo-section
        kicker="Server"
        title="Manual pagination"
        description="Pass a page slice to switch to manual pagination; navigation emits pageChange for fetching. Pager buttons switch between icons, text, and both."
      >
        <div class="tw:mb-2 tw:flex tw:flex-wrap tw:items-center tw:gap-2 tw:text-sm">
          <span class="tw:text-slate-600">Pager buttons:</span>
          <button
            hlmButton
            variant="secondary"
            size="sm"
            type="button"
            [disabled]="navMode() === 'icons'"
            (click)="navMode.set('icons')"
          >
            Icons
          </button>
          <button
            hlmButton
            variant="secondary"
            size="sm"
            type="button"
            [disabled]="navMode() === 'text'"
            (click)="navMode.set('text')"
          >
            Text
          </button>
          <button
            hlmButton
            variant="secondary"
            size="sm"
            type="button"
            [disabled]="navMode() === 'both'"
            (click)="navMode.set('both')"
          >
            Both
          </button>
        </div>
        <eg-data-table
          [columns]="columns"
          [data]="page()"
          [manualPagination]="true"
          [isLoading]="loading()"
          [navMode]="navMode()"
          (pageChange)="load($event)"
        />
      </app-demo-section>
    </div>
  `,
})
export class DataTablePage {
  protected readonly columns = columns;
  protected readonly gridColumns = gridColumns;
  protected readonly payments = signal<Payment[]>(ALL_PAYMENTS.slice(0, 8));
  protected readonly selected = signal<readonly Payment[]>([]);
  protected readonly filterText = signal('');
  protected readonly layout = signal<EgDataTableLayout>('table');

  protected readonly hideFailed = signal(true);
  protected readonly paymentFilter = computed(() => {
    const hide = this.hideFailed();
    return (rows: readonly Payment[]): readonly Payment[] =>
      hide ? rows.filter((row) => row.status !== 'failed') : rows;
  });

  protected readonly page = signal<EgPaginatedResponse<Payment> | null>(slice(0));
  protected readonly loading = signal(false);
  protected readonly navMode = signal<EgPaginationNavMode>('icons');

  protected load(pageIndex: number): void {
    this.loading.set(true);
    window.setTimeout(() => {
      this.page.set(slice(pageIndex));
      this.loading.set(false);
    }, 350);
  }

  protected setHideFailed(event: Event): void {
    this.hideFailed.set((event.target as HTMLInputElement).checked);
  }

  protected exportCsv(): void {
    const lines = this.payments().map((payment) =>
      [payment.id, payment.email, String(payment.amount), payment.status].join(','),
    );
    const blob = new Blob([['id,email,amount,status', ...lines].join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'payments.csv';
    anchor.click();
    URL.revokeObjectURL(url);
  }
}
