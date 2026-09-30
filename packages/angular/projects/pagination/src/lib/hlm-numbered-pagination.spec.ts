import { Component, inject, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { By } from '@angular/platform-browser';
import { ActivatedRoute, provideRouter, Router } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { BrnSelect } from '@spartan-ng/brain/select';
import { createPageArray, HlmNumberedPagination, outOfBoundCorrection } from './hlm-numbered-pagination';
import { HlmNumberedPaginationQueryParams } from './hlm-numbered-pagination-query-params';

@Component({
  imports: [HlmNumberedPagination, HlmNumberedPaginationQueryParams],
  template: `
    @if (query) {
      <hlm-numbered-pagination-query-params
        [(currentPage)]="page"
        [(itemsPerPage)]="size"
        [totalItems]="total()"
        [maxSize]="range()"
        [showEdges]="showEdges()"
        (currentPageChange)="changes.push($event)"
      />
    } @else {
      <hlm-numbered-pagination
        [(currentPage)]="page"
        [(itemsPerPage)]="size"
        [totalItems]="total()"
        [maxSize]="range()"
        [showEdges]="showEdges()"
        (currentPageChange)="changes.push($event)"
      />
    }
  `,
})
class PaginationHost {
  query = false;
  page = signal(5);
  size = signal(10);
  total = signal(100);
  range = signal(7);
  showEdges = signal(true);
  changes: number[] = [];
}

describe('numbered pagination normalization', () => {
  beforeEach(() => TestBed.configureTestingModule({ providers: [provideRouter([])] }));

  it('corrects an empty collection in the exported helper', () => {
    expect(outOfBoundCorrection(0, 10, 5)).toBe(1);
  });

  for (const query of [false, true]) {
    describe(query ? 'query params' : 'client state', () => {
      let fixture: ComponentFixture<PaginationHost>;
      let host: PaginationHost;

      beforeEach(() => {
        fixture = TestBed.createComponent(PaginationHost);
        host = fixture.componentInstance;
        host.query = query;
        fixture.detectChanges();
      });

      it('resets a later page exactly once when results become empty', () => {
        host.total.set(0);
        fixture.detectChanges();
        fixture.detectChanges();
        expect(host.page()).toBe(1);
        expect(host.changes).toEqual([1]);
        expect(fixture.nativeElement.querySelector('hlm-pagination-next')).toBeNull();
        expect(fixture.nativeElement.querySelector('hlm-pagination-previous')).toBeNull();
        expect(fixture.nativeElement.querySelector('[aria-current="page"]').textContent.trim()).toBe('1');
      });

      it('derives page links without writing the model or emitting', () => {
        const pager = fixture.debugElement.query(
          By.directive(query ? HlmNumberedPaginationQueryParams : HlmNumberedPagination),
        ).componentInstance;
        host.changes = [];
        pager.currentPage.set(50);
        host.changes = [];
        expect(pager['_pages']()).toEqual([1, '...', 6, 7, 8, 9, 10]);
        expect(pager.currentPage()).toBe(50);
        expect(host.changes).toEqual([]);
      });

      it('clamps total, size and external page changes, then remains stable', () => {
        host.total.set(21);
        fixture.detectChanges();
        expect(host.page()).toBe(3);
        host.size.set(20);
        fixture.detectChanges();
        expect(host.page()).toBe(2);
        host.page.set(99);
        fixture.detectChanges();
        expect(host.page()).toBe(2);
        host.page.set(-1);
        fixture.detectChanges();
        expect(host.page()).toBe(1);
        host.page.set(2.9);
        fixture.detectChanges();
        expect(host.page()).toBe(2);
        host.total.set(100);
        host.size.set(10);
        fixture.detectChanges();
        expect(host.page()).toBe(2);
        fixture.detectChanges();
        expect(host.changes).toEqual([3, 2, 2, 1, 2]);
      });

      it('clamps when the page-size selector changes the size model', () => {
        const select = fixture.debugElement.query(By.directive(BrnSelect)).injector.get(BrnSelect);
        select.value.set(50);
        fixture.detectChanges();
        expect(host.size()).toBe(50);
        expect(host.page()).toBe(2);
        expect(host.changes).toEqual([2]);
      });

      for (const size of [0, -10, NaN, Infinity, -Infinity]) {
        it(`treats size ${size} as one page without rewriting the size or looping`, () => {
          host.size.set(size);
          fixture.detectChanges();
          fixture.detectChanges();
          expect(host.page()).toBe(1);
          expect(Object.is(host.size(), size)).toBeTrue();
          expect(host.changes).toEqual([1]);
          expect(fixture.nativeElement.querySelector('hlm-pagination-next')).toBeNull();
          expect(fixture.nativeElement.querySelector('hlm-pagination-previous')).toBeNull();
          host.size.set(10);
          fixture.detectChanges();
          expect(fixture.nativeElement.querySelector('hlm-pagination-next')).not.toBeNull();
          expect(host.changes).toEqual([1]);
        });
      }

      for (const total of [-1, NaN, Infinity, -Infinity]) {
        it(`treats total ${total} as one page and recovers when results return`, () => {
          host.total.set(total);
          fixture.detectChanges();
          fixture.detectChanges();
          expect(host.page()).toBe(1);
          expect(host.changes).toEqual([1]);
          host.total.set(100);
          fixture.detectChanges();
          expect(host.page()).toBe(1);
          expect(fixture.nativeElement.querySelector('hlm-pagination-next')).not.toBeNull();
        });
      }

      for (const page of [NaN, Infinity, -Infinity]) {
        it(`corrects page ${page} exactly once`, () => {
          host.page.set(page);
          fixture.detectChanges();
          fixture.detectChanges();
          expect(host.page()).toBe(1);
          expect(host.changes).toEqual([1]);
        });
      }

      it('bounds rendered windows for huge totals, tiny sizes and huge ranges', () => {
        host.total.set(Number.MAX_VALUE);
        host.size.set(Number.MIN_VALUE);
        host.range.set(Number.MAX_VALUE);
        host.page.set(Number.MAX_VALUE);
        fixture.detectChanges();
        expect(host.page()).toBe(Number.MAX_SAFE_INTEGER);
        expect(fixture.nativeElement.querySelectorAll('li[hlmPaginationItem]').length).toBe(101);
        expect(fixture.nativeElement.querySelector('hlm-pagination-next')).toBeNull();
        expect(fixture.nativeElement.querySelector('[aria-current="page"]').textContent.trim()).toBe(
          String(Number.MAX_SAFE_INTEGER),
        );
      });

      it('keeps valid models unchanged and honors hidden edges', () => {
        host.showEdges.set(false);
        fixture.detectChanges();
        expect(host.changes).toEqual([]);
        expect(fixture.nativeElement.querySelector('hlm-pagination-next')).toBeNull();
        expect(fixture.nativeElement.querySelector('hlm-pagination-previous')).toBeNull();
      });

      if (!query) {
        it('bounds direct previous/next/first/last handlers even before correction runs', () => {
          const pager = fixture.debugElement.query(By.directive(HlmNumberedPagination)).componentInstance;
          pager.currentPage.set(-30);
          host.changes = [];
          pager.goToPrevious();
          pager.goToPrevious();
          expect(host.changes).toEqual([1]);
          pager.currentPage.set(300);
          host.changes = [];
          pager.goToNext();
          pager.goToNext();
          expect(host.changes).toEqual([10]);
          pager.goToFirst();
          pager.goToLast();
          expect(host.changes).toEqual([10, 1, 10]);
          host.total.set(0);
          fixture.detectChanges();
          host.changes = [];
          pager.goToPrevious();
          pager.goToNext();
          pager.goToFirst();
          pager.goToLast();
          expect(host.page()).toBe(1);
          expect(host.changes).toEqual([]);
        });

        it('moves through rendered page and edge controls without duplicate boundary emissions', () => {
          fixture.nativeElement.querySelector('hlm-pagination-next a').click();
          fixture.detectChanges();
          expect(host.page()).toBe(6);
          fixture.nativeElement.querySelector('hlm-pagination-previous a').click();
          fixture.detectChanges();
          expect(host.page()).toBe(5);
          const first = Array.from(fixture.nativeElement.querySelectorAll('a')).find(
            (a) => (a as HTMLAnchorElement).textContent?.trim() === '1',
          ) as HTMLAnchorElement;
          first.click();
          fixture.detectChanges();
          expect(host.page()).toBe(1);
          first.click();
          fixture.detectChanges();
          expect(host.changes).toEqual([6, 5, 1]);
          expect(fixture.nativeElement.querySelector('hlm-pagination-previous')).toBeNull();
        });
      }
    });
  }
});

describe('page-window arithmetic', () => {
  it('preserves ordinary start, middle and end windows', () => {
    expect(createPageArray(1, 10, 100, 7)).toEqual([1, 2, 3, 4, 5, '...', 10]);
    expect(createPageArray(5, 10, 100, 7)).toEqual([1, '...', 4, 5, 6, '...', 10]);
    expect(createPageArray(10, 10, 100, 7)).toEqual([1, '...', 6, 7, 8, 9, 10]);
    expect(createPageArray(2, 10, 30, 7)).toEqual([1, 2, 3]);
  });

  it('uses ceil division for positive fractional totals and sizes', () => {
    expect(createPageArray(2, 0.5, 2.1, 7)).toEqual([1, 2, 3, 4, 5]);
    expect(outOfBoundCorrection(2.1, 0.5, 6)).toBe(5);
  });

  it('keeps small windows contiguous, within their budget and containing the active page', () => {
    for (const range of [0.5, 1, 2, 3, 4, 4.9]) {
      const budget = Math.max(1, Math.floor(range));
      for (const page of [1, 5, 10]) {
        const pages = createPageArray(page, 10, 100, range);
        expect(pages.length).toBe(budget);
        expect(pages).toContain(page);
        expect(pages.every((p) => typeof p === 'number' && p >= 1 && p <= 10)).toBeTrue();
      }
    }
  });

  it('defaults invalid ranges and caps huge finite ranges before allocating', () => {
    for (const range of [0, -1, NaN, Infinity, -Infinity]) {
      expect(createPageArray(1, 10, 100, range)).toEqual([1, 2, 3, 4, 5, '...', 10]);
    }
    for (const page of [1, 5e15, Number.MAX_VALUE]) {
      const pages = createPageArray(page, Number.MIN_VALUE, Number.MAX_VALUE, Number.MAX_VALUE);
      expect(pages.length).toBe(100);
      expect(pages).toContain(outOfBoundCorrection(Number.MAX_VALUE, Number.MIN_VALUE, page));
      const numbers = pages.filter((p): p is number => typeof p === 'number');
      expect(numbers.every((p) => Number.isSafeInteger(p) && p >= 1 && p <= Number.MAX_SAFE_INTEGER)).toBeTrue();
      expect(new Set(numbers).size).toBe(numbers.length);
    }
  });

  it('normalizes invalid arithmetic consistently in both exported helpers', () => {
    for (const invalid of [0, -1, NaN, Infinity, -Infinity]) {
      expect(outOfBoundCorrection(100, invalid, 5)).toBe(1);
      expect(createPageArray(5, invalid, 100, 7)).toEqual([1]);
      expect(outOfBoundCorrection(invalid, 10, 5)).toBe(1);
      expect(createPageArray(5, 10, invalid, 7)).toEqual([1]);
    }
    for (const page of [NaN, Infinity, -Infinity, -1, 0]) {
      expect(outOfBoundCorrection(100, 10, page)).toBe(1);
      expect(createPageArray(page, 10, 100, 7)).toEqual(createPageArray(1, 10, 100, 7));
    }
    expect(outOfBoundCorrection(100, 10, 5.9)).toBe(5);
  });
});

@Component({
  imports: [HlmNumberedPaginationQueryParams],
  template: `
    <hlm-numbered-pagination-query-params
      [(currentPage)]="page"
      [(itemsPerPage)]="size"
      [totalItems]="total()"
      [link]="link()"
      (currentPageChange)="changes.push($event)"
    />
  `,
})
class RoutedPaginationHost {
  page = signal(1);
  size = signal(10);
  total = signal(100);
  link = signal('.');
  changes: number[] = [];

  constructor() {
    inject(ActivatedRoute)
      .queryParamMap.pipe(takeUntilDestroyed())
      .subscribe((params) => {
        this.page.set(Number(params.get('page') ?? 1));
      });
  }
}

describe('pagination route contract', () => {
  let harness: RouterTestingHarness;
  let router: Router;
  let host: RoutedPaginationHost;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [provideRouter([{ path: '**', component: RoutedPaginationHost }])],
    });
    router = TestBed.inject(Router);
    harness = await RouterTestingHarness.create();
    host = await harness.navigateByUrl('/items?page=5&filter=open&tag=a&tag=b', RoutedPaginationHost);
  });

  function anchors(): HTMLAnchorElement[] {
    return Array.from(harness.routeNativeElement!.querySelectorAll('a'));
  }

  function assertLinks(last: number, path = '/items') {
    for (const anchor of anchors().filter((a) => a.hasAttribute('href'))) {
      const url = router.parseUrl(anchor.getAttribute('href')!);
      expect('/' + url.root.children['primary'].segments.map((s) => s.path).join('/')).toBe(path);
      expect(url.queryParams['filter']).toBe('open');
      expect(url.queryParams['tag']).toEqual(['a', 'b']);
      const page = Number(url.queryParams['page']);
      expect(Number.isSafeInteger(page) && page >= 1 && page <= last).toBeTrue();
    }
    expect(harness.routeNativeElement!.querySelector('[aria-current="page"]')!.hasAttribute('href')).toBeFalse();
  }

  it('merges unrelated and repeated query params for previous, numbered and next links', async () => {
    assertLinks(10);
    for (const [selector, expected] of [
      ['hlm-pagination-next a', 6],
      ['hlm-pagination-previous a', 5],
      ['a[href*="page=1&"]', 1],
    ] as const) {
      (harness.routeNativeElement!.querySelector(selector) as HTMLAnchorElement).click();
      await harness.fixture.whenStable();
      harness.detectChanges();
      expect(host.page()).toBe(expected);
      expect(router.parseUrl(router.url).queryParams).toEqual({
        page: String(expected),
        filter: 'open',
        tag: ['a', 'b'],
      });
      assertLinks(10);
    }
    expect(host.changes).toEqual([]);
    expect(harness.routeNativeElement!.querySelector('hlm-pagination-previous')).toBeNull();
  });

  it('corrects the model without automatic navigation, including empty results and size changes', async () => {
    const originalUrl = router.url;
    const navigate = spyOn(router, 'navigate').and.callThrough();
    const navigateByUrl = spyOn(router, 'navigateByUrl').and.callThrough();
    host.total.set(21);
    harness.detectChanges();
    await harness.fixture.whenStable();
    expect(host.page()).toBe(3);
    assertLinks(3);
    host.size.set(20);
    harness.detectChanges();
    await harness.fixture.whenStable();
    expect(host.page()).toBe(2);
    assertLinks(2);
    host.total.set(0);
    harness.detectChanges();
    await harness.fixture.whenStable();
    harness.detectChanges();
    expect(host.page()).toBe(1);
    expect(host.changes).toEqual([3, 2, 1]);
    expect(anchors().filter((a) => a.hasAttribute('href'))).toEqual([]);
    expect(router.url).toBe(originalUrl);
    expect(navigate).not.toHaveBeenCalled();
    expect(navigateByUrl).not.toHaveBeenCalled();
  });

  it('uses a configured link path while preserving query parameters', () => {
    host.link.set('/archive');
    harness.detectChanges();
    assertLinks(10, '/archive');
  });

  it('handles route-driven page changes and invalid deep links with bounded links', async () => {
    for (const [value, expected] of [
      ['99', 10],
      ['NaN', 1],
      ['-5', 1],
      ['2.9', 2],
      ['7', 7],
    ] as const) {
      await harness.navigateByUrl(`/items?page=${value}&filter=open&tag=a&tag=b`, RoutedPaginationHost);
      expect(host.page()).toBe(expected);
      assertLinks(10);
      expect(router.parseUrl(router.url).queryParams['page']).toBe(value);
    }
    expect(host.changes).toEqual([10, 1, 1, 2]);
  });
});
