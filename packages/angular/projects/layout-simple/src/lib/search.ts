import { ChangeDetectionStrategy, Component, computed, signal, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HlmPopover, HlmPopoverContent, HlmPopoverTrigger } from '@egose/shadcn-theme-ng/popover';
import { HlmInput } from '@egose/shadcn-theme-ng/input';
import { HlmButton } from '@egose/shadcn-theme-ng/button';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideSearch } from '@ng-icons/lucide';

export interface AutocompleteOption<T = unknown> {
  label: string;
  value: T;
  raw?: T;
}

@Component({
  selector: 'eg-generic-autocomplete',
  imports: [FormsModule, HlmPopover, HlmPopoverTrigger, HlmPopoverContent, HlmInput, HlmButton, NgIcon],
  providers: [provideIcons({ lucideSearch })],
  template: `
    <hlm-popover>
      <button
        hlmPopoverTrigger
        hlmButton
        variant="secondary"
        appearance="outline"
        type="button"
        class="tw:w-64 tw:justify-start tw:gap-2 tw:text-muted-foreground"
      >
        <ng-icon name="lucideSearch" size="14px" />
        <span class="tw:truncate">{{ placeholderText() }}</span>
      </button>

      <hlm-popover-content class="tw:w-64 tw:p-2">
        <input
          hlmInput
          [ngModel]="search()"
          (ngModelChange)="search.set($event)"
          [placeholder]="placeholderText()"
          class="tw:mb-2"
        />
        <div class="tw:max-h-60 tw:overflow-auto tw:flex tw:flex-col">
          @if (filtered().length === 0) {
            <span class="tw:text-xs tw:text-muted-foreground tw:px-2 tw:py-2">{{ emptyText() }}</span>
          } @else {
            @for (opt of filtered(); track opt.label) {
              <button
                type="button"
                (click)="select(opt)"
                class="tw:text-left tw:px-2 tw:py-1.5 tw:text-sm tw:rounded-sm tw:hover:bg-secondary tw:cursor-pointer"
              >
                {{ opt.label }}
              </button>
            }
          }
        </div>
      </hlm-popover-content>
    </hlm-popover>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EgGenericAutocomplete<TItem, TParams extends object = { search: string }> {
  placeholderText = input<string>('Select an option');
  emptyText = input<string>('No options found');

  /** Loader function: takes search string, returns options. */
  loaderFn = input<((params: TParams) => Promise<TItem[]>) | undefined>(async () => []);
  transformValueToSearch = input<((value: TItem) => string) | undefined>((value: TItem) => String(value));

  public readonly search = signal<string>('');
  public readonly options = signal<TItem[]>([]);

  protected readonly filtered = computed<AutocompleteOption<TItem>[]>(() => {
    const opts = this.options();
    const search = this.search().toLowerCase();
    const transform = this.transformValueToSearch() ?? ((value: TItem) => String(value));
    const mapped = opts.map((o) => ({ label: transform(o), value: o, raw: o }));
    if (!search) return mapped;
    return mapped.filter((o) => o.label.toLowerCase().includes(search));
  });

  public readonly optionChange = output<TItem>();

  constructor() {
    // Trigger initial load
    this.loadOptions();
  }

  private async loadOptions() {
    const fn = this.loaderFn();
    if (!fn) {
      this.options.set([]);
      return;
    }
    try {
      const params = { search: this.search() } as TParams;
      const result = await fn(params);
      this.options.set(result ?? []);
    } catch {
      this.options.set([]);
    }
  }

  select(opt: AutocompleteOption<TItem>) {
    this.optionChange.emit(opt.value);
    this.search.set('');
  }
}
