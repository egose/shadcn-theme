import {
  ChangeDetectorRef,
  Component,
  computed,
  DestroyRef,
  inject,
  input,
  numberAttribute,
  OnInit,
} from '@angular/core';
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
import { HlmSlider } from '@egose/shadcn-theme-ng/slider';
import { hlm } from '@egose/shadcn-theme-ng/utils';
import { ClassValue } from 'clsx';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import type { NumberInput } from '@angular/cdk/coercion';
import { injectEgFormSliderConfig } from './form-slider.token';

@Component({
  selector: 'eg-form-slider',
  standalone: true,
  host: {
    '[class]': '$userClass()',
  },
  imports: [ReactiveFormsModule, HlmFormField, HlmError, HlmHint, HlmLabel, HlmSlider],
  providers: [{ provide: ControlContainer, useExisting: FormGroupDirective }],
  template: `
    @let lbl = label();
    @let cnm = controlName();
    @let hnt = hint();
    @let rqrd = required();

    <hlm-form-field>
      @if (lbl) {
        <label hlmLabel [id]="labelId()" [class]="$labelClass()"
          >{{ lbl }}
          @if (rqrd) {
            <span class="tw:text-red-500">*</span>
          }
        </label>
      }

      <hlm-slider
        [id]="effectiveId()"
        [formControlName]="cnm"
        [min]="min()"
        [max]="max()"
        [step]="step()"
        [disabled]="effectiveDisabled()"
        [aria-labelledby]="lbl ? labelId() : null"
        [aria-describedby]="describedBy()"
        [class]="$sliderClass()"
      />

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
export class EgFormSlider implements OnInit {
  private readonly formGroupDirective = inject(FormGroupDirective);
  private readonly _errorMessages = injectEgFormErrorMessages();
  private readonly generatedId = inject(HlmFormIdGenerator).generate('eg-form-slider');
  private readonly _config = injectEgFormSliderConfig();
  private readonly _shared = injectEgFormSharedConfig();

  private readonly _cdr = inject(ChangeDetectorRef);
  private readonly _destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    // Submit/reset may change message visibility without changing the field's value or validity.
    this.formGroupDirective.form.events
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe(() => this._cdr.markForCheck());
  }

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
  /** Consumer-owned description IDs, merged with the current error and hint IDs on every thumb. */
  ariaDescribedBy = input<string | null>(null, { alias: 'aria-describedby' });

  id = input<string | undefined>(undefined);
  disabled = input<boolean>(false);
  required = input<boolean>(false);
  min = input<number, NumberInput>(0, { transform: numberAttribute });
  max = input<number, NumberInput>(100, { transform: numberAttribute });
  step = input<number, NumberInput>(1, { transform: numberAttribute });

  readonly effectiveId = computed(() => this.controlId() || this.id() || this.generatedId);
  readonly labelId = computed(() => `${this.effectiveId()}-label`);
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
   * Combined lock for the brain `linkedSignal`-based disabled state: the raw
   * input write always carries the resolved value, so a same-pass
   * wrapper-toggle + `control.disable()` cannot clobber CVA state.
   */
  effectiveDisabled(): boolean {
    return this.disabled() || !!this.formGroupDirective.form.get(this.controlName())?.disabled;
  }

  protected describedBy(): string | null {
    const ids = [this.ariaDescribedBy(), this.showError() ? this.errorId() : this.hint() ? this.hintId() : null];
    return [...new Set(ids.filter(Boolean).join(' ').split(/\s+/).filter(Boolean))].join(' ') || null;
  }

  // Styling
  userClass = input<ClassValue>('', { alias: 'class' });
  labelClass = input<string>('');
  sliderClass = input<string>('');
  errorClass = input<string>('');
  hintClass = input<string>('');

  // Computed classes (library base < global config < per-instance)
  $userClass = computed(() => hlm('tw:w-full', this.userClass()));
  $labelClass = computed(() => hlm('tw:mb-1', this._shared.labelClass, this._config.labelClass, this.labelClass()));
  $sliderClass = computed(() =>
    hlm('tw:w-full', this._shared.sliderClass, this._config.sliderClass, this.sliderClass()),
  );
  $errorClass = computed(() => hlm('tw:mt-0', this._shared.errorClass, this._config.errorClass, this.errorClass()));
  $hintClass = computed(() => hlm('tw:mt-0', this._shared.hintClass, this._config.hintClass, this.hintClass()));
}
