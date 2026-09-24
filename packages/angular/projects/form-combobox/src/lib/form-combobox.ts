import { Component, computed, inject, input, viewChild } from '@angular/core';
import { ControlContainer, FormGroupDirective, ReactiveFormsModule } from '@angular/forms';
import {
  HlmFormField,
  HlmError,
  HlmHint,
  HlmFormIdGenerator,
  injectEgFormErrorMessages,
  resolveEgFormError,
} from '@egose/shadcn-theme-ng/form-field';
import { HlmLabel } from '@egose/shadcn-theme-ng/label';
import {
  HlmCombobox,
  HlmComboboxChip,
  HlmComboboxChipInput,
  HlmComboboxChips,
  HlmComboboxContent,
  HlmComboboxEmpty,
  HlmComboboxInput,
  HlmComboboxItem,
  HlmComboboxList,
  HlmComboboxMultiple,
  HlmComboboxPortal,
  HlmComboboxTrigger,
} from '@egose/shadcn-theme-ng/combobox';
import { BrnCombobox, BrnComboboxMultiple } from '@spartan-ng/brain/combobox';
import { hlm } from '@egose/shadcn-theme-ng/utils';
import { ClassValue } from 'clsx';
import { injectEgFormComboboxConfig } from './form-combobox.token';

@Component({
  selector: 'eg-form-combobox',
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
    HlmCombobox,
    HlmComboboxChip,
    HlmComboboxChipInput,
    HlmComboboxChips,
    HlmComboboxContent,
    HlmComboboxEmpty,
    HlmComboboxInput,
    HlmComboboxItem,
    HlmComboboxList,
    HlmComboboxMultiple,
    HlmComboboxPortal,
    HlmComboboxTrigger,
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

      @if (mode() === 'single') {
        <hlm-combobox [formControlName]="cnm" [disabled]="effectiveDisabled()">
          <hlm-combobox-trigger [buttonId]="effectiveId()" [class]="$controlClass()">
            {{ singleDisplay() ?? placeholder() }}
          </hlm-combobox-trigger>
          <hlm-combobox-content *hlmComboboxPortal>
            <hlm-combobox-input [inputId]="effectiveId()" [placeholder]="placeholder()" />
            <div hlmComboboxList>
              @for (option of options(); track option) {
                <hlm-combobox-item [value]="option">{{ option }}</hlm-combobox-item>
              }
            </div>
            <div hlmComboboxEmpty>{{ emptyText() }}</div>
          </hlm-combobox-content>
        </hlm-combobox>
      } @else {
        <hlm-combobox-multiple [formControlName]="cnm" [disabled]="effectiveDisabled()" [class]="$controlClass()">
          <hlm-combobox-chips [class]="$chipsClass()">
            @for (v of selectedValues(); track v) {
              <hlm-combobox-chip [value]="v">{{ v }}</hlm-combobox-chip>
            }
            <input hlmComboboxChipInput [id]="effectiveId()" [placeholder]="placeholder()" />
          </hlm-combobox-chips>
          <hlm-combobox-content *hlmComboboxPortal>
            <div hlmComboboxList>
              @for (option of options(); track option) {
                <hlm-combobox-item [value]="option">{{ option }}</hlm-combobox-item>
              }
            </div>
            <div hlmComboboxEmpty>{{ emptyText() }}</div>
          </hlm-combobox-content>
        </hlm-combobox-multiple>
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
export class EgFormCombobox {
  private readonly formGroupDirective = inject(FormGroupDirective);
  private readonly _errorMessages = injectEgFormErrorMessages();
  private readonly generatedId = inject(HlmFormIdGenerator).generate('eg-form-combobox');
  private readonly _config = injectEgFormComboboxConfig();
  private readonly _picker = viewChild(BrnComboboxMultiple<string>);
  private readonly _single = viewChild(BrnCombobox<string>);

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
  placeholder = input<string>('Pick…');
  emptyText = input<string>('Nothing left to add.');
  disabled = input<boolean>(false);
  required = input<boolean>(false);

  /**
   * Selection mode. `multiple` renders chips + checkbox-style multi-select
   * (`string[]` model); `single` renders a trigger button + dropdown
   * (`string | null` model). Defaults to `multiple` (original behavior).
   */
  mode = input<'single' | 'multiple'>('multiple');

  options = input<string[]>([]);

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

  /** Selected values read reactively from the brain model so chips track selection. */
  readonly selectedValues = computed<string[]>(() => this._picker()?.value() ?? []);

  /** Single-mode display value read reactively from the brain model. */
  readonly singleDisplay = computed<string | null>(() => this._single()?.value() ?? null);

  /**
   * Combined lock for the brain `linkedSignal`-based disabled state: the raw
   * input write always carries the resolved value, so a same-pass
   * wrapper-toggle + `control.disable()` cannot clobber CVA state.
   */
  effectiveDisabled(): boolean {
    return this.disabled() || !!this.formGroupDirective.form.get(this.controlName())?.disabled;
  }

  // Styling
  userClass = input<ClassValue>('', { alias: 'class' });
  labelClass = input<string>('');
  controlClass = input<string>('');
  chipsClass = input<string>('');
  errorClass = input<string>('');
  hintClass = input<string>('');

  // Computed classes (library base < global config < per-instance).
  // NOTE: the chip search input exposes no aria-describedby, so error/hint
  // ids render without an input-level describedby link.
  $userClass = computed(() => hlm('tw:w-full', this.userClass()));
  $labelClass = computed(() => hlm('tw:mb-1', this._config.labelClass, this.labelClass()));
  $controlClass = computed(() => hlm(this._config.controlClass, this.controlClass()));
  $chipsClass = computed(() => hlm(this._config.chipsClass, this.chipsClass()));
  $errorClass = computed(() => hlm('tw:mt-0', this._config.errorClass, this.errorClass()));
  $hintClass = computed(() => hlm('tw:mt-0', this._config.hintClass, this.hintClass()));
}
