import { Component, computed, inject, input } from '@angular/core';
import { ControlContainer, FormGroupDirective, ReactiveFormsModule } from '@angular/forms';
import { HlmFormField, HlmError, HlmHint, HlmFormIdGenerator } from '@egose/shadcn-theme-ng/form-field';
import { HlmLabel } from '@egose/shadcn-theme-ng/label';
import { HlmPhoneInput, formatNanpPhoneNumber, type PhoneNumberFormatter } from '@egose/shadcn-theme-ng/phone-input';
import { hlm } from '@egose/shadcn-theme-ng/utils';
import { ClassValue } from 'clsx';
import { injectEgFormPhoneInputConfig } from './form-phone-input.token';

@Component({
  selector: 'eg-form-phone-input',
  standalone: true,
  host: {
    '[class]': '$userClass()',
  },
  imports: [ReactiveFormsModule, HlmFormField, HlmError, HlmHint, HlmLabel, HlmPhoneInput],
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

      <hlm-phone-input
        [inputId]="effectiveId()"
        [name]="cnm || name()"
        [readonly]="readonly()"
        [ariaLabel]="lbl"
        [ariaDescribedby]="describedBy()"
        [placeholder]="placeholder()"
        [autocomplete]="autocomplete()"
        [maxDigits]="maxDigits()"
        [formatPhoneNumber]="formatPhoneNumber()"
        [modelFormat]="modelFormat()"
        [disabled]="disabled()"
        [formControlName]="cnm"
        [class]="$inputClass()"
      />

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
export class EgFormPhoneInput {
  private readonly formGroupDirective = inject(FormGroupDirective);
  private readonly generatedId = inject(HlmFormIdGenerator).generate('eg-form-phone-input');
  private readonly _config = injectEgFormPhoneInputConfig();

  label = input<string | undefined>(undefined);
  controlId = input<string | undefined>(undefined);
  controlName = input<string>('');
  error = input<string | undefined>(undefined);
  hint = input<string | undefined>(undefined);

  id = input<string | undefined>(undefined);
  name = input<string | undefined>(undefined);
  placeholder = input<string>('(555) 123-4567');
  autocomplete = input<string>('tel');
  readonly = input<boolean>(false);
  disabled = input<boolean>(false);
  required = input<boolean>(false);
  maxDigits = input<number>(10);
  formatPhoneNumber = input<PhoneNumberFormatter>(formatNanpPhoneNumber);
  modelFormat = input<'digits' | 'formatted'>('digits');

  readonly effectiveId = computed(() => this.controlId() || this.id() || this.generatedId);
  readonly errorId = computed(() => `${this.effectiveId()}-error`);
  readonly hintId = computed(() => `${this.effectiveId()}-hint`);

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
  inputClass = input<string>('');
  errorClass = input<string>('');
  hintClass = input<string>('');

  // Computed classes (library base < global config < per-instance)
  $userClass = computed(() => hlm('tw:w-full', this.userClass()));
  $labelClass = computed(() => hlm('tw:mb-1 tw:gap-0', this._config.labelClass, this.labelClass()));
  $inputClass = computed(() => hlm('tw:mb-1', this._config.inputClass, this.inputClass()));
  $errorClass = computed(() => hlm('tw:mt-0', this._config.errorClass, this.errorClass()));
  $hintClass = computed(() => hlm('tw:mt-0', this._config.hintClass, this.hintClass()));
}
