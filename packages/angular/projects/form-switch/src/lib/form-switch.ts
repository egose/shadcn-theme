import { Component, computed, inject, input } from '@angular/core';
import { ControlContainer, FormGroupDirective, ReactiveFormsModule } from '@angular/forms';
import { HlmError, HlmHint, HlmFormIdGenerator } from '@egose/shadcn-theme-ng/form-field';
import { EgFormField } from '@egose/shadcn-theme-ng/form-field-simple';
import { HlmLabel } from '@egose/shadcn-theme-ng/label';
import { HlmSwitch } from '@egose/shadcn-theme-ng/switch';
import { hlm } from '@egose/shadcn-theme-ng/utils';
import { ClassValue } from 'clsx';
import { injectEgFormSwitchConfig } from './form-switch.token';

@Component({
  selector: 'eg-form-switch',
  standalone: true,
  host: {
    '[class]': '$userClass()',
  },
  imports: [ReactiveFormsModule, HlmError, HlmHint, HlmLabel, HlmSwitch, EgFormField],
  providers: [{ provide: ControlContainer, useExisting: FormGroupDirective }],
  template: `
    @let lbl = label();
    @let cnm = controlName();
    @let err = error();
    @let hnt = hint();
    @let rqrd = required();

    <eg-form-field>
      <div class="tw:flex tw:items-center tw:gap-1">
        <hlm-switch
          [id]="effectiveId()"
          [formControlName]="cnm"
          [required]="rqrd"
          [disabled]="disabled()"
          [aria-describedby]="describedBy()"
          [class]="$switchClass()"
        />
        @if (lbl) {
          <label hlmLabel [for]="effectiveId()" [class]="$labelClass()"
            >{{ lbl }}
            @if (rqrd) {
              <span class="tw:text-red-500">*</span>
            }
          </label>
        }
      </div>

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
    </eg-form-field>
  `,
})
export class EgFormSwitch {
  private readonly formGroupDirective = inject(FormGroupDirective);
  private readonly generatedId = inject(HlmFormIdGenerator).generate('eg-form-switch');
  private readonly _config = injectEgFormSwitchConfig();

  label = input<string | undefined>(undefined);
  controlId = input<string | undefined>(undefined);
  controlName = input<string>('');
  error = input<string | undefined>(undefined);
  hint = input<string | undefined>(undefined);

  id = input<string | undefined>(undefined);
  disabled = input<boolean>(false);
  required = input<boolean>(false);

  readonly effectiveId = computed(() => this.controlId() || this.id() || this.generatedId);
  readonly errorId = computed(() => `${this.effectiveId()}-error`);
  readonly hintId = computed(() => `${this.effectiveId()}-hint`);

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
  switchClass = input<string>('');
  labelClass = input<string>('');
  errorClass = input<string>('');
  hintClass = input<string>('');

  // Computed classes (library base < global config < per-instance)
  $userClass = computed(() => hlm('tw:w-full', this.userClass()));
  $switchClass = computed(() => hlm(this._config.switchClass, this.switchClass()));
  $labelClass = computed(() => hlm(this._config.labelClass, this.labelClass()));
  $errorClass = computed(() => hlm('tw:mt-0', this._config.errorClass, this.errorClass()));
  $hintClass = computed(() => hlm('tw:mt-0', this._config.hintClass, this.hintClass()));
}
