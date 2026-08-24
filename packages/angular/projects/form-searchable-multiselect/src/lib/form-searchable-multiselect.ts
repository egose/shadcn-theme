import { Component, computed, inject, input } from '@angular/core';
import { ControlContainer, FormGroupDirective, ReactiveFormsModule } from '@angular/forms';
import { HlmLabel } from '@egose/shadcn-theme-ng/label';
import { EgFormField } from '@egose/shadcn-theme-ng/form-field-simple';
import { HlmError, HlmHint, HlmFormIdGenerator } from '@egose/shadcn-theme-ng/form-field';
import { hlm } from '@egose/shadcn-theme-ng/utils';
import { ClassValue } from 'clsx';
import { EgSearchableMultiselect, SelectOption } from '@egose/shadcn-theme-ng/searchable-multiselect';

@Component({
  selector: 'eg-form-searchable-multiselect',
  standalone: true,
  host: {
    class: 'tw:w-full',
  },
  imports: [ReactiveFormsModule, EgFormField, HlmError, HlmHint, HlmLabel, EgSearchableMultiselect],
  providers: [{ provide: ControlContainer, useExisting: FormGroupDirective }],
  template: `
    @let lbl = label();
    @let cnm = controlName();
    @let err = error();
    @let hnt = hint();
    @let rqrd = required();

    <eg-form-field>
      @if (lbl) {
        <label hlmLabel [for]="effectiveId()" [class]="$labelClass()">
          {{ lbl }}
          @if (rqrd) {
            <span class="tw:text-red-500">*</span>
          }
        </label>
      }

      <eg-searchable-multiselect
        [id]="effectiveId()"
        [options]="options()"
        [placeholder]="placeholder()"
        [formControlName]="cnm"
        [required]="rqrd"
        [wrapperDisabled]="disabled()"
        [ariaLabel]="lbl"
        [ariaDescribedby]="describedBy()"
        [class]="$controlClass()"
      ></eg-searchable-multiselect>

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
export class EgFormSearchableMultiselect {
  private readonly formGroupDirective = inject(FormGroupDirective);
  private readonly generatedId = inject(HlmFormIdGenerator).generate('eg-form-searchable-multiselect');

  // Form field inputs
  label = input<string | undefined>(undefined);
  controlId = input<string | undefined>(undefined);
  controlName = input<string>(''); // required for form binding
  error = input<string | undefined>(undefined);
  hint = input<string | undefined>(undefined);

  // HTML/control attributes
  id = input<string | undefined>(undefined);
  placeholder = input<string>('Start typing to add…');
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

  // Multiselect-specific
  options = input<SelectOption[]>([]); // [{ label, value }]

  // Styling classes
  userClass = input<ClassValue>('', { alias: 'class' });
  labelClass = input<string>('');
  controlClass = input<string>(''); // for EgMultiselectAutocomplete
  errorClass = input<string>('');
  hintClass = input<string>('');

  // Computed class names
  $userClass = computed(() => hlm('tw:flex tw:flex-col', this.userClass()));
  $labelClass = computed(() => hlm('tw:mb-1 tw:gap-0', this.labelClass()));
  $controlClass = computed(() => hlm('tw:w-full', this.controlClass()));
  $errorClass = computed(() => hlm('tw:mt-0', this.errorClass()));
  $hintClass = computed(() => hlm('tw:mt-0', this.hintClass()));
}
