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
  untracked,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronDown } from '@ng-icons/lucide';
import { BrnDialogState } from '@spartan-ng/brain/dialog';
import { type ChangeFn, type TouchFn } from '@spartan-ng/brain/forms';
import { BrnPopover, BrnPopoverContent, BrnPopoverTrigger } from '@spartan-ng/brain/popover';
import { HlmCalendarRange } from '@egose/shadcn-theme-ng/calendar';
import { HlmIcon } from '@egose/shadcn-theme-ng/icon';
import { HlmPopoverContent } from '@egose/shadcn-theme-ng/popover';
import { hlm } from '@egose/shadcn-theme-ng/utils';
import type { ClassValue } from 'clsx';
import { injectHlmDateRangePickerConfig } from './date-range-picker.token';

export const HLM_DATE_RANGE_PICKER_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => HlmDateRangePicker),
  multi: true,
};

let nextId = 0;

@Component({
  selector: 'hlm-date-range-picker',
  imports: [NgIcon, HlmIcon, BrnPopover, BrnPopoverTrigger, BrnPopoverContent, HlmPopoverContent, HlmCalendarRange],
  providers: [HLM_DATE_RANGE_PICKER_VALUE_ACCESSOR, provideIcons({ lucideChevronDown })],
  template: `
    <brn-popover
      sideOffset="5"
      [state]="_popoverState()"
      (stateChanged)="_popoverState.set($event)"
      (closed)="_onClose()"
    >
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
        <hlm-calendar-range
          calendarClass="tw:border-0 tw:rounded-none"
          [startDate]="_start()"
          [endDate]="_end()"
          [min]="min()"
          [max]="max()"
          [disabled]="_mutableDisabled()"
          (startDateChange)="_handleStartDayChange($event)"
          (endDateChange)="_handleEndDateChange($event)"
        />
      </div>
    </brn-popover>
  `,
  host: {
    class: 'block',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HlmDateRangePicker<T> implements ControlValueAccessor {
  private readonly _config = injectHlmDateRangePickerConfig<T>();

  public readonly userClass = input<ClassValue>('', { alias: 'class' });
  protected readonly _computedClass = computed(() =>
    hlm(
      'tw:ring-offset-background tw:border-input tw:bg-background tw:hover:bg-accent tw:dark:bg-input/30 tw:dark:hover:bg-input/50 tw:inline-flex tw:h-9 tw:w-[280px] tw:cursor-default tw:items-center tw:justify-between tw:gap-2 tw:whitespace-nowrap tw:rounded-md tw:border tw:px-3 tw:py-2 tw:text-left tw:text-sm tw:font-normal tw:transition-all tw:disabled:pointer-events-none tw:disabled:opacity-50',
      'tw:focus-visible:ring-ring tw:focus-visible:outline-none tw:focus-visible:ring-2 tw:focus-visible:ring-offset-2',
      'tw:disabled:pointer-events-none tw:disabled:opacity-50',
      'tw:[&_ng-icon]:pointer-events-none tw:[&_ng-icon]:shrink-0',
      this.userClass(),
    ),
  );

  /** The id of the button that opens the date picker. */
  public readonly buttonId = input<string>(`hlm-date-picker-range-${nextId++}`);

  /** The minimum date that can be selected.*/
  public readonly min = input<T>();

  /** The maximum date that can be selected. */
  public readonly max = input<T>();

  /** Determine if the date picker is disabled. */
  public readonly disabled = input<boolean, BooleanInput>(false, {
    transform: booleanAttribute,
  });

  /** The selected value. */
  public readonly date = input<[T, T]>();

  protected readonly _mutableDate = linkedSignal(this.date);

  protected readonly _start = linkedSignal(() => this._mutableDate()?.[0]);
  protected readonly _end = linkedSignal(() => this._mutableDate()?.[1]);

  /** If true, the date picker will close when the end date is selected */
  public readonly autoCloseOnEndSelection = input<boolean, BooleanInput>(this._config.autoCloseOnEndSelection, {
    transform: booleanAttribute,
  });

  /** Defines how the date should be displayed in the UI.  */
  public readonly formatDates = input<(dates: [T | undefined, T | undefined]) => string>(this._config.formatDates);

  /** Defines how the date should be transformed before saving to model/form. */
  public readonly transformDates = input<(date: [T, T]) => [T, T]>(this._config.transformDates);

  protected readonly _popoverState = signal<BrnDialogState | null>(null);

  protected readonly _mutableDisabled = linkedSignal(this.disabled);

  protected readonly _formattedDate = computed(() => {
    const start = this._start();
    const end = this._end();
    return start || end ? this.formatDates()([start, end]) : undefined;
  });

  public readonly dateChange = output<[T, T] | null>();

  protected _onChange?: ChangeFn<[T, T] | null>;
  protected _onTouched?: TouchFn;

  protected _handleStartDayChange(value: T) {
    this._start.set(value);
  }

  protected _handleEndDateChange(value: T): void {
    this._end.set(value);
    if (this._mutableDisabled()) return;

    const start = this._start();
    if (start && value) {
      const transformedDates = this.transformDates()([start, value]);
      this._mutableDate.set(transformedDates);
      this.dateChange.emit(transformedDates);
      this._onChange?.(transformedDates);

      if (this.autoCloseOnEndSelection()) {
        this._popoverState.set('closed');
      }
    }
  }

  /** CONTROL VALUE ACCESSOR */
  public writeValue(value: [T, T] | null): void {
    untracked(() => {
      if (!value) {
        this._mutableDate.set(undefined);
      } else {
        this._mutableDate.set(this.transformDates()(value));
      }
    });
  }

  public registerOnChange(fn: ChangeFn<[T, T] | null>): void {
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

  protected _onClose(): void {
    const dates = this._mutableDate();
    if (this._start() && !this._end() && dates) {
      this._start.set(dates[0]);
      this._end.set(dates[1]);
    }
  }
}
