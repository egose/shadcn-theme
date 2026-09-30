import {
  ChangeDetectionStrategy,
  Component,
  computed,
  forwardRef,
  input,
  linkedSignal,
  output,
  signal,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { HlmPopover, HlmPopoverContent, HlmPopoverPortal, HlmPopoverTrigger } from '@egose/shadcn-theme-ng/popover';
import { HlmButton } from '@egose/shadcn-theme-ng/button';
import { HlmCheckbox } from '@egose/shadcn-theme-ng/checkbox';
import { hlm } from '@egose/shadcn-theme-ng/utils';
import { ClassValue } from 'clsx';

export interface SelectOption {
  label: string;
  value: string;
}

/**
 * Chip multiselect with local, case-insensitive label search over the complete options input.
 * Filtering never changes selected IDs or chip labels. Search edits do not emit or touch the form.
 * Import from `@egose/shadcn-theme-ng/searchable-multiselect` (or the `-tw` variant).
 */
@Component({
  selector: 'eg-searchable-multiselect',
  standalone: true,
  imports: [HlmPopover, HlmPopoverTrigger, HlmPopoverContent, HlmPopoverPortal, HlmButton, HlmCheckbox],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => EgSearchableMultiselect),
      multi: true,
    },
  ],
  host: {
    '[class]': '_hostClass()',
  },
  template: `
    <div class="tw:flex tw:flex-col tw:gap-2 tw:w-full">
      <!-- Selected chips -->
      <div class="tw:flex tw:flex-wrap tw:gap-2">
        @if (selectedItems().length === 0) {
          <span
            class="tw:bg-gray-100 tw:text-gray-400 tw:rounded-full
                   tw:px-2 tw:py-1 tw:inline-flex tw:items-center tw:text-xs"
          >
            {{ placeholder() }}
          </span>
        } @else {
          @for (item of selectedItems(); track item.value) {
            <span
              class="tw:bg-gray-200 tw:rounded-full tw:px-2 tw:py-1
                     tw:inline-flex tw:items-center tw:gap-2 tw:text-xs"
            >
              {{ item.label }}
              <button
                type="button"
                [disabled]="disabledState()"
                [attr.aria-label]="removeLabel()(item)"
                (click)="removeItem(item.value)"
                class="tw:bg-transparent tw:border-0 tw:text-gray-600
                       tw:hover:text-red-500 tw:cursor-pointer"
              >
                ✕
              </button>
            </span>
          }
        }
      </div>

      <!-- Trigger -->
      <hlm-popover>
        <button
          hlmPopoverTrigger
          hlmButton
          variant="secondary"
          appearance="outline"
          type="button"
          [id]="id()"
          [disabled]="disabledState()"
          [attr.aria-label]="ariaLabel()"
          [attr.aria-describedby]="ariaDescribedby()"
        >
          {{ selectedItems().length }} selected
        </button>

        <hlm-popover-content class="tw:w-64 tw:p-2" *hlmPopoverPortal="let ctx">
          <label class="tw:flex tw:flex-col tw:gap-1 tw:text-sm">
            <span>{{ searchLabel() }}</span>
            <input
              #search
              type="search"
              [value]="searchQuery()"
              [placeholder]="searchPlaceholder()"
              [disabled]="disabledState()"
              (input)="updateSearch(search.value)"
              (keydown.enter)="$event.preventDefault()"
              class="tw:w-full tw:rounded-md tw:border tw:border-input tw:bg-transparent tw:px-2 tw:py-1 tw:outline-none tw:focus-visible:ring-2 tw:focus-visible:ring-ring tw:disabled:opacity-50"
            />
          </label>
          <div class="tw:max-h-60 tw:overflow-auto tw:flex tw:flex-col tw:gap-1">
            @for (option of filteredOptions(); track option.value) {
              <label
                class="tw:flex tw:items-center tw:gap-2 tw:cursor-pointer tw:px-2 tw:py-1 tw:rounded-sm tw:hover:bg-secondary"
              >
                <hlm-checkbox
                  [checked]="isSelected(option.value)"
                  [disabled]="disabledState()"
                  (changed)="toggle(option.value, $event)"
                />
                <span class="tw:text-sm">{{ option.label }}</span>
              </label>
            }
          </div>
          <div role="status" aria-live="polite" aria-atomic="true" class="tw:text-xs tw:text-muted-foreground">
            @if (filteredOptions().length === 0) {
              {{ emptyMessage() }}
            }
          </div>
        </hlm-popover-content>
      </hlm-popover>
    </div>
  `,
})
export class EgSearchableMultiselect implements ControlValueAccessor {
  /** Full option list with labels/values */
  options = input<SelectOption[]>([]);
  placeholder = input<string>('Start typing to add…');
  /** Visible, associated label for the native search field; provide nonempty localized text. */
  searchLabel = input<string>('Search options');
  /** Search field hint, independent of the empty-selection chip placeholder. */
  searchPlaceholder = input<string>('Type to filter…');
  /** Polite live-region message when no supplied option labels match, including an empty options list. */
  emptyMessage = input<string>('No matching options');
  /** Accessible remove name from the current chip label (raw ID when unresolved). Supply a pure formatter. */
  removeLabel = input<(option: SelectOption) => string>((option) => `Remove ${option.label}`);
  id = input<string>('');
  disabled = input<boolean>(false);
  wrapperDisabled = input<boolean>(false);
  ariaLabel = input<string | undefined>(undefined);
  ariaDescribedby = input<string | null>(null);

  userClass = input<ClassValue>('', { alias: 'class' });

  /** Standalone selected IDs. New input arrays replace local edits; ignored after the first CVA writeValue. */
  value = input<string[]>([]);
  /** User selection changes only; external input/CVA writes and option updates do not emit. */
  valueChange = output<string[]>();

  // Undefined means standalone ownership; even a null CVA write takes form ownership with an empty array.
  private readonly formValue = signal<string[] | undefined>(undefined);
  private readonly selectedValues = linkedSignal(() => [...(this.formValue() ?? this.value())]);
  protected readonly selectedItems = computed(() => {
    const options = new Map(this.options().map((option) => [option.value, option]));
    return this.selectedValues().map((value) => options.get(value) ?? { value, label: value });
  });
  protected readonly formDisabled = signal(false);
  protected readonly disabledState = computed(() => this.disabled() || this.wrapperDisabled() || this.formDisabled());
  // Local UI state persists across popover closes and external writes; it never owns selection.
  protected readonly searchQuery = signal('');
  protected readonly filteredOptions = computed(() => {
    const query = this.searchQuery().trim().toLowerCase();
    return this.options().filter((option) => option.label.toLowerCase().includes(query));
  });

  protected readonly _hostClass = computed(() => hlm(this.userClass()));

  protected updateSearch(query: string): void {
    if (this.disabledState()) return;
    this.searchQuery.set(query);
  }

  protected isSelected(value: string): boolean {
    return this.selectedValues().includes(value);
  }

  protected toggle(value: string, checked: boolean): void {
    if (this.disabledState()) return;
    if (checked) {
      this.addItem(value);
    } else {
      this.removeItem(value);
    }
  }

  protected addItem(value: string): void {
    if (this.disabledState() || this.isSelected(value) || !this.options().some((option) => option.value === value))
      return;
    this.updateValueFromSelected([...this.selectedValues(), value]);
  }

  protected removeItem(value: string): void {
    if (this.disabledState() || !this.isSelected(value)) return;
    const updated = this.selectedValues().filter((selected) => selected !== value);
    this.updateValueFromSelected(updated);
  }

  private updateValueFromSelected(values: string[]): void {
    this.selectedValues.set(values);
    // Neither consumer channel owns the internal array or the other channel's payload.
    this.valueChange.emit([...values]);
    this.onChange([...values]);
    this.onTouched();
  }

  // --- ControlValueAccessor ---
  private onChange: (value: string[]) => void = () => {};
  private onTouched: () => void = () => {};

  /** Takes CVA ownership, retaining all IDs independently of options. Null clears; never emits or touches. */
  writeValue(values: string[] | null): void {
    this.formValue.set([...(values ?? [])]);
  }

  registerOnChange(fn: (value: string[]) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.formDisabled.set(isDisabled);
  }
}
