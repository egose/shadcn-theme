import { Component, computed, inject, input } from '@angular/core';
import { ControlContainer, FormGroupDirective, ReactiveFormsModule } from '@angular/forms';
import { HlmFormField, HlmError, HlmHint, HlmFormIdGenerator } from '@egose/shadcn-theme-ng/form-field';
import { HlmLabel } from '@egose/shadcn-theme-ng/label';
import { HlmInput } from '@egose/shadcn-theme-ng/input';
import { hlm } from '@egose/shadcn-theme-ng/utils';
import { ClassValue } from 'clsx';

@Component({
  selector: 'eg-form-text-input',
  standalone: true,
  host: {
    class: 'tw:w-full',
  },
  imports: [ReactiveFormsModule, HlmFormField, HlmError, HlmHint, HlmLabel, HlmInput],
  providers: [{ provide: ControlContainer, useExisting: FormGroupDirective }],
  template: `
    @let lbl = label();
    @let cnm = controlName();
    @let err = error();
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

      <input
        hlmInput
        [attr.aria-label]="lbl"
        [id]="effectiveId()"
        [name]="cnm || name()"
        [formControlName]="cnm"
        [class]="$inputClass()"
        [type]="type()"
        [placeholder]="placeholder()"
        [readonly]="readonly()"
        [attr.disabled]="effectiveDisabled() ? '' : null"
        [ariaDescribedby]="describedBy()"
        [max]="max()"
        [min]="min()"
        [maxlength]="maxlength()"
        [minlength]="minlength()"
        [pattern]="pattern()"
        [autocomplete]="autocomplete()"
        [autofocus]="autofocus()"
        [required]="rqrd"
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
export class EgFormTextInput {
  private readonly formGroupDirective = inject(FormGroupDirective);
  private readonly generatedId = inject(HlmFormIdGenerator).generate('eg-form-text-input');

  label = input<string | undefined>(undefined);
  controlId = input<string | undefined>(undefined);
  controlName = input<string>('');
  error = input<string | undefined>(undefined);
  hint = input<string | undefined>(undefined);

  // HTML/input attributes
  id = input<string | undefined>(undefined);

  name = input<string | undefined>(undefined);
  type = input<string>('text');
  placeholder = input<string>('');
  readonly = input<boolean>(false);
  disabled = input<boolean>(false);
  maxlength = input<string | number | null>(null);
  minlength = input<string | number | null>(null);
  max = input<string | number | null>(null);
  min = input<string | number | null>(null);
  pattern = input<string | RegExp>('');
  autocomplete = input<string | undefined>(undefined);
  autofocus = input<boolean>(false);
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

  effectiveDisabled(): boolean {
    return this.disabled() || !!this.formGroupDirective.form.get(this.controlName())?.disabled;
  }

  // Styling classes
  userClass = input<ClassValue>('', { alias: 'class' });
  labelClass = input<string>('');
  inputClass = input<string>('');
  errorClass = input<string>('');
  hintClass = input<string>('');

  // Computed class bindings
  $userClass = computed(() => hlm('tw:flex tw:flex-col', this.userClass()));
  $labelClass = computed(() => hlm('tw:mb-1 tw:gap-0', this.labelClass()));
  $inputClass = computed(() => hlm('tw:mb-1', this.inputClass()));
  $errorClass = computed(() => hlm('tw:mt-0', this.errorClass()));
  $hintClass = computed(() => hlm('tw:mt-0', this.hintClass()));
}
