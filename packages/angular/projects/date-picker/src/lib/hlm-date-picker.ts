import type { BooleanInput } from '@angular/cdk/coercion';
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
import { BrnCalendar } from '@spartan-ng/brain/calendar';
import { HlmCalendar } from '@egose/shadcn-theme-ng/calendar';
import { HlmPopoverImports } from '@egose/shadcn-theme-ng/popover';
import { injectHlmDatePickerConfig } from './hlm-date-picker.token';
import { HlmDatePickerCommitState, isSelectableDate } from './hlm-date-picker-commit';

export const HLM_DATE_PICKER_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => HlmDatePicker),
  multi: true,
};

@Component({
  selector: 'hlm-date-picker',
  imports: [HlmPopoverImports, HlmCalendar],
  providers: [
    HlmDatePickerCommitState,
    HLM_DATE_PICKER_VALUE_ACCESSOR,
    provideBrnDatePicker(HlmDatePicker),
    provideBrnLabelable(HlmDatePicker),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [BrnFieldControl],
  host: { class: 'tw:block tw:w-full tw:min-w-0 tw:max-w-full' },
  template: `
    <hlm-popover sideOffset="5" [state]="_popoverState()" (stateChanged)="_onStateChange($event)">
      <ng-content />

      <hlm-popover-content class="tw:w-fit tw:p-0" *hlmPopoverPortal="let ctx">
        <ng-content select="[hlmDatePickerHeader]" />
        <hlm-calendar
          class="tw:rounded-none tw:border-0"
          [captionLayout]="captionLayout()"
          [date]="_mutableDate()"
          [defaultFocusedDate]="_mutableDate() ?? defaultFocusedDate()"
          [min]="min()"
          [max]="max()"
          [disabled]="disabledState()"
          (dateChange)="_handleChange($event)"
        />
        <ng-content select="[hlmDatePickerFooter]" />
      </hlm-popover-content>
    </hlm-popover>
  `,
})
export class HlmDatePicker<T> implements BrnDatePickerBase<T>, ControlValueAccessor {
  private readonly _config = injectHlmDatePickerConfig<T>();
  private readonly _dateAdapter = injectDateAdapter<T>();
  private readonly _commitState = inject(HlmDatePickerCommitState);
  private readonly _calendar = viewChild(BrnCalendar<T>);
  private _restoringCalendar = false;

  public readonly popover = viewChild.required(BrnPopover);

  private readonly _trigger = contentChild(BrnDatePickerTriggerToken);

  /** Show dropdowns to navigate between months or years. */
  public readonly captionLayout = input<'dropdown' | 'label' | 'dropdown-months' | 'dropdown-years'>('label');

  /** The minimum date that can be selected.*/
  public readonly min = input<T>();

  /** The maximum date that can be selected. */
  public readonly max = input<T>();

  /** Determine if the date picker is disabled. */
  public readonly disabled = input<boolean, BooleanInput>(false, {
    transform: booleanAttribute,
  });

  /** Additional interaction lock that does not write to a reactive form control. */
  public readonly wrapperDisabled = input<boolean, BooleanInput>(false, { transform: booleanAttribute });

  /** The selected value. */
  public readonly date = input<T>();

  /** The date the calendar focuses on first open when no date is selected. */
  public readonly defaultFocusedDate = input<T>();

  protected readonly _mutableDate = linkedSignal(this.date);

  /** If true, the date picker will close when a date is selected. */
  public readonly autoCloseOnSelect = input<boolean, BooleanInput>(this._config.autoCloseOnSelect, {
    transform: booleanAttribute,
  });

  /** Defines how the date should be displayed in the UI.  */
  public readonly formatDate = input<(date: T) => string>(this._config.formatDate);

  /** Defines how the date should be transformed before saving to model/form. */
  public readonly transformDate = input<(date: T) => T>(this._config.transformDate);

  protected readonly _popoverState = signal<BrnOverlayState | null>(null);

  private readonly _formDisabled = signal(false);

  /** @internal The disabled state as a readonly signal */
  public readonly disabledState = computed(() => this.disabled() || this.wrapperDisabled() || this._formDisabled());

  public readonly formattedDate = computed(() => {
    const date = this._mutableDate();
    return date ? this.formatDate()(date) : undefined;
  });

  public readonly dateChange = output<T | null>();

  public readonly labelableId = computed(() => this._trigger()?.triggerId());

  public readonly hasDate = computed(() => !!this._mutableDate());

  /** @internal The current raw value, used by inputs to reformat on focus. */
  public readonly value = computed(() => this._mutableDate() ?? null);

  protected _onChange?: ChangeFn<T | null>;
  protected _onTouched?: TouchFn;

  protected _onStateChange(state: BrnOverlayState) {
    this._popoverState.set(state);
    if (state === 'closed') this._onTouched?.();
  }

  protected _handleChange(value: T | undefined) {
    if (this._restoringCalendar) return;
    if (!this.updateDate(value ?? null)) {
      // Brain model signals have already changed before their output fires.
      this._restoringCalendar = true;
      try {
        this._calendar()?.date.set(this._mutableDate());
      } finally {
        this._restoringCalendar = false;
      }
      return;
    }

    if (this.autoCloseOnSelect()) {
      this._popoverState.set('closed');
    }
  }

  /**
   * Commit a user value (null clears). Returns false without changing/emitting
   * the model when disabled or when the raw/transformed date is invalid or
   * outside the adapter's inclusive whole-day min/max bounds.
   */
  public updateDate(value: T | null): boolean {
    if (this.disabledState()) return false;
    if (value != null && !isSelectableDate(this._dateAdapter, value, this.min(), this.max())) return false;
    const transformedDate = value != null ? this.transformDate()(value) : undefined;
    if (value != null && !isSelectableDate(this._dateAdapter, transformedDate!, this.min(), this.max())) return false;

    this._mutableDate.set(transformedDate);
    this._commitState.changed();
    this._onChange?.(transformedDate ?? null);
    this.dateChange.emit(transformedDate ?? null);
    return true;
  }

  /** Programmatic CVA write: transforms without enforcing user constraints or emitting. Clears rejected text. */
  public writeValue(value: T | null): void {
    this._mutableDate.set(value != null ? this.transformDate()(value) : undefined);
    this._commitState.changed();
  }

  public registerOnChange(fn: ChangeFn<T | null>): void {
    this._onChange = fn;
  }

  public registerOnTouched(fn: TouchFn): void {
    this._onTouched = fn;
  }

  public touched(): void {
    this._onTouched?.();
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
    this._onChange?.(null);
    this.dateChange.emit(null);
  }
}
