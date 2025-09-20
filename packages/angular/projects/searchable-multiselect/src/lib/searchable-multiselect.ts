import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
  input,
  output,
  viewChild,
  effect,
  forwardRef,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { HlmAutocomplete } from '@egose/shadcn-theme-ng/autocomplete';

export interface SelectOption {
  label: string;
  value: string;
}

@Component({
  selector: 'eg-searchable-multiselect',
  standalone: true,
  imports: [HlmAutocomplete],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => EgSearchableMultiselect),
      multi: true,
    },
  ],
  template: `
    <div class="tw:flex tw:flex-col tw:gap-2 tw:w-full">
      <!-- Selected items -->
      <div
        class="tw:flex tw:gap-2 tw:overflow-x-auto tw:whitespace-nowrap
               tw:[scrollbar-width:none] tw:[-ms-overflow-style:none]
               tw:[&::-webkit-scrollbar]:hidden"
      >
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

      <!-- Autocomplete -->
      <hlm-autocomplete
        [filteredOptions]="filteredOptionLabels()"
        [(search)]="search"
        (valueChange)="addItemByLabel($event)"
        [searchPlaceholderText]="this.selectedItems().length.toString() + ' of ' + this.options().length + ' selected'"
        [onSelect]="handleSelect.bind(this)"
        [disabled]="isDisabled"
      />
    </div>
  `,
})
export class EgSearchableMultiselect implements ControlValueAccessor {
  autoComplete = viewChild(HlmAutocomplete);

  /** Full option list with labels/values */
  options = input<SelectOption[]>([]);
  placeholder = input<string>('Start typing to add…');

  /** Value: array of selected values (string[]) */
  value = input<string[]>([]);
  valueChange = output<string[]>(); // emits string[] of values

  /** Internal state */
  search = signal<string>('');
  selectedItems = signal<SelectOption[]>([]); // full objects for display
  isDisabled = false;
  private isFormBound = false;

  /** Filtered **labels** for hlm-autocomplete */
  filteredOptionLabels = computed(
    () =>
      (this.options() || [])
        .filter(
          (opt) =>
            opt.label.toLowerCase().includes(this.search().toLowerCase()) &&
            !this.selectedItems().some((sel) => sel.value === opt.value),
        )
        .map((opt) => opt.label), // convert to string[] for hlm-autocomplete
  );

  /** Form callbacks */
  private onChange: (value: string[]) => void = () => {};
  private onTouched: () => void = () => {};

  constructor() {
    // Sync `value` input to selectedItems for standalone usage
    effect(() => {
      if (!this.isFormBound) {
        this.updateSelectedFromValues(this.value() || []);
      }
    });
  }

  /** Add by label string (from autocomplete) */
  addItemByLabel(label: string) {
    const opt = this.options()?.find((o) => o.label === label);
    if (opt) {
      this.addItem(opt.value);
    }
  }

  /** Add by value string */
  addItem(value: string) {
    if (!this.selectedItems().some((sel) => sel.value === value)) {
      const opt = this.options()?.find((o) => o.value === value);
      if (!opt) return;
      const updatedItems = [...this.selectedItems(), opt];
      this.updateValueFromSelected(updatedItems);
    }
  }

  /** Remove by value string */
  removeItem(value: string) {
    const updatedItems = this.selectedItems().filter((i) => i.value !== value);
    this.updateValueFromSelected(updatedItems);
  }

  /** Clear autocomplete text */
  clearAutocompleteText() {
    this.autoComplete()?.clearText();

    if (this.options().length === this.selectedItems().length) {
      this.autoComplete()?.setPopoverState('closed');
    }
  }

  handleSelect(label: string) {
    this.clearAutocompleteText();
  }

  /** Map string[] values → full objects */
  private updateSelectedFromValues(values: string[]) {
    const opts = this.options() || [];
    const matched = opts.filter((o) => values.includes(o.value));
    this.selectedItems.set(matched);
  }

  /** Map full objects → string[] values and emit */
  private updateValueFromSelected(items: SelectOption[]) {
    this.selectedItems.set(items);
    const values = items.map((i) => i.value);
    this.valueChange.emit(values);
    this.onChange(values);
    this.onTouched();
  }

  // --- ControlValueAccessor ---
  writeValue(values: string[] | null): void {
    this.isFormBound = true;
    this.updateSelectedFromValues(values || []);
  }

  registerOnChange(fn: (value: string[]) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }
}
