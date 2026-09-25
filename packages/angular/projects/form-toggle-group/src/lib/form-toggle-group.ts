import { Component, computed, inject, input } from '@angular/core';
import { ControlContainer, FormGroupDirective, ReactiveFormsModule } from '@angular/forms';
import {
  HlmError,
  HlmHint,
  HlmFormIdGenerator,
  injectEgFormErrorMessages,
  resolveEgFormError,
  injectEgFormSharedConfig,
} from '@egose/shadcn-theme-ng/form-field';
import { EgFormField } from '@egose/shadcn-theme-ng/form-field-simple';
import { HlmLabel } from '@egose/shadcn-theme-ng/label';
import { HlmToggleGroup, HlmToggleGroupItem } from '@egose/shadcn-theme-ng/toggle-group';
import type { ToggleVariants } from '@egose/shadcn-theme-ng/toggle';
import { hlm } from '@egose/shadcn-theme-ng/utils';
import { ClassValue } from 'clsx';
import { injectEgFormToggleGroupConfig } from './form-toggle-group.token';

interface ToggleGroupOption {
  value: string;
  label: string;
  disabled?: boolean;
}

@Component({
  selector: 'eg-form-toggle-group',
  standalone: true,
  host: {
    '[class]': '$userClass()',
  },
  imports: [ReactiveFormsModule, HlmError, HlmHint, HlmLabel, HlmToggleGroup, HlmToggleGroupItem, EgFormField],
  providers: [{ provide: ControlContainer, useExisting: FormGroupDirective }],
  template: `
    @let lbl = label();
    @let cnm = controlName();
    @let hnt = hint();
    @let rqrd = required();

    <eg-form-field>
      @if (lbl) {
        <span hlmLabel [class]="$labelClass()"
          >{{ lbl }}
          @if (rqrd) {
            <span class="tw:text-red-500">*</span>
          }
        </span>
      }

      <hlm-toggle-group
        [formControlName]="cnm"
        [type]="type()"
        [disabled]="effectiveDisabled()"
        [variant]="variant()"
        [size]="size()"
        [class]="$groupClass()"
      >
        @for (option of options(); track option.value) {
          <button
            hlmToggleGroupItem
            type="button"
            [value]="option.value"
            [disabled]="option.disabled ?? false"
            [attr.aria-describedby]="describedBy()"
          >
            {{ option.label }}
          </button>
        }
      </hlm-toggle-group>

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
export class EgFormToggleGroup {
  private readonly formGroupDirective = inject(FormGroupDirective);
  private readonly _errorMessages = injectEgFormErrorMessages();
  private readonly generatedId = inject(HlmFormIdGenerator).generate('eg-form-toggle-group');
  private readonly _config = injectEgFormToggleGroupConfig();
  private readonly _shared = injectEgFormSharedConfig();

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

  id = input<string | undefined>(undefined);
  type = input<'single' | 'multiple'>('single');
  disabled = input<boolean>(false);
  required = input<boolean>(false);
  variant = input<ToggleVariants['variant']>('default');
  size = input<ToggleVariants['size']>('default');

  options = input<ToggleGroupOption[]>([]);

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
   * Combined lock for the brain `linkedSignal`-based disabled state: the raw
   * input write always carries the resolved value, so a same-pass
   * wrapper-toggle + `control.disable()` cannot clobber CVA state.
   */
  effectiveDisabled(): boolean {
    return this.disabled() || !!this.formGroupDirective.form.get(this.controlName())?.disabled;
  }

  describedBy(): string | null {
    return this.showError() ? this.errorId() : this.hint() ? this.hintId() : null;
  }

  // Styling
  userClass = input<ClassValue>('', { alias: 'class' });
  labelClass = input<string>('');
  groupClass = input<string>('');
  errorClass = input<string>('');
  hintClass = input<string>('');

  // Computed classes (library base < global config < per-instance)
  $userClass = computed(() => hlm('tw:w-full', this.userClass()));
  $labelClass = computed(() => hlm('tw:mb-1', this._shared.labelClass, this._config.labelClass, this.labelClass()));
  $groupClass = computed(() => hlm(this._shared.groupClass, this._config.groupClass, this.groupClass()));
  $errorClass = computed(() => hlm('tw:mt-0', this._shared.errorClass, this._config.errorClass, this.errorClass()));
  $hintClass = computed(() => hlm('tw:mt-0', this._shared.hintClass, this._config.hintClass, this.hintClass()));
}
