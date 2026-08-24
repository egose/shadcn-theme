import { Component, computed, inject, input } from '@angular/core';
import { ControlContainer, FormGroupDirective, ReactiveFormsModule } from '@angular/forms';
import { HlmFormField, HlmError, HlmHint, HlmFormIdGenerator } from '@egose/shadcn-theme-ng/form-field';
import { HlmLabel } from '@egose/shadcn-theme-ng/label';
import { HlmInput } from '@egose/shadcn-theme-ng/input';
import { hlm } from '@egose/shadcn-theme-ng/utils';
import { ClassValue } from 'clsx';

@Component({
  selector: 'eg-form-textarea',
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

      <textarea
        hlmInput
        [attr.aria-label]="lbl"
        [id]="effectiveId()"
        [name]="cnm || name()"
        [formControlName]="cnm"
        [class]="$textareaClass()"
        [placeholder]="placeholder()"
        [readonly]="readonly()"
        [attr.disabled]="effectiveDisabled() ? '' : null"
        [ariaDescribedby]="describedBy()"
        [maxlength]="maxlength()"
        [minlength]="minlength()"
        [required]="rqrd"
        [rows]="rows()"
        [cols]="cols()"
      ></textarea>

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
export class EgFormTextarea {
  private readonly formGroupDirective = inject(FormGroupDirective);
  private readonly generatedId = inject(HlmFormIdGenerator).generate('eg-form-textarea');

  // General props
  label = input<string | undefined>(undefined);
  controlId = input<string | undefined>(undefined);
  controlName = input<string>('');
  error = input<string | undefined>(undefined);
  hint = input<string | undefined>(undefined);

  // HTML/textarea attributes
  id = input<string | undefined>(undefined);

  name = input<string | undefined>(undefined);
  placeholder = input<string>('');
  readonly = input<boolean>(false);
  disabled = input<boolean>(false);
  maxlength = input<string | number | null>(null);
  minlength = input<string | number | null>(null);
  required = input<boolean>(false);
  rows = input<string | number | undefined>(3);
  cols = input<string | number | undefined>(undefined);

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
  textareaClass = input<string>('');
  errorClass = input<string>('');
  hintClass = input<string>('');

  // Computed class bindings
  $userClass = computed(() => hlm('tw:flex tw:flex-col', this.userClass()));
  $labelClass = computed(() => hlm('tw:mb-1 tw:gap-0', this.labelClass()));
  $textareaClass = computed(() => hlm('tw:mb-1', this.textareaClass()));
  $errorClass = computed(() => hlm('tw:mt-0', this.errorClass()));
  $hintClass = computed(() => hlm('tw:mt-0', this.hintClass()));
}
