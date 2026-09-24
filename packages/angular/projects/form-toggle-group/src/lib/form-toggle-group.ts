import { Component, computed, inject, input } from '@angular/core';
import { ControlContainer, FormGroupDirective, ReactiveFormsModule } from '@angular/forms';
import { HlmError, HlmHint, HlmFormIdGenerator } from '@egose/shadcn-theme-ng/form-field';
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
    @let err = error();
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
export class EgFormToggleGroup {
  private readonly formGroupDirective = inject(FormGroupDirective);
  private readonly generatedId = inject(HlmFormIdGenerator).generate('eg-form-toggle-group');
  private readonly _config = injectEgFormToggleGroupConfig();

  label = input<string | undefined>(undefined);
  controlId = input<string | undefined>(undefined);
  controlName = input<string>('');
  error = input<string | undefined>(undefined);
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
  $groupClass = computed(() => hlm(this._config.groupClass, this.groupClass()));
  $errorClass = computed(() => hlm('tw:mt-0', this._config.errorClass, this.errorClass()));
  $hintClass = computed(() => hlm('tw:mt-0', this._config.hintClass, this.hintClass()));
}
