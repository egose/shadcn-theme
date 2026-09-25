import { Component, computed, inject, input } from '@angular/core';
import { ControlContainer, FormGroupDirective, ReactiveFormsModule } from '@angular/forms';
import {
  HlmFormField,
  HlmError,
  HlmHint,
  HlmFormIdGenerator,
  injectEgFormErrorMessages,
  resolveEgFormError,
  injectEgFormSharedConfig,
} from '@egose/shadcn-theme-ng/form-field';
import { HlmLabel } from '@egose/shadcn-theme-ng/label';
import {
  HlmDateRangePicker,
  HlmDateRangeInput,
  injectHlmDateRangePickerConfig,
} from '@egose/shadcn-theme-ng/date-picker';
import { hlm } from '@egose/shadcn-theme-ng/utils';
import { ClassValue } from 'clsx';

type DateRangeCaptionLayout = 'dropdown' | 'label' | 'dropdown-months' | 'dropdown-years';

@Component({
  selector: 'eg-form-date-range-picker',
  standalone: true,
  host: {
    '[class]': '$userClass()',
  },
  imports: [ReactiveFormsModule, HlmFormField, HlmError, HlmHint, HlmLabel, HlmDateRangePicker, HlmDateRangeInput],
  providers: [{ provide: ControlContainer, useExisting: FormGroupDirective }],
  template: `
    @let lbl = label();
    @let cnm = controlName();
    @let hnt = hint();
    @let rqrd = required();

    <hlm-form-field>
      @if (lbl) {
        <label hlmLabel [for]="effectiveId()" [class]="$labelClass()"
          >{{ lbl }}
          @if (rqrd) {
            <span class="tw:text-red-500">*</span>
          }
        </label>
      }

      <hlm-date-range-picker
        [min]="$min()"
        [max]="$max()"
        [disabled]="disabled()"
        [autoCloseOnEndSelection]="autoCloseOnEndSelection()"
        [captionLayout]="captionLayout()"
        [formatDates]="formatDates()"
        [transformDates]="transformDates()"
        [formControlName]="cnm"
        [class]="$pickerClass()"
      >
        <hlm-date-range-input
          [inputId]="effectiveId()"
          [name]="cnm || name()"
          [readonly]="readonly()"
          [ariaLabel]="lbl"
          [ariaDescribedby]="describedBy()"
          [placeholder]="placeholder()"
          [parseDate]="parseDate()"
          [formatInputDates]="formatInputDates()"
          [inputClass]="$inputClass()"
        />
      </hlm-date-range-picker>

      @if (showError()) {
        <hlm-error [id]="errorId()" [class]="$errorClass()">
          {{ resolvedError() }}
        </hlm-error>
      }

      @if (hnt) {
        <hlm-hint [id]="hintId()" [class]="$hintClass()">
          {{ hnt }}
        </hlm-hint>
      }
    </hlm-form-field>
  `,
})
export class EgFormDateRangePicker {
  private readonly formGroupDirective = inject(FormGroupDirective);
  private readonly _errorMessages = injectEgFormErrorMessages();
  private readonly generatedId = inject(HlmFormIdGenerator).generate('eg-form-date-range-picker');
  private readonly _config = injectHlmDateRangePickerConfig<Date>();
  private readonly _shared = injectEgFormSharedConfig();

  // Inputs
  label = input<string | undefined>(undefined);
  controlId = input<string | undefined>(undefined);
  controlName = input<string>('');
  error = input<string | undefined>(undefined);
  /**
   * Auto-resolve the displayed message from the control's `ValidationErrors`
   * when `error()` is unset. Explicit `error()` always wins. Set to `false`
   * for manual-only messages.
   */
  autoError = input<boolean>(true);
  hint = input<string | undefined>(undefined);

  // HTML attributes
  id = input<string | undefined>(undefined);
  name = input<string | undefined>(undefined);
  placeholder = input<string>('Pick a date range');
  readonly = input<boolean>(false);
  disabled = input<boolean>(false);
  required = input<boolean>(false);
  min = input<Date | string | null>(null);
  max = input<Date | string | null>(null);

  // Picker behavior (defaults fall back to the injected HlmDateRangePickerConfig,
  // so global `provideHlmDateRangePickerConfig` values keep working unless overridden)
  autoCloseOnEndSelection = input<boolean>(this._config.autoCloseOnEndSelection);
  captionLayout = input<DateRangeCaptionLayout>('label');
  formatDates = input<(dates: [Date | null, Date | null]) => string>(this._config.formatDates);
  transformDates = input<(dates: [Date, Date]) => [Date, Date]>(this._config.transformDates);
  parseDate = input<(value: string) => [Date, Date] | null>(this._config.parseDate);
  formatInputDates = input<(dates: [Date | null, Date | null]) => string>(this._config.formatInputDates);

  readonly effectiveId = computed(() => this.controlId() || this.id() || this.generatedId);
  readonly errorId = computed(() => `${this.effectiveId()}-error`);
  readonly hintId = computed(() => `${this.effectiveId()}-hint`);

  /**
   * Displayed message: explicit `error()` wins; otherwise (when `autoError()`)
   * auto-resolved from the control's `ValidationErrors`. Plain method (not a
   * computed): `ValidationErrors` is not a signal, so the control must be read
   * fresh on every change-detection pass.
   */
  protected resolvedError(): string | undefined {
    const explicit = this.error();
    if (explicit) return explicit;
    if (!this.autoError()) return undefined;
    const control = this.formGroupDirective.form.get(this.controlName());
    return resolveEgFormError(control?.errors ?? null, this.label(), this._errorMessages);
  }

  /**
   * Whether the error is surfaced: message present + control invalid +
   * touched/dirty/submitted. Gates the visual `<hlm-error>` (and
   * `describedBy()`, where present) so sighted and screen-reader output agree.
   */
  protected showError(): boolean {
    const control = this.formGroupDirective.form.get(this.controlName());
    return (
      !!this.resolvedError() &&
      !!control?.invalid &&
      (control.dirty || control.touched || this.formGroupDirective.submitted)
    );
  }

  /**
   * Bounds projected onto the picker's `Date` model. The cast keeps the
   * template's generic inference on `Date` while passing runtime values
   * (including `string` bounds, as in `eg-form-date-picker`) through untouched.
   */
  protected readonly $min = computed(() => this.min() as Date | undefined);
  protected readonly $max = computed(() => this.max() as Date | undefined);

  describedBy(): string | null {
    return this.showError() ? this.errorId() : this.hint() ? this.hintId() : null;
  }

  // Styling
  userClass = input<ClassValue>('', { alias: 'class' });
  labelClass = input<string>('');
  pickerClass = input<string>('');
  inputClass = input<string>('');
  errorClass = input<string>('');
  hintClass = input<string>('');

  // Computed classes (library base < global config < per-instance)
  $userClass = computed(() => hlm('tw:w-full', this.userClass()));
  $labelClass = computed(() => hlm('tw:mb-1', this._shared.labelClass, this._config.labelClass, this.labelClass()));
  $pickerClass = computed(() => hlm('tw:mb-1', this._shared.pickerClass, this._config.pickerClass, this.pickerClass()));
  $inputClass = computed(() => hlm(this._shared.inputClass, this._config.inputClass, this.inputClass()));
  $errorClass = computed(() => hlm('tw:mt-0', this._shared.errorClass, this._config.errorClass, this.errorClass()));
  $hintClass = computed(() => hlm('tw:mt-0', this._shared.hintClass, this._config.hintClass, this.hintClass()));
}
