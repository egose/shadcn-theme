import { Component, computed, inject, input, numberAttribute } from '@angular/core';
import { ControlContainer, FormGroupDirective, ReactiveFormsModule } from '@angular/forms';
import { HlmFormField, HlmError, HlmHint, HlmFormIdGenerator } from '@egose/shadcn-theme-ng/form-field';
import { HlmLabel } from '@egose/shadcn-theme-ng/label';
import {
  HlmDatePickerMulti,
  HlmDateMultiInput,
  injectHlmDatePickerMultiConfig,
} from '@egose/shadcn-theme-ng/date-picker';
import { hlm } from '@egose/shadcn-theme-ng/utils';
import { ClassValue } from 'clsx';
import type { NumberInput } from '@angular/cdk/coercion';

type DatePickerCaptionLayout = 'dropdown' | 'label' | 'dropdown-months' | 'dropdown-years';

@Component({
  selector: 'eg-form-date-picker-multi',
  standalone: true,
  host: {
    '[class]': '$userClass()',
  },
  imports: [ReactiveFormsModule, HlmFormField, HlmError, HlmHint, HlmLabel, HlmDatePickerMulti, HlmDateMultiInput],
  providers: [{ provide: ControlContainer, useExisting: FormGroupDirective }],
  template: `
    @let lbl = label();
    @let cnm = controlName();
    @let err = error();
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

      <hlm-date-picker-multi
        [min]="$min()"
        [max]="$max()"
        [minSelection]="minSelection()"
        [maxSelection]="maxSelection()"
        [disabled]="disabled()"
        [autoCloseOnMaxSelection]="autoCloseOnMaxSelection()"
        [captionLayout]="captionLayout()"
        [formatDates]="formatDates()"
        [transformDates]="transformDates()"
        [formControlName]="cnm"
        [class]="$pickerClass()"
      >
        <hlm-date-multi-input
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
      </hlm-date-picker-multi>

      @if (err) {
        <hlm-error [id]="errorId()" [class]="$errorClass()">
          {{ err }}
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
export class EgFormDatePickerMulti {
  private readonly formGroupDirective = inject(FormGroupDirective);
  private readonly generatedId = inject(HlmFormIdGenerator).generate('eg-form-date-picker-multi');
  private readonly _config = injectHlmDatePickerMultiConfig<Date>();

  label = input<string | undefined>(undefined);
  controlId = input<string | undefined>(undefined);
  controlName = input<string>('');
  error = input<string | undefined>(undefined);
  hint = input<string | undefined>(undefined);

  id = input<string | undefined>(undefined);
  name = input<string | undefined>(undefined);
  placeholder = input<string>('Pick dates');
  readonly = input<boolean>(false);
  disabled = input<boolean>(false);
  required = input<boolean>(false);
  min = input<Date | string | null>(null);
  max = input<Date | string | null>(null);
  minSelection = input<number, NumberInput>(undefined, { transform: numberAttribute });
  maxSelection = input<number, NumberInput>(undefined, { transform: numberAttribute });

  // Picker behavior (defaults fall back to the injected HlmDatePickerMultiConfig)
  autoCloseOnMaxSelection = input<boolean>(this._config.autoCloseOnMaxSelection);
  captionLayout = input<DatePickerCaptionLayout>('label');
  formatDates = input<(dates: Date[]) => string>(this._config.formatDates);
  transformDates = input<(dates: Date[]) => Date[]>(this._config.transformDates);
  parseDate = input<(value: string) => Date[] | null>(this._config.parseDate);
  formatInputDates = input<(dates: Date[]) => string>(this._config.formatInputDates);

  readonly effectiveId = computed(() => this.controlId() || this.id() || this.generatedId);
  readonly errorId = computed(() => `${this.effectiveId()}-error`);
  readonly hintId = computed(() => `${this.effectiveId()}-hint`);

  /**
   * Bounds projected onto the picker's `Date` model. The cast keeps the
   * template's generic inference on `Date` while passing runtime values
   * through untouched.
   */
  protected readonly $min = computed(() => this.min() as Date | undefined);
  protected readonly $max = computed(() => this.max() as Date | undefined);

  describedBy(): string | null {
    const control = this.formGroupDirective.form.get(this.controlName());
    return this.error() && control?.invalid && (control.dirty || control.touched)
      ? this.errorId()
      : this.hint()
        ? this.hintId()
        : null;
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
  $labelClass = computed(() => hlm('tw:mb-1', this._config.labelClass, this.labelClass()));
  $pickerClass = computed(() => hlm('tw:mb-1', this._config.pickerClass, this.pickerClass()));
  $inputClass = computed(() => hlm(this._config.inputClass, this.inputClass()));
  $errorClass = computed(() => hlm('tw:mt-0', this._config.errorClass, this.errorClass()));
  $hintClass = computed(() => hlm('tw:mt-0', this._config.hintClass, this.hintClass()));
}
