import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EgLayoutSearch, type LayoutSearchLoader } from './search';

@Component({
  imports: [EgLayoutSearch],
  template: `
    <eg-layout-search
      [loader]="load"
      [resultLabel]="label"
      [resultTemplate]="result"
      placeholder="Search demos"
      (resultSelected)="selected = $event"
    />
    <ng-template #result let-item
      ><span data-search-result>{{ item.label }}</span></ng-template
    >
  `,
})
class SearchHost {
  load: LayoutSearchLoader<{ label: string }> = async () => [{ label: 'Button' }];
  label = (item: { label: string }) => item.label;
  selected?: { label: string };
}

describe('EgLayoutSearch', () => {
  let fixture: ComponentFixture<SearchHost>;
  const pause = (ms = 220) => new Promise((resolve) => setTimeout(resolve, ms));
  const input = () => document.querySelector<HTMLInputElement>('input[type="search"]')!;
  function typeQuery(query: string): void {
    input().value = query;
    input().dispatchEvent(new Event('input', { bubbles: true }));
    fixture.detectChanges();
  }
  async function open(): Promise<void> {
    fixture.detectChanges();
    fixture.nativeElement.querySelector('button').click();
    fixture.detectChanges();
    await fixture.whenStable();
    await pause(30);
    fixture.detectChanges();
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [SearchHost] }).compileComponents();
    fixture = TestBed.createComponent(SearchHost);
  });
  afterEach(() => fixture.destroy());

  it('loads the bound loader on opening and renders the consumer result template', async () => {
    const loader = spyOn(fixture.componentInstance, 'load').and.callThrough();
    fixture.detectChanges();
    expect(loader).not.toHaveBeenCalled();
    await open();
    expect(loader).toHaveBeenCalledOnceWith({ search: '' });
    expect(document.querySelector('[data-search-result]')?.textContent).toBe('Button');
    expect(input().getAttribute('aria-label')).toBe('Search demos');
  });

  it('debounces queries and ignores stale responses', async () => {
    let finishOldRequest!: (items: { label: string }[]) => void;
    const loader = jasmine.createSpy('loader').and.callFake(({ search }: { search: string }) => {
      if (search === 'old')
        return new Promise<{ label: string }[]>((resolve) => {
          finishOldRequest = resolve;
        });
      return Promise.resolve([{ label: search || 'Initial' }]);
    });
    fixture.componentInstance.load = loader;
    await open();
    typeQuery('o');
    typeQuery('old');
    await pause();
    expect(loader).toHaveBeenCalledWith({ search: 'old' });
    expect(loader).not.toHaveBeenCalledWith({ search: 'o' });
    typeQuery('new');
    await pause();
    fixture.detectChanges();
    finishOldRequest([{ label: 'Stale' }]);
    await pause(0);
    fixture.detectChanges();
    expect(document.querySelector('[data-search-result]')?.textContent).toBe('new');
  });

  it('shows a recoverable error instead of treating a failure as no matches', async () => {
    const loader = jasmine.createSpy('loader');
    loader.and.callFake(async () => {
      throw new Error('offline');
    });
    fixture.componentInstance.load = loader;
    await open();
    expect(document.querySelector('[role="status"]')?.textContent).toContain('unavailable');
    loader.and.callFake(async () => [{ label: 'Recovered' }]);
    document.querySelector<HTMLButtonElement>('[role="status"] button')!.click();
    fixture.detectChanges();
    await pause(30);
    fixture.detectChanges();
    expect(document.querySelector('[data-search-result]')?.textContent).toBe('Recovered');
  });

  it('moves focus to results with ArrowDown, emits selection, and closes', async () => {
    await open();
    input().focus();
    input().dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true, cancelable: true }));
    const result = document.querySelector('[data-search-result]')!.parentElement as HTMLButtonElement;
    expect(document.activeElement).toBe(result);
    result.click();
    fixture.detectChanges();
    await fixture.whenStable();
    await pause(100);
    expect(fixture.componentInstance.selected).toEqual({ label: 'Button' });
    expect(input()).toBeNull();
  });
});
