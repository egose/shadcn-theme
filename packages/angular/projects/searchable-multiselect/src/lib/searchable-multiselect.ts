import { ChangeDetectionStrategy, Component, computed, forwardRef, input, output, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { HlmPopover, HlmPopoverContent, HlmPopoverTrigger } from '@egose/shadcn-theme-ng/popover';
import { HlmButton } from '@egose/shadcn-theme-ng/button';
import { HlmCheckbox } from '@egose/shadcn-theme-ng/checkbox';
import { hlm } from '@egose/shadcn-theme-ng/utils';
import { ClassValue } from 'clsx';

export interface SelectOption {
  label: string;
  value: string;
}

@Component({
  selector: 'eg-searchable-multiselect',
  standalone: true,
  imports: [HlmPopover, HlmPopoverTrigger, HlmPopoverContent, HlmButton, HlmCheckbox],
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
        <button hlmPopoverTrigger hlmButton variant="secondary" appearance="outline" type="button">
          {{ selectedItems().length }} selected
        </button>

        <hlm-popover-content class="tw:w-64 tw:p-2">
          <div class="tw:max-h-60 tw:overflow-auto tw:flex tw:flex-col tw:gap-1">
            @for (option of options(); track option.value) {
              <label
                class="tw:flex tw:items-center tw:gap-2 tw:cursor-pointer tw:px-2 tw:py-1 tw:rounded-sm tw:hover:bg-secondary"
              >
                <hlm-checkbox [checked]="isSelected(option.value)" (changed)="toggle(option.value, $event)" />
                <span class="tw:text-sm">{{ option.label }}</span>
              </label>
            } @empty {
              <span class="tw:text-xs tw:text-muted-foreground tw:px-2 tw:py-1">No options</span>
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

  userClass = input<ClassValue>('', { alias: 'class' });

  /** Value: array of selected values (string[]) */
  value = input<string[]>([]);
  valueChange = output<string[]>();

  protected readonly selectedItems = signal<SelectOption[]>([]);
  protected isDisabled = false;
  private isFormBound = false;

  protected readonly _hostClass = computed(() => hlm(this.userClass()));

  protected isSelected(value: string): boolean {
    return this.selectedItems().some((s) => s.value === value);
  }

  protected toggle(value: string, checked: boolean): void {
    if (checked) {
      this.addItem(value);
    } else {
      this.removeItem(value);
    }
  }

  protected addItem(value: string): void {
    if (!this.selectedItems().some((s) => s.value === value)) {
      const opt = this.options()?.find((o) => o.value === value);
      if (!opt) return;
      const updated = [...this.selectedItems(), opt];
      this.updateValueFromSelected(updated);
    }
  }

  protected removeItem(value: string): void {
    const updated = this.selectedItems().filter((i) => i.value !== value);
    this.updateValueFromSelected(updated);
  }

  private updateSelectedFromValues(values: string[]): void {
    const opts = this.options() || [];
    this.selectedItems.set(opts.filter((o) => values.includes(o.value)));
  }

  private updateValueFromSelected(items: SelectOption[]): void {
    this.selectedItems.set(items);
    const values = items.map((i) => i.value);
    this.valueChange.emit(values);
    this.onChange(values);
    this.onTouched();
  }

  constructor() {
    // No effect needed; we read `value` input directly via writeValue for form-bound usage.
  }

  // --- ControlValueAccessor ---
  private onChange: (value: string[]) => void = () => {};
  private onTouched: () => void = () => {};

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
