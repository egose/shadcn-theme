import { CdkObserveContent } from '@angular/cdk/observers';
import {
  ChangeDetectionStrategy,
  Component,
  type ElementRef,
  computed,
  contentChildren,
  input,
  viewChild,
} from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronLeft, lucideChevronRight } from '@ng-icons/lucide';
import { type BrnPaginatedTabHeaderItem, BrnTabsPaginatedList, BrnTabsTrigger } from '@spartan-ng/brain/tabs';
import { buttonVariants } from '@egose/shadcn-theme-ng/button';
import { HlmIcon } from '@egose/shadcn-theme-ng/icon';
import { cn } from '@egose/shadcn-theme-ng/utils';
import type { ClassValue } from 'clsx';
import type { Observable } from 'rxjs';
import { listVariants } from './tabs-list';

@Component({
  selector: 'hlm-paginated-tabs-list',
  imports: [CdkObserveContent, NgIcon, HlmIcon],
  providers: [provideIcons({ lucideChevronRight, lucideChevronLeft })],
  template: `
    <button
      #previousPaginator
      data-pagination="previous"
      type="button"
      aria-hidden="true"
      tabindex="-1"
      [class.flex]="showPaginationControls()"
      [class.hidden]="!showPaginationControls()"
      [class]="_paginationButtonClass()"
      [disabled]="disableScrollBefore || null"
      (click)="_handlePaginatorClick('before')"
      (mousedown)="_handlePaginatorPress('before', $event)"
      (touchend)="_stopInterval()"
    >
      <ng-icon hlm size="base" name="lucideChevronLeft" />
    </button>

    <div #tabListContainer class="tw:z-[1] tw:flex tw:grow tw:overflow-hidden" (keydown)="_handleKeydown($event)">
      <div
        class="tw:relative tw:grow tw:transition-transform"
        #tabList
        role="tablist"
        (cdkObserveContent)="_onContentChanges()"
      >
        <div #tabListInner [class]="_tabListClass()">
          <ng-content></ng-content>
        </div>
      </div>
    </div>

    <button
      #nextPaginator
      data-pagination="next"
      type="button"
      aria-hidden="true"
      tabindex="-1"
      [class.flex]="showPaginationControls()"
      [class.hidden]="!showPaginationControls()"
      [class]="_paginationButtonClass()"
      [disabled]="disableScrollAfter || null"
      (click)="_handlePaginatorClick('after')"
      (mousedown)="_handlePaginatorPress('after', $event)"
      (touchend)="_stopInterval()"
    >
      <ng-icon hlm size="base" name="lucideChevronRight" />
    </button>
  `,
  host: {
    '[class]': '_computedClass()',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HlmTabsPaginatedList extends BrnTabsPaginatedList {
  public readonly items = contentChildren(BrnTabsTrigger, { descendants: false });
  /** Explicitly annotating type to avoid non-portable inferred type */
  public readonly itemsChanges: Observable<ReadonlyArray<BrnPaginatedTabHeaderItem>> = toObservable(this.items);

  public readonly tabListContainer = viewChild.required<ElementRef<HTMLElement>>('tabListContainer');
  public readonly tabList = viewChild.required<ElementRef<HTMLElement>>('tabList');
  public readonly tabListInner = viewChild.required<ElementRef<HTMLElement>>('tabListInner');
  public readonly nextPaginator = viewChild.required<ElementRef<HTMLElement>>('nextPaginator');
  public readonly previousPaginator = viewChild.required<ElementRef<HTMLElement>>('previousPaginator');

  public readonly userClass = input<ClassValue>('', { alias: 'class' });
  protected readonly _computedClass = computed(() =>
    cn('tw:relative tw:flex tw:flex-shrink-0 tw:gap-1 tw:overflow-hidden', this.userClass()),
  );

  public readonly tabListClass = input<ClassValue>('', { alias: 'tabListClass' });
  protected readonly _tabListClass = computed(() => cn(listVariants(), this.tabListClass()));

  public readonly paginationButtonClass = input<ClassValue>('', { alias: 'paginationButtonClass' });
  protected readonly _paginationButtonClass = computed(() =>
    cn(
      'tw:relative tw:z-[2] tw:select-none tw:disabled:cursor-default',
      buttonVariants({ variant: 'ghost', size: 'icon' }),
      this.paginationButtonClass(),
    ),
  );

  protected _itemSelected(event: KeyboardEvent) {
    event.preventDefault();
  }
}
