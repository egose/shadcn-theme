import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { createColumnHelper, type SortingState } from '@tanstack/angular-table';
import { EgDataTable, type EgPaginationNavMode } from '../public-api';
import { defaultEgDataTableFeatures, type EgDataTableFeatures } from './eg-data-table-features';
import type { EgPaginatedResponse } from './eg-paginated-response';

interface Person {
  readonly name: string;
  readonly email: string;
}

const columnHelper = createColumnHelper<EgDataTableFeatures, Person>();
const columns = columnHelper.columns([
  columnHelper.accessor('name', { header: 'Name' }),
  columnHelper.accessor('email', { header: 'Email' }),
]);

const PEOPLE: Person[] = [
  { name: 'Grace', email: 'grace@example.com' },
  { name: 'Ada', email: 'ada@example.com' },
];

@Component({
  selector: 'eg-data-table-host',
  imports: [EgDataTable],
  template: `<eg-data-table [columns]="columns" [data]="data()" [emptyMessage]="emptyMessage" />`,
})
class HostComponent {
  protected readonly columns = columns;
  readonly data = signal<Person[]>([...PEOPLE]);
  protected readonly emptyMessage = 'Nothing here.';
}

@Component({
  selector: 'eg-data-table-select-host',
  imports: [EgDataTable],
  template: `<eg-data-table
    [columns]="columns"
    [data]="data"
    [enableSelection]="true"
    (rowClick)="clicked.push($event)"
  />`,
})
class SelectHostComponent {
  protected readonly columns = columns;
  protected readonly data: Person[] = [...PEOPLE];
  clicked: Person[] = [];
}

@Component({
  selector: 'eg-data-table-server-host',
  imports: [EgDataTable],
  template: `<eg-data-table
    [columns]="columns"
    [data]="page"
    [manualPagination]="true"
    (pageChange)="pageIndex = $event"
  />`,
})
class ServerHostComponent {
  protected readonly columns = columns;
  protected page: EgPaginatedResponse<Person> | null = {
    items: [PEOPLE[0]],
    total: 2,
    limit: 1,
    offset: 0,
    hasPrevious: false,
    hasNext: true,
  };
  pageIndex = -1;
}

@Component({
  selector: 'eg-data-table-page-size-host',
  imports: [EgDataTable],
  template: `<eg-data-table
    [columns]="columns"
    [data]="data"
    [pageSizes]="[5, 10]"
    [defaultPageSize]="5"
    (pageSizeChange)="pageSize = $event"
  />`,
})
class PageSizeHostComponent {
  protected readonly columns = columns;
  protected readonly data: Person[] = [
    ...PEOPLE,
    { name: 'Marie', email: 'marie@example.com' },
    { name: 'Alan', email: 'alan@example.com' },
    { name: 'Katherine', email: 'katherine@example.com' },
    { name: 'Tim', email: 'tim@example.com' },
  ];
  pageSize = -1;
}

@Component({
  selector: 'eg-data-table-initial-host',
  imports: [EgDataTable],
  template: `<eg-data-table
    [columns]="columns"
    [data]="data"
    [enableSelection]="true"
    [initialSorting]="[{ id: 'name', desc: false }]"
    [initialRowSelection]="{ '1': true }"
    (selectionChange)="selected = $event"
  />`,
})
class InitialHostComponent {
  protected readonly columns = columns;
  protected readonly data: Person[] = [...PEOPLE];
  selected: readonly Person[] = [];
}

@Component({
  selector: 'eg-data-table-filter-host',
  imports: [EgDataTable],
  template: `<eg-data-table
    [columns]="columns"
    [data]="data"
    [showToolbar]="true"
    filterColumnId="email"
    (filterChange)="filterValue = $event"
  />`,
})
class FilterHostComponent {
  protected readonly columns = columns;
  protected readonly data: Person[] = [...PEOPLE];
  filterValue = '';
}

@Component({
  selector: 'eg-data-table-toolbar-host',
  imports: [EgDataTable],
  template: `<eg-data-table
    [columns]="columns"
    [data]="data"
    [showToolbar]="true"
    (filterChange)="filterValue = $event"
  />`,
})
class ToolbarHostComponent {
  protected readonly columns = columns;
  protected readonly data: Person[] = [...PEOPLE];
  filterValue = 'unset';
}

@Component({
  selector: 'eg-data-table-server-manual-host',
  imports: [EgDataTable],
  template: `<eg-data-table
    [columns]="columns"
    [data]="page"
    [manualPagination]="true"
    [showToolbar]="true"
    filterColumnId="email"
    (sortingChange)="sorting = $event"
    (filterChange)="filterValue = $event"
  />`,
})
class ServerManualHostComponent {
  protected readonly columns = columns;
  protected page: EgPaginatedResponse<Person> = {
    items: [
      { name: 'Zoe', email: 'zoe@example.com' },
      { name: 'Amy', email: 'amy@example.com' },
    ],
    total: 2,
    limit: 10,
    offset: 0,
    hasPrevious: false,
    hasNext: false,
  };
  sorting: SortingState = [];
  filterValue = 'unset';
}

@Component({
  selector: 'eg-data-table-filter-rows-host',
  imports: [EgDataTable],
  template: `<eg-data-table [columns]="columns" [data]="data" [filterRows]="onlyAda" />`,
})
class FilterRowsHostComponent {
  protected readonly columns = columns;
  protected readonly data: Person[] = [...PEOPLE];
  protected readonly onlyAda = (rows: readonly Person[]): readonly Person[] => rows.filter((row) => row.name === 'Ada');
}

@Component({
  selector: 'eg-data-table-actions-host',
  imports: [EgDataTable],
  template: `<eg-data-table
      [columns]="columns"
      [data]="data"
      [showToolbar]="showToolbar()"
      [toolbarActions]="actions"
    />
    <ng-template #actions><button type="button">Export</button></ng-template>`,
})
class ActionsHostComponent {
  protected readonly columns = columns;
  protected readonly data: Person[] = [...PEOPLE];
  readonly showToolbar = signal(false);
}

@Component({
  selector: 'eg-data-table-nav-mode-host',
  imports: [EgDataTable],
  template: `<eg-data-table [columns]="columns" [data]="data" [defaultPageSize]="5" [navMode]="navMode()" />`,
})
class NavModeHostComponent {
  protected readonly columns = columns;
  protected readonly data: Person[] = [
    ...PEOPLE,
    { name: 'Marie', email: 'marie@example.com' },
    { name: 'Alan', email: 'alan@example.com' },
    { name: 'Katherine', email: 'katherine@example.com' },
    { name: 'Tim', email: 'tim@example.com' },
  ];
  readonly navMode = signal<EgPaginationNavMode>('text');
}

function cellTexts(fixture: { nativeElement: HTMLElement }): string[] {
  return Array.from(fixture.nativeElement.querySelectorAll('tbody td')).map((cell) =>
    (cell as HTMLElement).textContent?.trim(),
  );
}

describe('EgDataTable', () => {
  it('renders rows and headers from columns + data', async () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    await fixture.whenStable();

    const text = fixture.nativeElement.textContent as string;
    expect(text).toContain('Name');
    expect(text).toContain('Ada');
  });

  it('shows the empty message when there are no rows', async () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.componentInstance.data.set([]);
    fixture.detectChanges();
    await fixture.whenStable();

    expect(fixture.nativeElement.textContent).toContain('Nothing here.');
  });

  it('sorts by a plain-string header via the inline sort button', async () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    await fixture.whenStable();
    expect(cellTexts(fixture)[0]).toBe('Grace');

    fixture.debugElement.query(By.css('button[aria-label="Sort by name"]')).nativeElement.click();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(cellTexts(fixture)[0]).toBe('Ada');
  });

  it('prepends a selection column when enableSelection is set', async () => {
    const fixture = TestBed.createComponent(SelectHostComponent);
    fixture.detectChanges();
    await fixture.whenStable();

    // One header checkbox + one per row.
    expect(fixture.debugElement.queryAll(By.css('hlm-checkbox')).length).toBe(3);
  });

  it('emits rowClick for row clicks but not for checkbox clicks', async () => {
    const fixture = TestBed.createComponent(SelectHostComponent);
    fixture.detectChanges();
    await fixture.whenStable();

    const cells = fixture.debugElement.queryAll(By.css('tbody tr:first-child td'));
    cells[1].nativeElement.click();
    expect(fixture.componentInstance.clicked).toEqual([PEOPLE[0]]);

    // A real pointer click lands on the inner checkbox element (role="checkbox"),
    // which the row handler must ignore.
    fixture.debugElement.query(By.css('tbody tr:first-child hlm-checkbox [role="checkbox"]')).nativeElement.click();
    fixture.detectChanges();
    expect(fixture.componentInstance.clicked).toEqual([PEOPLE[0]]);
  });

  it('renders a server page slice with range status and emits pageChange', async () => {
    const fixture = TestBed.createComponent(ServerHostComponent);
    fixture.detectChanges();
    await fixture.whenStable();

    expect(fixture.nativeElement.textContent).toContain('Showing 1 to 1 of 2 records');
    expect(cellTexts(fixture)).toEqual(['Grace', 'grace@example.com']);

    fixture.debugElement.query(By.css('button[aria-label="Go to next page"]')).nativeElement.click();
    expect(fixture.componentInstance.pageIndex).toBe(1);
  });

  it('changes page size via the rows-per-page selector', async () => {
    const fixture = TestBed.createComponent(PageSizeHostComponent);
    fixture.detectChanges();
    await fixture.whenStable();
    expect(fixture.nativeElement.textContent).toContain('Rows per page');

    fixture.debugElement.query(By.css('hlm-select-trigger button')).nativeElement.click();
    fixture.detectChanges();
    await fixture.whenStable();
    await fixture.whenStable();

    const items = Array.from(document.querySelectorAll('hlm-select-item')) as HTMLElement[];
    expect(items.map((item) => item.textContent?.trim())).toEqual(['5', '10']);
    items[1].click();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(fixture.componentInstance.pageSize).toBe(10);
    document.querySelector('.cdk-overlay-container')?.remove();
  });

  it('seeds sorting and selection from the initial* inputs', async () => {
    const fixture = TestBed.createComponent(InitialHostComponent);
    fixture.detectChanges();
    await fixture.whenStable();

    // Data order is Grace, Ada — seeded ascending sort puts Ada first.
    // Index 0 is the auto selection-checkbox cell.
    expect(cellTexts(fixture)[1]).toBe('Ada');
    // Row id '1' (Ada) was preselected.
    expect(fixture.componentInstance.selected).toEqual([PEOPLE[1]]);
  });

  it('emits filterChange with the toolbar filter string', async () => {
    const fixture = TestBed.createComponent(FilterHostComponent);
    fixture.detectChanges();
    await fixture.whenStable();

    const input = fixture.debugElement.query(By.css('input')).nativeElement as HTMLInputElement;
    input.value = 'grace';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    await fixture.whenStable();

    expect(fixture.componentInstance.filterValue).toBe('grace');
    expect(cellTexts(fixture)).toEqual(['Grace', 'grace@example.com']);
  });

  it('renders the filter input without a column id and emits raw text', async () => {
    const fixture = TestBed.createComponent(ToolbarHostComponent);
    fixture.detectChanges();
    await fixture.whenStable();

    // No filterColumnId: the input still renders and keystrokes emit filterChange directly.
    const input = fixture.debugElement.query(By.css('input')).nativeElement as HTMLInputElement;
    input.value = 'server query';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    await fixture.whenStable();

    expect(fixture.componentInstance.filterValue).toBe('server query');
    // Client rows are untouched without a column id.
    expect(cellTexts(fixture)).toEqual(['Grace', 'grace@example.com', 'Ada', 'ada@example.com']);
    // Column toggle is opt-in since showColumnToggle defaults to false.
    expect(fixture.nativeElement.textContent).not.toContain('View');
  });

  it('leaves the slice untouched in server mode but reports sort and filter changes', async () => {
    const fixture = TestBed.createComponent(ServerManualHostComponent);
    fixture.detectChanges();
    await fixture.whenStable();
    expect(cellTexts(fixture)[0]).toBe('Zoe');

    fixture.debugElement.query(By.css('button[aria-label="Sort by name"]')).nativeElement.click();
    fixture.detectChanges();
    await fixture.whenStable();

    // Order untouched — the caller refetches — but the change is reported.
    expect(cellTexts(fixture)[0]).toBe('Zoe');
    expect(fixture.componentInstance.sorting).toEqual([{ id: 'name', desc: false }]);

    const input = fixture.debugElement.query(By.css('input')).nativeElement as HTMLInputElement;
    input.value = 'amy';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    await fixture.whenStable();

    expect(fixture.componentInstance.filterValue).toBe('amy');
    expect(cellTexts(fixture).length).toBe(4);
  });

  it('applies filterRows before the built-in pipeline', async () => {
    const fixture = TestBed.createComponent(FilterRowsHostComponent);
    fixture.detectChanges();
    await fixture.whenStable();

    expect(cellTexts(fixture)).toEqual(['Ada', 'ada@example.com']);
  });

  it('renders custom toolbar actions on the right with or without the toolbar', async () => {
    const fixture = TestBed.createComponent(ActionsHostComponent);
    fixture.detectChanges();
    await fixture.whenStable();

    // Actions alone render the row without the filter input.
    expect(fixture.nativeElement.textContent).toContain('Export');
    expect(fixture.debugElement.query(By.css('input'))).toBeNull();

    fixture.componentInstance.showToolbar.set(true);
    fixture.detectChanges();
    await fixture.whenStable();

    // Built-ins join on the left.
    expect(fixture.debugElement.query(By.css('input'))).not.toBeNull();
    expect(fixture.nativeElement.textContent).toContain('Export');
  });

  it('renders text pager labels in text nav mode', async () => {
    const fixture = TestBed.createComponent(NavModeHostComponent);
    fixture.detectChanges();
    await fixture.whenStable();

    const text = fixture.nativeElement.textContent as string;
    expect(text).toContain('Previous');
    expect(text).toContain('Next');
    expect(fixture.debugElement.query(By.css('button[aria-label="Go to next page"] svg'))).toBeNull();

    fixture.componentInstance.navMode.set('both');
    fixture.detectChanges();
    await fixture.whenStable();

    expect(fixture.nativeElement.textContent).toContain('Next');
    expect(fixture.debugElement.query(By.css('button[aria-label="Go to next page"] svg'))).not.toBeNull();
  });

  it('exposes the default feature registry', () => {
    expect(defaultEgDataTableFeatures).toBeDefined();
  });
});
