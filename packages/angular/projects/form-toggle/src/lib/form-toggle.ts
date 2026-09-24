import { BooleanInput } from '@angular/cdk/coercion';
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  DoCheck,
  forwardRef,
  inject,
  Injector,
  input,
  AfterViewInit,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControlName, FormGroupDirective, type ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import {
  HlmError,
  HlmHint,
  HlmFormIdGenerator,
  injectEgFormErrorMessages,
  resolveEgFormError,
} from '@egose/shadcn-theme-ng/form-field';
import { HlmLabel } from '@egose/shadcn-theme-ng/label';
import { HlmToggle, type ToggleVariants } from '@egose/shadcn-theme-ng/toggle';
import { hlm } from '@egose/shadcn-theme-ng/utils';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCheck } from '@ng-icons/lucide';
import type { ChangeFn, TouchFn } from '@spartan-ng/brain/forms';
import { ClassValue } from 'clsx';
import { injectEgFormToggleConfig } from './form-toggle.token';

export const EG_FORM_TOGGLE_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => EgFormToggle),
  multi: true,
};

/**
 * A single boolean toggle bound to ReactiveForms.
 *
 * Unlike the other `eg-form-*` wrappers, the toggle itself is the
 * `ControlValueAccessor` (`BrnToggle` exposes no CVA): bind `formControlName`
 * directly on this element instead of using a `controlName` input.
 */
@Component({
  selector: 'eg-form-toggle',
  standalone: true,
  host: {
    '[class]': '$userClass()',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [HlmToggle, HlmError, HlmHint, HlmLabel, NgIcon],
  providers: [EG_FORM_TOGGLE_VALUE_ACCESSOR, provideIcons({ lucideCheck })],
  template: `
    @let lbl = label();
    @let rqrd = required();

    <div>
      <div class="tw:flex tw:items-center tw:gap-1">
        <button
          hlmToggle
          type="button"
          [id]="effectiveId()"
          [state]="_state() ? 'on' : 'off'"
          (stateChange)="_handleStateChange($event)"
          [disabled]="_disabled()"
          [variant]="variant()"
          [size]="size()"
          [class]="$toggleClass()"
        >
          @if (_state()) {
            <ng-icon name="lucideCheck" />
          }
        </button>
        @if (lbl) {
          <label hlmLabel [for]="effectiveId()" [class]="$labelClass()"
            >{{ lbl }}
            @if (rqrd) {
              <span class="tw:text-red-500">*</span>
            }
          </label>
        }
      </div>

      @if (showError()) {
        <hlm-error [id]="errorId()" [class]="$errorClass()">
          {{ resolvedError() }}
        </hlm-error>
      } @else if (showHint()) {
        <hlm-hint [id]="hintId()" [class]="$hintClass()">
          {{ hint() }}
        </hlm-hint>
      }
    </div>
  `,
})
export class EgFormToggle implements ControlValueAccessor, AfterViewInit, DoCheck {
  private readonly generatedId = inject(HlmFormIdGenerator).generate('eg-form-toggle');
  private readonly _config = injectEgFormToggleConfig();
  private readonly _injector = inject(Injector);
  private readonly _destroyRef = inject(DestroyRef);
  private readonly _formGroupDirective = inject(FormGroupDirective, { optional: true });
  private readonly _errorMessages = injectEgFormErrorMessages();
  private _controlDir: FormControlName | null = null;

  label = input<string | undefined>(undefined);
  controlId = input<string | undefined>(undefined);
  error = input<string | undefined>(undefined);
  /**
   * Auto-resolve the displayed message from the control's `ValidationErrors`
   * when `error()` is unset. Explicit `error()` always wins. Set to `false`
   * for manual-only messages.
   */
  autoError = input<boolean>(true);
  hint = input<string | undefined>(undefined);

  id = input<string | undefined>(undefined);
  disabled = input<boolean, BooleanInput>(false, { transform: booleanAttribute });
  required = input<boolean>(false);
  variant = input<ToggleVariants['variant']>('default');
  size = input<ToggleVariants['size']>('default');

  readonly effectiveId = computed(() => this.controlId() || this.id() || this.generatedId);
  readonly errorId = computed(() => `${this.effectiveId()}-error`);
  readonly hintId = computed(() => `${this.effectiveId()}-hint`);

  protected readonly _state = signal(false);
  private readonly _formDisabled = signal(false);
  protected readonly _disabled = computed(() => this.disabled() || this._formDisabled());

  private readonly _status = signal<string | null>(null);
  private readonly _submitted = signal(false);

  /**
   * Displayed message: explicit `error()` wins; otherwise (when `autoError()`)
   * auto-resolved from the control's `ValidationErrors`. Plain method (not a
   * computed): `ValidationErrors` is not a signal, so the control must be read
   * fresh on every change-detection pass (`showError()` re-evaluates with it
   * via the `_status`/`_submitted` signals).
   */
  protected resolvedError(): string | undefined {
    const explicit = this.error();
    if (explicit) return explicit;
    if (!this.autoError()) return undefined;
    return resolveEgFormError(this._controlDir?.control?.errors ?? null, this.label(), this._errorMessages);
  }

  protected readonly showError = computed(() => {
    this._status();
    this._submitted();
    const control = this._controlDir?.control;
    return (
      !!this.resolvedError() &&
      !!control?.errors &&
      (control.touched || control.dirty || !!this._formGroupDirective?.submitted)
    );
  });
  protected readonly showHint = computed(() => !this.showError() && !!this.hint());

  protected _onChange?: ChangeFn<boolean>;
  protected _onTouched?: TouchFn;

  ngDoCheck(): void {
    const submitted = !!this._formGroupDirective?.submitted;
    if (this._submitted() !== submitted) this._submitted.set(submitted);
  }

  ngAfterViewInit(): void {
    // Resolved here (not earlier): this component IS the value accessor for
    // the host FormControlName, so eager self-injection would close a
    // circular dependency (NG0200) — and the directive's `control` is only
    // assigned once its own setup has run.
    this._controlDir = this._injector.get(FormControlName, null, { self: true, optional: true }) ?? null;
    const control = this._controlDir?.control;
    this._status.set(control?.status ?? null);
    control?.statusChanges.pipe(takeUntilDestroyed(this._destroyRef)).subscribe((status) => {
      this._status.set(status);
    });
  }

  protected _handleStateChange(state: string): void {
    // BrnToggle speaks 'on'/'off' strings; the form model stays boolean.
    const on = state === 'on';
    this._state.set(on);
    this._onChange?.(on);
    this._onTouched?.();
  }

  /** CONTROL VALUE ACCESSOR */
  public writeValue(value: boolean | null | undefined): void {
    this._state.set(!!value);
  }

  public registerOnChange(fn: ChangeFn<boolean>): void {
    this._onChange = fn;
  }

  public registerOnTouched(fn: TouchFn): void {
    this._onTouched = fn;
  }

  public setDisabledState(isDisabled: boolean): void {
    this._formDisabled.set(isDisabled);
  }

  // Styling
  userClass = input<ClassValue>('', { alias: 'class' });
  toggleClass = input<string>('');
  labelClass = input<string>('');
  errorClass = input<string>('');
  hintClass = input<string>('');

  // Computed classes (library base < global config < per-instance)
  $userClass = computed(() => hlm('tw:w-full', this.userClass()));
  $toggleClass = computed(() => hlm(this._config.toggleClass, this.toggleClass()));
  $labelClass = computed(() => hlm(this._config.labelClass, this.labelClass()));
  $errorClass = computed(() => hlm('tw:mt-0', this._config.errorClass, this.errorClass()));
  $hintClass = computed(() => hlm('tw:mt-0', this._config.hintClass, this.hintClass()));
}
