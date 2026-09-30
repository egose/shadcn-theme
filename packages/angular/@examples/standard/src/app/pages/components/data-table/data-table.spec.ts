import { provideZonelessChangeDetection, type WritableSignal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { DataTablePage } from './data-table';

interface Payment {
  readonly id: string;
  readonly amount: number;
  readonly status: 'pending' | 'processing' | 'success' | 'failed';
  readonly email: string;
}

describe('Data table selection demo identity', () => {
  it('keeps the selected payment ID on immutable reorder/refresh and drops deleted IDs', async () => {
    await TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection(), provideRouter([])],
    }).compileComponents();
    const fixture = TestBed.createComponent(DataTablePage);
    const page = fixture.componentInstance as unknown as {
      payments: WritableSignal<Payment[]>;
      selected(): readonly Payment[];
    };
    const render = async () => {
      fixture.detectChanges();
      await fixture.whenStable();
    };
    await render();
    const table = (fixture.nativeElement as HTMLElement).querySelector('eg-data-table')!;
    table.querySelector<HTMLElement>('eg-table-row-selection [role="checkbox"]')!.click();
    await render();
    const selected = page.payments()[0];
    expect(page.selected()).toEqual([selected]);
    const refreshed = { ...selected, amount: 1234 };
    page.payments.set([...page.payments().slice(1), refreshed]);
    await render();
    expect(page.selected()).toEqual([refreshed]);
    expect(page.selected()[0]).toBe(refreshed);
    expect(table.querySelector('[data-state="selected"]')?.textContent).toContain(selected.email);
    page.payments.set(page.payments().filter((payment) => payment.id !== selected.id));
    await render();
    expect(page.selected()).toEqual([]);
    page.payments.set([selected, ...page.payments()]);
    await render();
    expect(page.selected()).toEqual([]);
    expect(table.querySelector('[data-state="selected"]')).toBeNull();
  });
});
