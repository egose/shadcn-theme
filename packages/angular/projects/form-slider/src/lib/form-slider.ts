import { Component, computed, inject, input, numberAttribute } from '@angular/core';
import { ControlContainer, FormGroupDirective, ReactiveFormsModule } from '@angular/forms';
import { HlmFormField, HlmError, HlmHint, HlmFormIdGenerator } from '@egose/shadcn-theme-ng/form-field';
import { HlmLabel } from '@egose/shadcn-theme-ng/label';
import { HlmSlider } from '@egose/shadcn-theme-ng/slider';
import { hlm } from '@egose/shadcn-theme-ng/utils';
import { ClassValue } from 'clsx';
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
    @let err = error();
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
        [class]="$sliderClass()"
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
export class EgFormSlider {
  private readonly formGroupDirective = inject(FormGroupDirective);
  private readonly generatedId = inject(HlmFormIdGenerator).generate('eg-form-slider');
  private readonly _config = injectEgFormSliderConfig();

  label = input<string | undefined>(undefined);
  controlId = input<string | undefined>(undefined);
  controlName = input<string>('');
  error = input<string | undefined>(undefined);
  hint = input<string | undefined>(undefined);

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
   * Combined lock for the brain `linkedSignal`-based disabled state: the raw
   * input write always carries the resolved value, so a same-pass
   * wrapper-toggle + `control.disable()` cannot clobber CVA state.
   */
  effectiveDisabled(): boolean {
    return this.disabled() || !!this.formGroupDirective.form.get(this.controlName())?.disabled;
  }

  // NOTE: BrnSlider exposes aria-labelledby but no aria-describedby, so error/hint
  // ids render for sighted users without an input-level describedby link.

  // Styling
  userClass = input<ClassValue>('', { alias: 'class' });
  labelClass = input<string>('');
  sliderClass = input<string>('');
  errorClass = input<string>('');
  hintClass = input<string>('');

  // Computed classes (library base < global config < per-instance)
  $userClass = computed(() => hlm('tw:w-full', this.userClass()));
  $labelClass = computed(() => hlm('tw:mb-1', this._config.labelClass, this.labelClass()));
  $sliderClass = computed(() => hlm('tw:w-full', this._config.sliderClass, this.sliderClass()));
  $errorClass = computed(() => hlm('tw:mt-0', this._config.errorClass, this.errorClass()));
  $hintClass = computed(() => hlm('tw:mt-0', this._config.hintClass, this.hintClass()));
}
