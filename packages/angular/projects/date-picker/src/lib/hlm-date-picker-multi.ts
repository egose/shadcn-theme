import type { BooleanInput, NumberInput } from '@angular/cdk/coercion';
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChild,
  forwardRef,
  inject,
  input,
  linkedSignal,
  numberAttribute,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { type ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { type BrnDatePickerBase, BrnDatePickerTriggerToken, provideBrnDatePicker } from '@spartan-ng/brain/date-picker';
import { BrnFieldControl, provideBrnLabelable } from '@spartan-ng/brain/field';
import type { ChangeFn, TouchFn } from '@spartan-ng/brain/forms';
import type { BrnOverlayState } from '@spartan-ng/brain/overlay';
import { BrnPopover } from '@spartan-ng/brain/popover';
import { injectDateAdapter } from '@spartan-ng/brain/date-time';
import { BrnCalendarMulti } from '@spartan-ng/brain/calendar';
import { HlmCalendarMulti } from '@egose/shadcn-theme-ng/calendar';
import { HlmPopoverImports } from '@egose/shadcn-theme-ng/popover';
import { injectHlmDatePickerMultiConfig } from './hlm-date-picker-multi.token';
import { HlmDatePickerCommitState, isSelectableDate } from './hlm-date-picker-commit';

export const HLM_DATE_PICKER_MUTLI_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => HlmDatePickerMulti),
  multi: true,
};

@Component({
  selector: 'hlm-date-picker-multi',
  imports: [HlmPopoverImports, HlmCalendarMulti],
  providers: [
    HlmDatePickerCommitState,
    HLM_DATE_PICKER_MUTLI_VALUE_ACCESSOR,
    provideBrnDatePicker(HlmDatePickerMulti),
    provideBrnLabelable(HlmDatePickerMulti),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [BrnFieldControl],
  host: { class: 'block' },
  template: `
    <hlm-popover sideOffset="5" [state]="_popoverState()" (stateChanged)="_onStateChange($event)">
      <ng-content />

      <hlm-popover-content class="tw:w-fit tw:p-0" *hlmPopoverPortal="let ctx">
        <ng-content select="[hlmDatePickerHeader]" />
        <hlm-calendar-multi
          class="tw:rounded-none tw:border-0"
          [date]="_mutableDate()"
          [captionLayout]="captionLayout()"
          [min]="min()"
          [max]="max()"
          [minSelection]="minSelection()"
          [maxSelection]="maxSelection()"
          [disabled]="_disabled()"
          (dateChange)="_handleChange($event)"
        />
        <ng-content select="[hlmDatePickerFooter]" />
      </hlm-popover-content>
    </hlm-popover>
  `,
})
export class HlmDatePickerMulti<T> implements BrnDatePickerBase<T[]>, ControlValueAccessor {
  private readonly _config = injectHlmDatePickerMultiConfig<T>();
  private readonly _dateAdapter = injectDateAdapter<T>();
  private readonly _commitState = inject(HlmDatePickerCommitState);
  private readonly _calendar = viewChild(BrnCalendarMulti<T>);
  private _restoringCalendar = false;

  public readonly popover = viewChild.required(BrnPopover);

  private readonly _trigger = contentChild(BrnDatePickerTriggerToken);

  /** Show dropdowns to navigate between months or years. */
  public readonly captionLayout = input<'dropdown' | 'label' | 'dropdown-months' | 'dropdown-years'>('label');

  /** The minimum date that can be selected.*/
  public readonly min = input<T>();

  /** The maximum date that can be selected. */
  public readonly max = input<T>();

  /** Deselection floor; selection can grow from empty below this count. Explicit clear is allowed. */
  public readonly minSelection = input<number, NumberInput>(undefined, {
    transform: numberAttribute,
  });

  /** The maximum selectable dates.  */
  public readonly maxSelection = input<number, NumberInput>(undefined, {
    transform: numberAttribute,
  });

  /** Determine if the date picker is disabled. */
  public readonly disabled = input<boolean, BooleanInput>(false, {
    transform: booleanAttribute,
  });

  /** The selected value. */
  public readonly date = input<T[]>();

  protected readonly _mutableDate = linkedSignal(this.date);

  /** If true, the date picker will close when the max selection of dates is reached. */
  public readonly autoCloseOnMaxSelection = input<boolean, BooleanInput>(this._config.autoCloseOnMaxSelection, {
    transform: booleanAttribute,
  });

  /** Defines how the date should be displayed in the UI.  */
  public readonly formatDates = input<(date: T[]) => string>(this._config.formatDates);

  /** Defines how the date should be transformed before saving to model/form. */
  public readonly transformDates = input<(date: T[]) => T[]>(this._config.transformDates);

  protected readonly _popoverState = signal<BrnOverlayState | null>(null);

  private readonly _formDisabled = signal(false);

  /** @internal The disabled state as a readonly signal */
  public readonly disabledState = computed(() => this.disabled() || this._formDisabled());

  protected readonly _disabled = this.disabledState;

  public readonly formattedDate = computed(() => {
    const dates = this._mutableDate();
    return dates ? this.formatDates()(dates) : undefined;
  });

  public readonly dateChange = output<T[]>();

  public readonly labelableId = computed(() => this._trigger()?.triggerId());

  public readonly hasDate = computed(() => !!this._mutableDate()?.length);

  /** @internal The current raw value, used by inputs to reformat on focus. */
  public readonly value = computed(() => this._mutableDate() ?? null);

  protected _onChange?: ChangeFn<T[]>;
  protected _onTouched?: TouchFn;

  protected _onStateChange(state: BrnOverlayState) {
    this._popoverState.set(state);
    if (state === 'closed') this._onTouched?.();
  }

  protected _handleChange(value: T[] | undefined) {
    if (this._restoringCalendar || value === undefined) return;

    if (!this.updateDate(value)) {
      // Restore the calendar's already-mutated model without a second user commit.
      this._restoringCalendar = true;
      try {
        this._calendar()?.date.set(this._mutableDate());
      } finally {
        this._restoringCalendar = false;
      }
      return;
    }

    if (this.autoCloseOnMaxSelection() && this._mutableDate()?.length === this.maxSelection()) {
      this._popoverState.set('closed');
    }
  }

  /**
   * Commit user dates, validating raw and transformed dates/counts. Returns
   * false without changing/emitting on rejection. Min selection prevents
   * reductions below the floor, but permits growth from empty. Null explicitly
   * clears (emits []), bypassing the selection floor and transform.
   */
  public updateDate(value: T[] | null): boolean {
    if (this._disabled()) return false;
    if (value && !this._isSelectionAllowed(value)) return false;
    const transformedDate = value ? this.transformDates()(value) : undefined;
    if (value && (!transformedDate || !this._isSelectionAllowed(transformedDate))) return false;

    this._mutableDate.set(transformedDate);
    this._commitState.changed();
    this._onChange?.(transformedDate ?? []);
    this.dateChange.emit(transformedDate ?? []);
    return true;
  }

  private _isSelectionAllowed(dates: T[]): boolean {
    const min = this.minSelection();
    const max = this.maxSelection();
    const currentCount = this._mutableDate()?.length ?? 0;
    return (
      !(max != null && dates.length > max) &&
      !(min != null && dates.length < min && dates.length < currentCount) &&
      dates.every((date) => isSelectableDate(this._dateAdapter, date, this.min(), this.max()))
    );
  }

  public touched(): void {
    this._onTouched?.();
  }

  /** Programmatic CVA write: transforms without enforcing user constraints or emitting. Clears rejected text. */
  public writeValue(value: T[] | null): void {
    this._mutableDate.set(value ? this.transformDates()(value) : undefined);
    this._commitState.changed();
  }

  public registerOnChange(fn: ChangeFn<T[]>): void {
    this._onChange = fn;
  }

  public registerOnTouched(fn: TouchFn): void {
    this._onTouched = fn;
  }

  public setDisabledState(isDisabled: boolean): void {
    this._formDisabled.set(isDisabled);
  }

  public open() {
    this._popoverState.set('open');
  }

  public close() {
    this._popoverState.set('closed');
  }

  public reset() {
    this._mutableDate.set(undefined);
    this._commitState.changed();
    this._onChange?.([]);
    this.dateChange.emit([]);
  }
}
