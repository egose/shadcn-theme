import { Component, ChangeDetectionStrategy, computed, inject, input } from '@angular/core';
import { ControlContainer, FormGroupDirective, ReactiveFormsModule } from '@angular/forms';
import { HlmLabel } from '@egose/shadcn-theme-ng/label';
import { HlmCheckbox } from '@egose/shadcn-theme-ng/checkbox';
import {
  HlmError,
  HlmHint,
  HlmFormIdGenerator,
  injectEgFormErrorMessages,
  resolveEgFormError,
} from '@egose/shadcn-theme-ng/form-field';
import { EgFormField } from '@egose/shadcn-theme-ng/form-field-simple';
import { hlm } from '@egose/shadcn-theme-ng/utils';
import { ClassValue } from 'clsx';
import { injectEgFormCheckboxConfig } from './form-checkbox.token';

@Component({
  selector: 'eg-form-checkbox',
  standalone: true,
  host: {
    '[class]': '_computedClass()',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, HlmCheckbox, HlmLabel, EgFormField, HlmError, HlmHint],
  providers: [{ provide: ControlContainer, useExisting: FormGroupDirective }],
  template: `
    @let lbl = label();
    @let cnm = controlName();
    @let hnt = hint();
    @let rqrd = required();

    <eg-form-field>
      <div class="tw:flex tw:items-center tw:gap-1">
        <hlm-checkbox
          [id]="effectiveId()"
          [name]="cnm || name() || null"
          [formControlName]="cnm"
          [class]="$checkboxClass()"
          [checked]="checked()"
          [required]="rqrd"
          [wrapperDisabled]="disabled()"
          [aria-describedby]="describedBy()"
        />
        <label hlmLabel [for]="effectiveId()" [class]="$labelClass()">
          {{ lbl }}
          @if (rqrd) {
            <span class="tw:text-red-500">*</span>
          }
        </label>
      </div>

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
    </eg-form-field>
  `,
})
export class EgFormCheckbox {
  private readonly formGroupDirective = inject(FormGroupDirective);
  private readonly _errorMessages = injectEgFormErrorMessages();
  private readonly generatedId = inject(HlmFormIdGenerator).generate('eg-form-checkbox');
  private readonly _config = injectEgFormCheckboxConfig();

  // Classes
  public readonly userClass = input<ClassValue>('', { alias: 'class' });
  protected readonly _computedClass = computed(() => hlm('', this.userClass()));

  // Inputs
  label = input<string>('');
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

  id = input<string | undefined>(undefined);
  name = input<string | undefined>(undefined);
  checked = input<boolean>(false);
  required = input<boolean>(false);
  disabled = input<boolean>(false);

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

  describedBy(): string | null {
    return this.showError() ? this.errorId() : this.hint() ? this.hintId() : null;
  }

  // Styling
  checkboxClass = input<string>('');
  labelClass = input<string>('');
  errorClass = input<string>('');
  hintClass = input<string>('');

  // Computed styling (library base < global config < per-instance)
  $checkboxClass = computed(() => hlm(this._config.checkboxClass, this.checkboxClass()));
  $labelClass = computed(() => hlm(this._config.labelClass, this.labelClass()));
  $errorClass = computed(() => hlm(this._config.errorClass, this.errorClass()));
  $hintClass = computed(() => hlm(this._config.hintClass, this.hintClass()));
}
