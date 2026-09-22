import {
  ChangeDetectionStrategy,
  Component,
  effect,
  ElementRef,
  input,
  output,
  signal,
  TemplateRef,
  viewChild,
  viewChildren,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { HlmPopover, HlmPopoverContent, HlmPopoverPortal, HlmPopoverTrigger } from '@egose/shadcn-theme-ng/popover';
import { HlmInput } from '@egose/shadcn-theme-ng/input';
import { NgIcon } from '@ng-icons/core';
import { lucideSearch } from '@ng-icons/lucide';

/** Called when search opens and after the query changes. Return already-filtered results. */
export type LayoutSearchLoader<TItem> = (params: { search: string }) => Promise<readonly TItem[]>;
export interface LayoutSearchResultContext<TItem> {
  $implicit: TItem;
}

/** Async page search with debouncing, stale-response protection, and keyboard navigation. */
@Component({
  selector: 'eg-layout-search',
  imports: [NgTemplateOutlet, HlmPopover, HlmPopoverTrigger, HlmPopoverContent, HlmPopoverPortal, HlmInput, NgIcon],
  host: { class: 'tw:block tw:min-w-0' },
  template: `
    <hlm-popover
      [state]="isOpen() ? 'open' : 'closed'"
      (stateChanged)="setOpen($event === 'open')"
      (closed)="setOpen(false)"
    >
      <button
        hlmPopoverTrigger
        type="button"
        class="tw:flex tw:min-h-11 tw:w-full tw:items-center tw:gap-2 tw:rounded-lg tw:border tw:border-border tw:bg-foreground/3 tw:px-3 tw:text-left tw:text-sm tw:text-foreground/75 tw:cursor-pointer tw:hover:bg-foreground/5 tw:focus-visible:outline-2 tw:focus-visible:outline-offset-2 tw:focus-visible:outline-ring tw:md:w-56"
      >
        <ng-icon [svg]="searchIcon" size="16px" aria-hidden="true" class="tw:shrink-0" />
        <span class="tw:truncate">{{ placeholder() }}</span>
      </button>
      <hlm-popover-content *hlmPopoverPortal class="tw:w-80 tw:max-w-[calc(100vw-2rem)] tw:p-2">
        <input
          #searchInput
          hlmInput
          type="search"
          autocomplete="off"
          [value]="query()"
          (input)="query.set($any($event.target).value)"
          [placeholder]="placeholder()"
          [attr.aria-label]="placeholder()"
          (keydown.arrowdown)="focusResult(0, $event)"
          class="tw:mb-2 tw:min-h-11"
        />
        <div [attr.aria-busy]="isLoading()" class="tw:max-h-72 tw:overflow-y-auto tw:overscroll-contain">
          @if (isLoading()) {
            <p role="status" class="tw:px-3 tw:py-6 tw:text-center tw:text-sm tw:text-foreground/75">
              {{ loadingText() }}
            </p>
          } @else if (hasError()) {
            <div role="status" class="tw:space-y-3 tw:px-3 tw:py-4 tw:text-sm">
              <p>{{ errorText() }}</p>
              <button
                type="button"
                (click)="retry()"
                class="tw:min-h-11 tw:rounded-md tw:border tw:border-border tw:px-3 tw:font-medium tw:cursor-pointer tw:focus-visible:outline-2 tw:focus-visible:outline-ring"
              >
                {{ retryText() }}
              </button>
            </div>
          } @else if (!results().length) {
            <p role="status" class="tw:px-3 tw:py-6 tw:text-center tw:text-sm tw:text-foreground/75">
              {{ emptyText() }}
            </p>
          } @else {
            @for (result of results(); track $index; let index = $index) {
              <button
                #resultButton
                type="button"
                (click)="selectResult(result)"
                (keydown.arrowdown)="focusResult(index + 1, $event)"
                (keydown.arrowup)="focusResult(index - 1, $event)"
                (keydown.home)="focusResult(0, $event)"
                (keydown.end)="focusResult(results().length - 1, $event)"
                class="tw:flex tw:min-h-11 tw:w-full tw:items-center tw:rounded-md tw:px-3 tw:py-2 tw:text-left tw:text-sm tw:cursor-pointer tw:hover:bg-foreground/5 tw:focus-visible:bg-foreground/10 tw:focus-visible:outline-2 tw:focus-visible:-outline-offset-2 tw:focus-visible:outline-ring"
              >
                @if (resultTemplate(); as template) {
                  <ng-container [ngTemplateOutlet]="template" [ngTemplateOutletContext]="{ $implicit: result }" />
                } @else {
                  {{ labelFor(result) }}
                }
              </button>
            }
          }
        </div>
      </hlm-popover-content>
    </hlm-popover>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EgLayoutSearch<TItem = unknown> {
  readonly placeholder = input('Search pages…');
  readonly emptyText = input('No matching pages found.');
  readonly errorText = input('Search is unavailable. Please try again.');
  readonly loadingText = input('Searching…');
  readonly retryText = input('Try again');
  readonly loader = input<LayoutSearchLoader<TItem>>();
  readonly resultLabel = input<(item: TItem) => string>();
  readonly resultTemplate = input<TemplateRef<LayoutSearchResultContext<TItem>>>();
  readonly resultSelected = output<TItem>();
  protected readonly searchIcon = lucideSearch;
  protected readonly query = signal('');
  protected readonly results = signal<readonly TItem[]>([]);
  protected readonly isOpen = signal(false);
  protected readonly isLoading = signal(false);
  protected readonly hasError = signal(false);
  private readonly retryVersion = signal(0);
  private readonly searchInput = viewChild<ElementRef<HTMLInputElement>>('searchInput');
  private readonly resultButtons = viewChildren<ElementRef<HTMLButtonElement>>('resultButton');

  constructor() {
    effect((onCleanup) => {
      const open = this.isOpen();
      const search = this.query().trim();
      const loader = this.loader();
      this.retryVersion();
      this.results.set([]);
      this.hasError.set(false);
      this.isLoading.set(open && !!loader);
      if (!open || !loader) return;

      // Cleanup also invalidates an in-flight request when the component is destroyed.
      let cancelled = false;
      const timeout = setTimeout(
        async () => {
          try {
            const results = await loader({ search });
            if (!cancelled) this.results.set(results);
          } catch {
            if (!cancelled) this.hasError.set(true);
          } finally {
            if (!cancelled) this.isLoading.set(false);
          }
        },
        search ? 180 : 0,
      );
      onCleanup(() => {
        cancelled = true;
        clearTimeout(timeout);
      });
    });
  }

  protected labelFor(item: TItem): string {
    return this.resultLabel()?.(item) ?? String(item);
  }
  protected setOpen(open: boolean): void {
    this.isOpen.set(open);
    if (!open) this.query.set('');
  }
  protected retry(): void {
    this.retryVersion.update((version) => version + 1);
  }
  protected selectResult(item: TItem): void {
    this.setOpen(false);
    this.resultSelected.emit(item);
  }
  protected focusResult(index: number, event: Event): void {
    const buttons = this.resultButtons();
    if (!buttons.length) return;
    event.preventDefault();
    if (index < 0) this.searchInput()?.nativeElement.focus();
    else buttons[Math.min(index, buttons.length - 1)]?.nativeElement.focus();
  }
}
