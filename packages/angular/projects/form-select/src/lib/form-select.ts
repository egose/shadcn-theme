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
import { hlm } from '@egose/shadcn-theme-ng/utils';
import { ClassValue } from 'clsx';
import { BrnSelectImports } from '@spartan-ng/brain/select';
import {
  HlmSelectImports,
  HlmSelect,
  HlmSelectMultiple,
  HlmSelectTrigger,
  HlmSelectValue,
  HlmSelectPlaceholder,
  HlmSelectValues,
  HlmSelectValuesContent,
  HlmSelectContent,
  HlmSelectItem,
  HlmSelectLabel,
} from '@egose/shadcn-theme-ng/select';
import { injectEgFormSelectConfig } from './form-select.token';

interface SelectOption {
  value: string;
  label: string;
}

@Component({
  selector: 'eg-form-select',
  standalone: true,
  host: {
    '[class]': '$userClass()',
  },
  imports: [
    ReactiveFormsModule,
    HlmFormField,
    HlmError,
    HlmHint,
    HlmLabel,
    BrnSelectImports,
    HlmSelectImports,
    HlmSelect,
    HlmSelectMultiple,
    HlmSelectTrigger,
    HlmSelectValue,
    HlmSelectPlaceholder,
    HlmSelectValues,
    HlmSelectValuesContent,
    HlmSelectContent,
    HlmSelectItem,
    HlmSelectLabel,
  ],
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

      @if (multiple()) {
        <hlm-select-multiple [formControlName]="cnm" [itemToString]="itemToString">
          <hlm-select-trigger
            [buttonId]="effectiveId()"
            [ariaDescribedby]="describedBy()"
            [wrapperDisabled]="disabled()"
            [class]="$selectClass()"
          >
            <hlm-select-placeholder>{{ placeholder() }}</hlm-select-placeholder>
            <ng-template hlmSelectValues let-values>
              <hlm-select-values-content>
                {{ formatMultipleLabels(values) }}
              </hlm-select-values-content>
            </ng-template>
          </hlm-select-trigger>

          <hlm-select-content *hlmSelectPortal>
            @if (options().length) {
              @if (optionsLabel()) {
                <hlm-select-label>{{ optionsLabel() }}</hlm-select-label>
              }
              @for (option of options(); track option.value) {
                <hlm-select-item [value]="option.value">{{ option.label }}</hlm-select-item>
              }
            }
          </hlm-select-content>
        </hlm-select-multiple>
      } @else {
        <hlm-select [formControlName]="cnm" [itemToString]="itemToString">
          <hlm-select-trigger
            [buttonId]="effectiveId()"
            [ariaDescribedby]="describedBy()"
            [wrapperDisabled]="disabled()"
            [class]="$selectClass()"
          >
            <hlm-select-value [placeholder]="placeholder()" />
          </hlm-select-trigger>

          <hlm-select-content *hlmSelectPortal>
            @if (options().length) {
              @if (optionsLabel()) {
                <hlm-select-label>{{ optionsLabel() }}</hlm-select-label>
              }
              @for (option of options(); track option.value) {
                <hlm-select-item [value]="option.value">{{ option.label }}</hlm-select-item>
              }
            }
          </hlm-select-content>
        </hlm-select>
      }

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
export class EgFormSelect {
  private readonly formGroupDirective = inject(FormGroupDirective);
  private readonly _errorMessages = injectEgFormErrorMessages();
  private readonly generatedId = inject(HlmFormIdGenerator).generate('eg-form-select');
  private readonly _config = injectEgFormSelectConfig();
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

  // HTML/select attributes
  id = input<string | undefined>(undefined);
  placeholder = input<string>('');
  disabled = input<boolean>(false);
  required = input<boolean>(false);

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

  // Select-specific
  multiple = input<boolean>(false);
  options = input<SelectOption[]>([]);
  optionsLabel = input<string | undefined>(undefined); // optional group label

  /**
   * Maps a stored `value` to its human-readable `label` for the closed trigger
   * (and listbox type-ahead). Spartan's `BrnSelectValue` renders
   * `stringifyAsLabel(value, itemToString)` — without this it would show the raw
   * value (e.g. `jahn` instead of `J. Hahn`). Unknown IDs fall back to the raw
   * value so async/programmatic values stay visible. Plain arrow-function
   * property (stable identity); reads `options()` at call time so Spartan's
   * display computed re-evaluates when options arrive.
   */
  readonly itemToString = (value: string | null | undefined): string => {
    if (value === null || value === undefined) return '';
    return this.options().find((option) => option.value === value)?.label ?? String(value);
  };

  /**
   * Comma-joined labels for multi-select trigger content. Plain method (not a
   * computed): `values` comes from the `hlmSelectValues` template context, while
   * `options()` is read fresh so late-arriving options refresh labels without
   * touching selection — mirroring the React `FormMultiSelect` fallback.
   */
  protected formatMultipleLabels(values: string[] | null | undefined): string {
    if (!values?.length) return '';
    const labels = new Map(this.options().map((option) => [option.value, option.label]));
    return values.map((value) => labels.get(value) ?? String(value)).join(', ');
  }

  // Styling classes
  userClass = input<ClassValue>('', { alias: 'class' });
  labelClass = input<string>('');
  selectClass = input<string>('');
  errorClass = input<string>('');
  hintClass = input<string>('');

  // Computed classes (library base < global config < per-instance)
  $userClass = computed(() => hlm('tw:w-full', this.userClass()));
  $labelClass = computed(() =>
    hlm('tw:mb-1 tw:gap-0', this._shared.labelClass, this._config.labelClass, this.labelClass()),
  );
  $selectClass = computed(() =>
    hlm('tw:w-full', this._shared.selectClass, this._config.selectClass, this.selectClass()),
  );
  $errorClass = computed(() => hlm('tw:mt-0', this._shared.errorClass, this._config.errorClass, this.errorClass()));
  $hintClass = computed(() => hlm('tw:mt-0', this._shared.hintClass, this._config.hintClass, this.hintClass()));
}
