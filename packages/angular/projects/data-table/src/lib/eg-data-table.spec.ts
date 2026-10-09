import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { HlmCheckbox } from '@egose/shadcn-theme-ng/checkbox';
import { createColumnHelper, type SortingState } from '@tanstack/angular-table';
import { EgDataTable, EgDataTableColumnHeader, type EgPaginationNavMode } from '../public-api';
import { defaultEgDataTableFeatures, type EgDataTableFeatures } from './eg-data-table-features';
import type { EgSortableColumn } from './eg-data-table-column-header';
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

@Component({
  selector: 'eg-data-table-size-host',
  imports: [EgDataTable],
  template: `<eg-data-table [columns]="columns" [data]="data" size="sm" />`,
})
class SizeHostComponent {
  protected readonly columns = columns;
  protected readonly data: Person[] = [...PEOPLE];
}

function cellTexts(fixture: { nativeElement: HTMLElement }): string[] {
  return Array.from(fixture.nativeElement.querySelectorAll('tbody td')).map((cell) =>
    (cell as HTMLElement).textContent?.trim(),
  );
}

describe('EgDataTable', () => {
  describe('selection identity', () => {
    const identify = (person: Person) => person.email;

    async function setup(layout: 'table' | 'grid' = 'table', stableIds = true) {
      const fixture = TestBed.createComponent(EgDataTable<Person>);
      fixture.componentRef.setInput('columns', columns);
      fixture.componentRef.setInput('gridColumns', columns);
      fixture.componentRef.setInput('layout', layout);
      fixture.componentRef.setInput('enableSelection', true);
      fixture.componentRef.setInput('showToolbar', true);
      fixture.componentRef.setInput('filterColumnId', 'email');
      fixture.componentRef.setInput('data', PEOPLE);
      if (stableIds) fixture.componentRef.setInput('getRowId', identify);
      const emissions: (readonly Person[])[] = [];
      fixture.componentInstance.selectionChange.subscribe((rows) => emissions.push(rows));
      const settle = async () => {
        fixture.detectChanges();
        await fixture.whenStable();
      };
      const click = async (selector: string) => {
        fixture.debugElement.query(By.css(selector)).nativeElement.click();
        await settle();
      };
      const selectedNames = () =>
        Array.from(fixture.nativeElement.querySelectorAll('[data-state="selected"]')).map((element) =>
          (element as HTMLElement).textContent?.trim(),
        );
      const filter = async (value: string) => {
        const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
        input.value = value;
        input.dispatchEvent(new Event('input'));
        await settle();
      };
      await settle();
      return { fixture, emissions, settle, click, selectedNames, filter };
    }

    for (const layout of ['table', 'grid'] as const) {
      it(`preserves stable identity through reorder, refresh, deletion and pre-filtering in ${layout}`, async () => {
        const { fixture, emissions, settle, click, selectedNames } = await setup(layout);
        await click('eg-table-row-selection [role="checkbox"]');
        expect(emissions.at(-1)).toEqual([PEOPLE[0]]);
        emissions.length = 0;

        fixture.componentRef.setInput('data', [PEOPLE[1], PEOPLE[0]]);
        await settle();
        expect(selectedNames().length).toBe(1);
        expect(selectedNames()[0]).toContain('Grace');
        expect(emissions).toEqual([]);

        const refreshed = { ...PEOPLE[0], name: 'Grace refreshed' };
        fixture.componentRef.setInput('data', [PEOPLE[1], refreshed]);
        await settle();
        expect(emissions).toEqual([[refreshed]]);
        expect(emissions[0][0]).toBe(refreshed);
        expect(selectedNames()[0]).toContain('Grace refreshed');

        fixture.componentRef.setInput('filterRows', (rows: readonly Person[]) =>
          rows.filter((row) => row.email === identify(refreshed)),
        );
        await settle();
        expect(selectedNames()[0]).toContain('Grace refreshed');
        expect(emissions).toEqual([[refreshed]]);

        emissions.length = 0;
        fixture.componentRef.setInput('data', [PEOPLE[1]]);
        await settle();
        expect(emissions).toEqual([[]]);
        expect(selectedNames()).toEqual([]);
        fixture.componentRef.setInput('data', [refreshed, PEOPLE[1]]);
        fixture.componentRef.setInput('filterRows', null);
        await settle();
        expect(selectedNames()).toEqual([]);
        expect(emissions).toEqual([[]]);
      });

      it(`limits server selection to loaded IDs and never emits a replacement entity in ${layout}`, async () => {
        const { fixture, emissions, settle, click, selectedNames } = await setup(layout);
        const page = (items: Person[], offset = 0): EgPaginatedResponse<Person> => ({
          items,
          offset,
          limit: 1,
          total: 2,
          hasPrevious: offset > 0,
          hasNext: offset === 0,
        });
        fixture.componentRef.setInput('manualPagination', true);
        fixture.componentRef.setInput('data', page([PEOPLE[0]]));
        await settle();
        await click('eg-table-row-selection [role="checkbox"]');
        emissions.length = 0;

        const refreshed = { ...PEOPLE[0] };
        fixture.componentRef.setInput('data', page([refreshed]));
        await settle();
        expect(emissions).toEqual([[refreshed]]);
        expect(emissions[0][0]).toBe(refreshed);
        expect(selectedNames()[0]).toContain('Grace');

        emissions.length = 0;
        fixture.componentRef.setInput('data', page([PEOPLE[1]], 1));
        await settle();
        expect(emissions).toEqual([[]]);
        expect(selectedNames()).toEqual([]);
        fixture.componentRef.setInput('data', page([refreshed]));
        await settle();
        expect(selectedNames()).toEqual([]);
        expect(emissions).toEqual([[]]);

        await click('eg-table-row-selection [role="checkbox"]');
        emissions.length = 0;
        fixture.componentRef.setInput('data', null);
        await settle();
        fixture.componentRef.setInput('data', page([refreshed]));
        await settle();
        expect(emissions).toEqual([[]]);
        expect(selectedNames()).toEqual([]);
      });
    }

    it('keeps built-in filtered selections attached to their records and shares table/grid controls', async () => {
      const { fixture, emissions, settle, click, selectedNames, filter } = await setup();
      await click('eg-table-row-selection [role="checkbox"]');
      emissions.length = 0;
      await click('button[aria-label="Sort by name"]');
      expect(selectedNames()[0]).toContain('Grace');
      await filter('ada');
      expect(selectedNames()).toEqual([]);
      expect(emissions).toEqual([]);
      expect(
        fixture.nativeElement.querySelector('eg-table-head-selection [role="checkbox"]').getAttribute('aria-checked'),
      ).toBe('false');
      await click('eg-table-head-selection [role="checkbox"]');
      expect(emissions.at(-1)).toEqual(PEOPLE);
      await filter('');
      expect(selectedNames().length).toBe(2);
      await click('button[aria-label="Grid view"]');
      expect(selectedNames().length).toBe(2);
      // Sorted Ada is first in grid; clearing her must leave only Grace selected.
      await click('eg-table-row-selection [role="checkbox"]');
      expect(emissions.at(-1)).toEqual([PEOPLE[0]]);
      await click('button[aria-label="Table view"]');
      expect(selectedNames()[0]).toContain('Grace');
      // Both the table model and the actual focusable checkbox expose mixed state.
      expect(
        fixture.debugElement
          .query(By.css('eg-table-head-selection'))
          .query(By.directive(HlmCheckbox))
          .componentInstance.checked(),
      ).toBe('indeterminate');
      expect(
        fixture.nativeElement.querySelector('eg-table-head-selection [role="checkbox"]').getAttribute('aria-checked'),
      ).toBe('mixed');
      await settle();
      expect(emissions).toEqual([PEOPLE, [PEOPLE[0]]]);
    });

    it('preserves client selections across pages and header selection affects only the displayed page', async () => {
      const { fixture, emissions, settle, click, selectedNames } = await setup();
      fixture.componentRef.setInput('defaultPageSize', 1);
      await settle();
      await click('eg-table-head-selection [role="checkbox"]');
      expect(emissions.at(-1)).toEqual([PEOPLE[0]]);
      await click('button[aria-label="Go to next page"]');
      expect(selectedNames()).toEqual([]);
      await click('eg-table-head-selection [role="checkbox"]');
      expect(emissions.at(-1)).toEqual(PEOPLE);
      await click('eg-table-head-selection [role="checkbox"]');
      expect(emissions.at(-1)).toEqual([PEOPLE[0]]);
    });

    it('selects only the displayed page when its mixed header is clicked', async () => {
      const { fixture, emissions, settle, click, selectedNames } = await setup();
      const third: Person = { name: 'Linus', email: 'linus@example.com' };
      fixture.componentRef.setInput('data', [...PEOPLE, third]);
      fixture.componentRef.setInput('defaultPageSize', 2);
      await settle();
      const headerState = () =>
        fixture.nativeElement.querySelector('eg-table-head-selection [role="checkbox"]').getAttribute('aria-checked');
      expect(headerState()).toBe('false');
      await click('eg-table-row-selection [role="checkbox"]');
      expect(headerState()).toBe('mixed');
      await click('eg-table-head-selection [role="checkbox"]');
      expect(headerState()).toBe('true');
      expect(emissions.at(-1)).toEqual(PEOPLE);
      await click('button[aria-label="Go to next page"]');
      expect(selectedNames()).toEqual([]);
      expect(headerState()).toBe('false');
      await click('button[aria-label="Go to previous page"]');
      expect(headerState()).toBe('true');
      await click('eg-table-head-selection [role="checkbox"]');
      expect(headerState()).toBe('false');
      expect(emissions.at(-1)).toEqual([]);
    });

    for (const change of ['reorder', 'refresh', 'pre-filter'] as const) {
      it(`clears no-ID selection on ${change} without emitting another entity`, async () => {
        const { fixture, emissions, settle, click, selectedNames } = await setup('table', false);
        await click('eg-table-row-selection [role="checkbox"]');
        emissions.length = 0;
        if (change === 'pre-filter') {
          fixture.componentRef.setInput('filterRows', (rows: readonly Person[]) => rows.slice(1));
        } else {
          fixture.componentRef.setInput(
            'data',
            change === 'reorder' ? [...PEOPLE].reverse() : PEOPLE.map((row) => ({ ...row })),
          );
        }
        await settle();
        expect(emissions).toEqual([[]]);
        expect(selectedNames()).toEqual([]);
      });
    }

    it('preserves no-ID selection during built-in sorting/filtering while the source array is unchanged', async () => {
      const { emissions, click, selectedNames, filter } = await setup('table', false);
      await click('eg-table-row-selection [role="checkbox"]');
      emissions.length = 0;
      await click('button[aria-label="Sort by name"]');
      expect(selectedNames()[0]).toContain('Grace');
      await filter('ada');
      expect(selectedNames()).toEqual([]);
      await filter('');
      expect(selectedNames()[0]).toContain('Grace');
      expect(emissions).toEqual([]);
    });

    it('discards stable IDs removed by filterRows instead of restoring hidden selections later', async () => {
      const { fixture, emissions, settle, click, selectedNames } = await setup();
      await click('eg-table-row-selection [role="checkbox"]');
      emissions.length = 0;
      fixture.componentRef.setInput('filterRows', (rows: readonly Person[]) => rows.slice(1));
      await settle();
      expect(emissions).toEqual([[]]);
      expect(selectedNames()).toEqual([]);
      fixture.componentRef.setInput('filterRows', null);
      await settle();
      expect(selectedNames()).toEqual([]);
      expect(emissions).toEqual([[]]);
    });

    it('clears no-ID selection on server page replacement', async () => {
      const { fixture, emissions, settle, click, selectedNames } = await setup('table', false);
      const page: EgPaginatedResponse<Person> = {
        items: [PEOPLE[0]],
        total: 2,
        limit: 1,
        offset: 0,
        hasPrevious: false,
        hasNext: true,
      };
      fixture.componentRef.setInput('manualPagination', true);
      fixture.componentRef.setInput('data', page);
      await settle();
      await click('eg-table-row-selection [role="checkbox"]');
      emissions.length = 0;
      fixture.componentRef.setInput('data', { ...page, items: [PEOPLE[1]], offset: 1 });
      await settle();
      expect(emissions).toEqual([[]]);
      expect(selectedNames()).toEqual([]);
    });

    it('reports selected rows in current source order after a stable-ID reorder', async () => {
      const { fixture, emissions, settle, click } = await setup();
      await click('eg-table-head-selection [role="checkbox"]');
      emissions.length = 0;
      fixture.componentRef.setInput('data', [...PEOPLE].reverse());
      await settle();
      expect(emissions).toEqual([[PEOPLE[1], PEOPLE[0]]]);
    });

    it('seeds stable IDs only for present rows and clears selection if the identity callback changes', async () => {
      const fixture = TestBed.createComponent(EgDataTable<Person>);
      fixture.componentRef.setInput('columns', columns);
      fixture.componentRef.setInput('data', [PEOPLE[0]]);
      fixture.componentRef.setInput('getRowId', identify);
      fixture.componentRef.setInput('enableSelection', true);
      fixture.componentRef.setInput('initialRowSelection', {
        [identify(PEOPLE[0])]: true,
        [identify(PEOPLE[1])]: true,
      });
      const emissions: (readonly Person[])[] = [];
      fixture.componentInstance.selectionChange.subscribe((rows) => emissions.push(rows));
      fixture.detectChanges();
      await fixture.whenStable();
      expect(emissions).toEqual([[PEOPLE[0]]]);
      fixture.componentRef.setInput('data', PEOPLE);
      fixture.detectChanges();
      await fixture.whenStable();
      expect(emissions).toEqual([[PEOPLE[0]]]);
      fixture.componentRef.setInput('getRowId', (person: Person) => person.name);
      fixture.detectChanges();
      await fixture.whenStable();
      expect(emissions).toEqual([[PEOPLE[0]], []]);
      fixture.debugElement.query(By.css('eg-table-row-selection [role="checkbox"]')).nativeElement.click();
      fixture.detectChanges();
      await fixture.whenStable();
      const refreshed = { ...PEOPLE[0] };
      fixture.componentRef.setInput('data', [refreshed, PEOPLE[1]]);
      fixture.detectChanges();
      await fixture.whenStable();
      expect(emissions).toEqual([[PEOPLE[0]], [], [PEOPLE[0]], [refreshed]]);
      expect(emissions.at(-1)?.[0]).toBe(refreshed);
    });

    it('does not loop or renotify when an output handler reads signals and copies the data array', async () => {
      const { fixture, emissions, settle, click } = await setup();
      const consumerState = signal(0);
      fixture.componentInstance.selectionChange.subscribe(() => {
        consumerState();
        fixture.componentRef.setInput('data', [...PEOPLE]);
      });
      await click('eg-table-row-selection [role="checkbox"]');
      expect(emissions).toEqual([[], [PEOPLE[0]]]);
      consumerState.set(1);
      fixture.componentRef.setInput('isLoading', true);
      await settle();
      fixture.componentRef.setInput('isLoading', false);
      await settle();
      expect(emissions).toEqual([[], [PEOPLE[0]]]);
    });
  });

  for (const layout of ['table', 'grid'] as const) {
    it(`clears positional selection before a replacement can select another entity in ${layout} layout`, async () => {
      const fixture = TestBed.createComponent(EgDataTable<Person>);
      fixture.componentRef.setInput('columns', columns);
      fixture.componentRef.setInput('gridColumns', columns);
      fixture.componentRef.setInput('layout', layout);
      fixture.componentRef.setInput('enableSelection', true);
      fixture.componentRef.setInput('data', [PEOPLE[0]]);
      const emissions: (readonly Person[])[] = [];
      fixture.componentInstance.selectionChange.subscribe((rows) => emissions.push(rows));
      fixture.detectChanges();
      await fixture.whenStable();

      fixture.debugElement.query(By.css('eg-table-row-selection [role="checkbox"]')).nativeElement.click();
      fixture.detectChanges();
      await fixture.whenStable();
      expect(emissions.at(-1)).toEqual([PEOPLE[0]]);
      emissions.length = 0;

      fixture.componentRef.setInput('data', [PEOPLE[1]]);
      fixture.detectChanges();
      await fixture.whenStable();
      expect(emissions).toEqual([[]]);
      expect(fixture.nativeElement.querySelector('[data-state="selected"]')).toBeNull();
      expect(
        fixture.nativeElement.querySelector('eg-table-row-selection [role="checkbox"]').getAttribute('aria-checked'),
      ).toBe('false');
    });
  }

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

  it('applies density classes in sm size mode', async () => {
    const fixture = TestBed.createComponent(SizeHostComponent);
    fixture.detectChanges();
    await fixture.whenStable();

    expect((fixture.debugElement.query(By.css('th')).nativeElement as HTMLElement).className).toContain('tw:h-8');
    expect((fixture.debugElement.query(By.css('tbody td')).nativeElement as HTMLElement).className).toContain('tw:p-1');
  });

  it('exposes the default feature registry', () => {
    expect(defaultEgDataTableFeatures).toBeDefined();
  });

  describe('column hiding', () => {
    function mockColumn(canHide: boolean | undefined): EgSortableColumn {
      return {
        id: 'email',
        getCanSort: () => true,
        getIsSorted: () => false,
        toggleSorting: () => {},
        toggleVisibility: () => {},
        ...(canHide === undefined ? {} : { getCanHide: () => canHide }),
      };
    }

    it('hides the header Hide item when the column cannot hide', () => {
      const hidden = TestBed.createComponent(EgDataTableColumnHeader);
      hidden.componentRef.setInput('column', mockColumn(false));
      hidden.componentRef.setInput('title', 'Email');
      hidden.detectChanges();
      expect((hidden.componentInstance as unknown as { _canHide: () => boolean })._canHide()).toBeFalse();

      const shown = TestBed.createComponent(EgDataTableColumnHeader);
      shown.componentRef.setInput('column', mockColumn(true));
      shown.componentRef.setInput('title', 'Email');
      shown.detectChanges();
      expect((shown.componentInstance as unknown as { _canHide: () => boolean })._canHide()).toBeTrue();

      const legacy = TestBed.createComponent(EgDataTableColumnHeader);
      legacy.componentRef.setInput('column', mockColumn(undefined));
      legacy.componentRef.setInput('title', 'Email');
      legacy.detectChanges();
      expect((legacy.componentInstance as unknown as { _canHide: () => boolean })._canHide()).toBeTrue();
    });

    it('disables hiding by default so columns cannot be hidden without the View menu', async () => {
      const fixture = TestBed.createComponent(EgDataTable<Person>);
      fixture.componentRef.setInput('columns', columns);
      fixture.componentRef.setInput('data', PEOPLE);
      fixture.detectChanges();
      await fixture.whenStable();

      const table = (
        fixture.componentInstance as unknown as {
          _table: {
            getAllColumns: () => {
              getCanHide: () => boolean;
              getIsVisible: () => boolean;
              toggleVisibility: (v: boolean) => void;
            }[];
          };
        }
      )._table;
      const email = table.getAllColumns().find((column) => column.getCanHide !== undefined);
      expect(table.getAllColumns().every((column) => column.getCanHide() === false)).toBeTrue();
      // TanStack ignores hide requests when hiding is disabled — no dead-end.
      email?.toggleVisibility(false);
      fixture.detectChanges();
      await fixture.whenStable();
      expect(table.getAllColumns().every((column) => column.getIsVisible() === true)).toBeTrue();
    });

    it('enables hiding when showColumnToggle is set', async () => {
      const fixture = TestBed.createComponent(EgDataTable<Person>);
      fixture.componentRef.setInput('columns', columns);
      fixture.componentRef.setInput('data', PEOPLE);
      fixture.componentRef.setInput('showToolbar', true);
      fixture.componentRef.setInput('showColumnToggle', true);
      fixture.detectChanges();
      await fixture.whenStable();

      const table = (
        fixture.componentInstance as unknown as {
          _table: {
            getAllColumns: () => {
              id: string;
              getCanHide: () => boolean;
              getIsVisible: () => boolean;
              toggleVisibility: (v: boolean) => void;
            }[];
          };
        }
      )._table;
      expect(table.getAllColumns().every((column) => column.getCanHide() === true)).toBeTrue();
      table
        .getAllColumns()
        .find((column) => column.id === 'email')
        ?.toggleVisibility(false);
      fixture.detectChanges();
      await fixture.whenStable();
      expect(
        table
          .getAllColumns()
          .find((column) => column.id === 'email')
          ?.getIsVisible(),
      ).toBeFalse();
    });

    it('keeps per-column enableHiding: false disabled even with showColumnToggle', async () => {
      const fixed = columnHelper.columns([
        columnHelper.accessor('name', { header: 'Name', enableHiding: false }),
        columnHelper.accessor('email', { header: 'Email' }),
      ]);
      const fixture = TestBed.createComponent(EgDataTable<Person>);
      fixture.componentRef.setInput('columns', fixed);
      fixture.componentRef.setInput('data', PEOPLE);
      fixture.componentRef.setInput('showToolbar', true);
      fixture.componentRef.setInput('showColumnToggle', true);
      fixture.detectChanges();
      await fixture.whenStable();

      const table = (
        fixture.componentInstance as unknown as {
          _table: { getColumn: (id: string) => { getCanHide: () => boolean } | undefined };
        }
      )._table;
      expect(table.getColumn('name')?.getCanHide()).toBeFalse();
      expect(table.getColumn('email')?.getCanHide()).toBeTrue();
    });
  });
});
