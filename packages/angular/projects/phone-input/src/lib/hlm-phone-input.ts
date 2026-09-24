import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  forwardRef,
  input,
  signal,
} from '@angular/core';
import { type ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { BrnFieldControl } from '@spartan-ng/brain/field';
import { HlmInput } from '@egose/shadcn-theme-ng/input';
import { hlm } from '@egose/shadcn-theme-ng/utils';
import type { BooleanInput } from '@angular/cdk/coercion';
import type { ClassValue } from 'clsx';
import type { ChangeFn, TouchFn } from '@spartan-ng/brain/forms';

export const HLM_PHONE_INPUT_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => HlmPhoneInput),
  multi: true,
};

/** Formats digit strings for display. Defaults to NANP `(XXX) XXX-XXXX` with an open paren while typing. */
export type PhoneNumberFormatter = (digits: string) => string;

export function formatNanpPhoneNumber(digits: string): string {
  const d = digits.replace(/\D/g, '').slice(0, 10);
  if (d.length === 0) return '';
  if (d.length <= 3) return `(${d}`;
  if (d.length <= 6) return `(${d.slice(0, 3)}) ${d.slice(3)}`;
  return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
}

/**
 * A masked phone input. The form model holds raw digits (`"4155552671"`);
 * the visible text is formatted (`"(415) 555-2671"`). Caret position is
 * preserved across mask characters while typing or deleting.
 */
@Component({
  selector: 'hlm-phone-input',
  imports: [HlmInput],
  providers: [HLM_PHONE_INPUT_VALUE_ACCESSOR],
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [BrnFieldControl],
  host: {
    class: 'tw:block tw:w-full tw:min-w-0',
    '[attr.data-disabled]': 'disabledState() ? "" : null',
  },
  template: `
    <input
      #input
      hlmInput
      [id]="inputId()"
      [attr.name]="name()"
      [attr.aria-label]="ariaLabel()"
      [attr.aria-describedby]="ariaDescribedby()"
      [placeholder]="placeholder()"
      [autocomplete]="autocomplete()"
      [readonly]="readonly()"
      [disabled]="disabledState()"
      [forceInvalid]="forceInvalid()"
      [class]="$inputClass()"
      [value]="_display()"
      (input)="_handleInput($event)"
      (blur)="_handleBlur()"
    />
  `,
})
export class HlmPhoneInput implements ControlValueAccessor {
  private static _id = 0;

  public readonly inputId = input<string>(`hlm-phone-input-${HlmPhoneInput._id++}`);
  public readonly name = input<string | undefined>(undefined);
  public readonly ariaLabel = input<string | undefined>(undefined);
  public readonly ariaDescribedby = input<string | null>(null);
  public readonly placeholder = input<string>('');
  public readonly autocomplete = input<string>('tel');
  public readonly readonly = input<boolean, BooleanInput>(false, { transform: booleanAttribute });
  public readonly disabled = input<boolean, BooleanInput>(false, { transform: booleanAttribute });
  public readonly forceInvalid = input<boolean, BooleanInput>(false, { transform: booleanAttribute });

  /** Maximum digit count kept in the model. Defaults to 10 (NANP). */
  public readonly maxDigits = input<number>(10);

  /**
   * Shape of the form model: raw digits (`"4155552671"`, the default —
   * validator- and storage-friendly) or formatted display text
   * (`"(415) 555-2671"`).
   */
  public readonly modelFormat = input<'digits' | 'formatted'>('digits');

  /** Display formatter. Receives raw digits, returns display text. */
  public readonly formatPhoneNumber = input<PhoneNumberFormatter>(formatNanpPhoneNumber);

  /** Extra classes merged onto the inner `<input>` (over the `HlmInput` base). */
  public readonly userClass = input<ClassValue>('', { alias: 'class' });
  public readonly inputClass = input<ClassValue>('');
  protected readonly $inputClass = computed(() => hlm(this.userClass(), this.inputClass()));

  private readonly _formDisabled = signal(false);
  protected readonly disabledState = computed(() => this.disabled() || this._formDisabled());

  /** Raw digits held in the form model. */
  protected readonly _digits = signal('');

  /** Formatted text shown in the input. */
  protected readonly _display = computed(() => this.formatPhoneNumber()(this._digits()));

  protected _onChange?: ChangeFn<string | null>;
  protected _onTouched?: TouchFn;

  private _emitModel(digits: string): void {
    if (digits === this._digits()) return;
    this._digits.set(digits);
    if (digits === '') {
      this._onChange?.(null);
    } else if (this.modelFormat() === 'formatted') {
      this._onChange?.(this.formatPhoneNumber()(digits));
    } else {
      this._onChange?.(digits);
    }
  }

  protected _handleInput(event: Event): void {
    const element = event.target as HTMLInputElement;
    const caret = element.selectionStart ?? element.value.length;
    const digitsBeforeCaret = element.value.slice(0, caret).replace(/\D/g, '').length;

    const digits = element.value.replace(/\D/g, '').slice(0, Math.max(0, this.maxDigits()));
    const formatted = this.formatPhoneNumber()(digits);

    const target = Math.min(digitsBeforeCaret, digits.length);
    let position = 0;
    let seen = 0;
    while (position < formatted.length && seen < target) {
      if (/\d/.test(formatted[position])) seen++;
      position++;
    }

    element.value = formatted;
    element.setSelectionRange(position, position);

    this._emitModel(digits);
  }

  protected _handleBlur(): void {
    this._onTouched?.();
  }

  /** CONTROL VALUE ACCESSOR */
  public writeValue(value: string | null | undefined): void {
    this._digits.set(
      String(value ?? '')
        .replace(/\D/g, '')
        .slice(0, Math.max(0, this.maxDigits())),
    );
  }

  public registerOnChange(fn: ChangeFn<string | null>): void {
    this._onChange = fn;
  }

  public registerOnTouched(fn: TouchFn): void {
    this._onTouched = fn;
  }

  public setDisabledState(isDisabled: boolean): void {
    this._formDisabled.set(isDisabled);
  }
}
