import { Component, computed, inject, input } from '@angular/core';
import { ControlContainer, FormGroupDirective, ReactiveFormsModule } from '@angular/forms';
import { HlmFormField, HlmError, HlmHint, HlmFormIdGenerator } from '@egose/shadcn-theme-ng/form-field';
import { HlmLabel } from '@egose/shadcn-theme-ng/label';
import { HlmRadio, HlmRadioGroup, HlmRadioIndicator } from '@egose/shadcn-theme-ng/radio-group';
import { hlm } from '@egose/shadcn-theme-ng/utils';
import { ClassValue } from 'clsx';
import { injectEgFormRadioGroupConfig } from './form-radio-group.token';

interface RadioOption {
  value: string;
  label: string;
  disabled?: boolean;
}

@Component({
  selector: 'eg-form-radio-group',
  standalone: true,
  host: {
    '[class]': '$userClass()',
  },
  imports: [ReactiveFormsModule, HlmFormField, HlmError, HlmHint, HlmLabel, HlmRadioGroup, HlmRadio, HlmRadioIndicator],
  providers: [{ provide: ControlContainer, useExisting: FormGroupDirective }],
  template: `
    @let lbl = label();
    @let cnm = controlName();
    @let err = error();
    @let hnt = hint();
    @let rqrd = required();

    <hlm-form-field>
      @if (lbl) {
        <span hlmLabel [class]="$labelClass()"
          >{{ lbl }}
          @if (rqrd) {
            <span class="tw:text-red-500">*</span>
          }
        </span>
      }

      <hlm-radio-group
        [formControlName]="cnm"
        [name]="cnm || name() || ''"
        [disabled]="effectiveDisabled()"
        [required]="rqrd"
        [class]="$groupClass()"
      >
        @for (option of options(); track option.value) {
          <label class="tw:flex tw:items-center tw:gap-2">
            <hlm-radio
              [value]="option.value"
              [disabled]="option.disabled ?? false"
              [aria-describedby]="describedBy() ?? undefined"
            >
              <hlm-radio-indicator />
            </hlm-radio>
            <span>{{ option.label }}</span>
          </label>
        }
      </hlm-radio-group>

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
export class EgFormRadioGroup {
  private readonly formGroupDirective = inject(FormGroupDirective);
  private readonly generatedId = inject(HlmFormIdGenerator).generate('eg-form-radio-group');
  private readonly _config = injectEgFormRadioGroupConfig();

  label = input<string | undefined>(undefined);
  controlId = input<string | undefined>(undefined);
  controlName = input<string>('');
  error = input<string | undefined>(undefined);
  hint = input<string | undefined>(undefined);

  id = input<string | undefined>(undefined);
  name = input<string | undefined>(undefined);
  disabled = input<boolean>(false);
  required = input<boolean>(false);

  options = input<RadioOption[]>([]);

  readonly effectiveId = computed(() => this.controlId() || this.id() || this.generatedId);
  readonly errorId = computed(() => `${this.effectiveId()}-error`);
  readonly hintId = computed(() => `${this.effectiveId()}-hint`);

  /**
   * Combined lock for the brain `linkedSignal`-based disabled state: the raw
   * input write always carries the resolved value, so a same-pass
   * wrapper-toggle + `control.disable()` cannot clobber CVA state.
   */
  effectiveDisabled(): boolean {
    return this.disabled() || !!this.formGroupDirective.form.get(this.controlName())?.disabled;
  }

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
  groupClass = input<string>('');
  errorClass = input<string>('');
  hintClass = input<string>('');

  // Computed classes (library base < global config < per-instance)
  $userClass = computed(() => hlm('tw:w-full', this.userClass()));
  $labelClass = computed(() => hlm('tw:mb-1', this._config.labelClass, this.labelClass()));
  $groupClass = computed(() => hlm('tw:flex tw:flex-col tw:gap-2', this._config.groupClass, this.groupClass()));
  $errorClass = computed(() => hlm('tw:mt-0', this._config.errorClass, this.errorClass()));
  $hintClass = computed(() => hlm('tw:mt-0', this._config.hintClass, this.hintClass()));
}
