import { BooleanInput } from '@angular/cdk/coercion';
import {
  Component,
  booleanAttribute,
  ChangeDetectionStrategy,
  computed,
  DestroyRef,
  inject,
  input,
  DoCheck,
  AfterContentInit,
  OnDestroy,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AbstractControl, ControlContainer, FormGroupDirective, ReactiveFormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { HlmLabel } from '@egose/shadcn-theme-ng/label';
import { HlmCheckbox } from '@egose/shadcn-theme-ng/checkbox';
import {
  HlmError,
  HlmHint,
  HlmFormIdGenerator,
  injectEgFormErrorMessages,
  resolveEgFormError,
  injectEgFormSharedConfig,
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
export class EgFormCheckbox implements DoCheck, AfterContentInit, OnDestroy {
  private readonly formGroupDirective = inject(FormGroupDirective);
  private readonly _destroyRef = inject(DestroyRef);
  private readonly _errorMessages = injectEgFormErrorMessages();
  private readonly generatedId = inject(HlmFormIdGenerator).generate('eg-form-checkbox');
  private readonly _config = injectEgFormCheckboxConfig();
  private readonly _shared = injectEgFormSharedConfig();

  /**
   * Mirrors control status + parent submit state into signals so `showError`
   * stays reactive under OnPush. `FormGroupDirective.submitted` and
   * `ValidationErrors` are plain (non-signal) values, so without this the
   * error would not appear on submit when the control was never
   * touched/dirty (OnPush child is otherwise skipped). Same pattern as
   * `EgFormToggle`.
   */
  private readonly _status = signal<string | null>(null);
  private readonly _submitted = signal(false);
  /**
   * `touched`/`dirty` are plain flags with no observable: a stepper surfacing
   * errors via `markAllAsTouched()` (no status change, no submit) would
   * otherwise stay invisible under OnPush. Polled in `ngDoCheck` so the
   * computed below recomputes on interaction changes too.
   */
  private readonly _interacted = signal(false);
  private _trackedControl: AbstractControl | null = null;
  private _controlSub: Subscription | null = null;

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
  /**
   * Shows the red `*` marker and sets the native `required` on the checkbox.
   * Note: this does not add validation by itself — pair it with
   * `Validators.requiredTrue` on the `FormControl`, otherwise the control is
   * never invalid and no error is displayed.
   */
  required = input<boolean, BooleanInput>(false, { transform: booleanAttribute });
  disabled = input<boolean>(false);

  readonly effectiveId = computed(() => this.controlId() || this.id() || this.generatedId);
  readonly errorId = computed(() => `${this.effectiveId()}-error`);
  readonly hintId = computed(() => `${this.effectiveId()}-hint`);

  /**
   * Displayed message: explicit `error()` wins; otherwise (when `autoError()`)
   * auto-resolved from the control's `ValidationErrors`. Plain method (not a
   * computed): `ValidationErrors` is not a signal, so the control must be read
   * fresh on every evaluation (`showError()` re-evaluates with it via the
   * `_status`/`_submitted` signals).
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
   * Computed over `_status`/`_submitted` signals so it re-evaluates under
   * OnPush when the parent form is submitted or the control status changes.
   */
  protected readonly showError = computed(() => {
    this._status();
    this._submitted();
    this._interacted();
    const control = this.formGroupDirective.form.get(this.controlName());
    return !!this.resolvedError() && !!control?.invalid && (this._interacted() || this._submitted());
  });

  describedBy(): string | null {
    return this.showError() ? this.errorId() : this.hint() ? this.hintId() : null;
  }

  ngAfterContentInit(): void {
    this._trackControl();
    // `ngSubmit` emits synchronously during event dispatch, before change
    // detection traverses. Flipping the signal here (instead of only polling
    // `submitted` in `ngDoCheck`) marks this OnPush view dirty up-front, so
    // the error renders in the same pass even when no `@Input()` changed and
    // the control itself never became touched/dirty. `ngDoCheck` below stays
    // as the fallback (e.g. `resetForm()` clears `submitted` silently).
    this.formGroupDirective.ngSubmit.pipe(takeUntilDestroyed(this._destroyRef)).subscribe(() => {
      if (!this._submitted()) this._submitted.set(true);
    });
  }

  ngDoCheck(): void {
    const submitted = !!this.formGroupDirective?.submitted;
    if (this._submitted() !== submitted) this._submitted.set(submitted);
    const control = this.formGroupDirective.form.get(this.controlName()) ?? null;
    if (control !== this._trackedControl) {
      this._trackControl();
      return;
    }
    if (control) {
      if (this._status() !== control.status) this._status.set(control.status);
      const interacted = control.touched || control.dirty;
      if (this._interacted() !== interacted) this._interacted.set(interacted);
    }
  }

  ngOnDestroy(): void {
    this._controlSub?.unsubscribe();
    this._controlSub = null;
  }

  private _trackControl(): void {
    this._controlSub?.unsubscribe();
    this._controlSub = null;
    const control = this.formGroupDirective.form.get(this.controlName()) ?? null;
    this._trackedControl = control;
    this._status.set(control?.status ?? null);
    this._interacted.set(!!control && (control.touched || control.dirty));
    if (control) {
      this._controlSub = control.statusChanges.subscribe((status) => {
        if (this._status() !== status) this._status.set(status);
      });
    }
  }

  // Styling
  checkboxClass = input<string>('');
  labelClass = input<string>('');
  errorClass = input<string>('');
  hintClass = input<string>('');

  // Computed styling (library base < global config < per-instance)
  $checkboxClass = computed(() => hlm(this._shared.checkboxClass, this._config.checkboxClass, this.checkboxClass()));
  $labelClass = computed(() => hlm(this._shared.labelClass, this._config.labelClass, this.labelClass()));
  $errorClass = computed(() => hlm(this._shared.errorClass, this._config.errorClass, this.errorClass()));
  $hintClass = computed(() => hlm(this._shared.hintClass, this._config.hintClass, this.hintClass()));
}
