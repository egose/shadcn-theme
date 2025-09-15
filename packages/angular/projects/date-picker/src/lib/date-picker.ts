import { BooleanInput } from '@angular/cdk/coercion';
import {
  booleanAttribute,
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
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronDown } from '@ng-icons/lucide';
import { BrnDialogState } from '@spartan-ng/brain/dialog';
import { type ChangeFn, type TouchFn } from '@spartan-ng/brain/forms';
import { BrnPopover, BrnPopoverContent, BrnPopoverTrigger } from '@spartan-ng/brain/popover';
import { BrnFormFieldControl } from '@spartan-ng/brain/form-field';
import { HlmCalendar } from '@egose/shadcn-theme-ng/calendar';
import { HlmIcon } from '@egose/shadcn-theme-ng/icon';
import { HlmPopoverContent } from '@egose/shadcn-theme-ng/popover';
import { hlm } from '@egose/shadcn-theme-ng/utils';
import type { ClassValue } from 'clsx';
import { injectHlmDatePickerConfig } from './date-picker.token';

export const HLM_DATE_PICKER_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => HlmDatePicker),
  multi: true,
};

let nextId = 0;

@Component({
  selector: 'hlm-date-picker',
  imports: [NgIcon, HlmIcon, BrnPopover, BrnPopoverTrigger, BrnPopoverContent, HlmPopoverContent, HlmCalendar],
  providers: [
    HLM_DATE_PICKER_VALUE_ACCESSOR,
    provideIcons({ lucideChevronDown }),
    {
      provide: BrnFormFieldControl,
      useExisting: forwardRef(() => HlmDatePicker),
    },
  ],
  template: `
    <brn-popover sideOffset="5" [state]="_popoverState()" (stateChanged)="_popoverState.set($event)">
      <button
        [id]="buttonId()"
        type="button"
        [class]="_computedClass()"
        [disabled]="_mutableDisabled()"
        brnPopoverTrigger
      >
        <span class="truncate">
          @if (_formattedDate(); as formattedDate) {
            {{ formattedDate }}
          } @else {
            <ng-content />
          }
        </span>

        <ng-icon hlm size="sm" name="lucideChevronDown" />
      </button>

      <div hlmPopoverContent class="tw:w-auto tw:p-0" *brnPopoverContent="let ctx">
        <hlm-calendar
          calendarClass="tw:border-0 tw:rounded-none"
          [date]="_mutableDate()"
          [min]="min()"
          [max]="max()"
          [disabled]="_mutableDisabled()"
          (dateChange)="_handleChange($event)"
        />
      </div>
    </brn-popover>
  `,
  host: {
    class: 'block',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HlmDatePicker<T> extends BrnFormFieldControl implements ControlValueAccessor {
  private readonly _config = injectHlmDatePickerConfig<T>();

  public readonly userClass = input<ClassValue>('', { alias: 'class' });
  protected readonly _computedClass = computed(() =>
    hlm(
      'tw:ring-offset-background tw:border-input tw:bg-background tw:hover:bg-input/50 tw:dark:bg-input/10 tw:dark:hover:bg-input/50 tw:inline-flex tw:h-9 tw:w-full tw:cursor-default tw:items-center tw:justify-between tw:gap-2 tw:whitespace-nowrap tw:rounded-md tw:border tw:px-3 tw:py-2 tw:text-left tw:text-sm tw:font-normal tw:transition-all tw:disabled:pointer-events-none tw:disabled:opacity-50',
      'tw:focus-visible:ring-ring tw:focus-visible:outline-none tw:focus-visible:ring-2 tw:focus-visible:ring-offset-2',
      'tw:disabled:pointer-events-none tw:disabled:opacity-50',
      'tw:[&_ng-icon]:pointer-events-none tw:[&_ng-icon]:shrink-0',
      this.userClass(),
    ),
  );

  /** The id of the button that opens the date picker. */
  public readonly buttonId = input<string>(`hlm-date-picker-${nextId++}`);

  /** The minimum date that can be selected.*/
  public readonly min = input<T>();

  /** The maximum date that can be selected. */
  public readonly max = input<T>();

  /** Determine if the date picker is disabled. */
  public readonly disabled = input<boolean, BooleanInput>(false, {
    transform: booleanAttribute,
  });

  /** The selected value. */
  public readonly date = input<T>();

  protected readonly _mutableDate = linkedSignal(this.date);

  /** If true, the date picker will close when a date is selected. */
  public readonly autoCloseOnSelect = input<boolean, BooleanInput>(this._config.autoCloseOnSelect, {
    transform: booleanAttribute,
  });

  /** Defines how the date should be displayed in the UI.  */
  public readonly formatDate = input<(date: T) => string>(this._config.formatDate);

  /** Defines how the date should be transformed before saving to model/form. */
  public readonly transformDate = input<(date: T) => T>(this._config.transformDate);

  protected readonly _popoverState = signal<BrnDialogState | null>(null);

  protected readonly _mutableDisabled = linkedSignal(this.disabled);

  protected readonly _formattedDate = computed(() => {
    const date = this._mutableDate();
    return date ? this.formatDate()(date) : undefined;
  });

  public readonly dateChange = output<T>();

  protected _onChange?: ChangeFn<T>;
  protected _onTouched?: TouchFn;

  protected _handleChange(value: T) {
    if (this._mutableDisabled()) return;
    const transformedDate = this.transformDate()(value);

    this._mutableDate.set(transformedDate);
    this._onChange?.(transformedDate);
    this.dateChange.emit(transformedDate);

    if (this.autoCloseOnSelect()) {
      this._popoverState.set('closed');
    }
  }

  /** CONTROL VALUE ACCESSOR */
  public writeValue(value: T | null): void {
    this._mutableDate.set(value ? this.transformDate()(value) : undefined);
  }

  public registerOnChange(fn: ChangeFn<T>): void {
    this._onChange = fn;
  }

  public registerOnTouched(fn: TouchFn): void {
    this._onTouched = fn;
  }

  public setDisabledState(isDisabled: boolean): void {
    this._mutableDisabled.set(isDisabled);
  }

  public open() {
    this._popoverState.set('open');
  }

  public close() {
    this._popoverState.set('closed');
  }
}
