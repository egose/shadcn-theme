import { Component, computed, input } from '@angular/core';
import { ControlContainer, FormGroupDirective, ReactiveFormsModule } from '@angular/forms';
import { HlmFormField, HlmError, HlmHint } from '@egose/shadcn-theme-ng/form-field';
import { HlmLabel } from '@egose/shadcn-theme-ng/label';
import { hlm } from '@egose/shadcn-theme-ng/utils';
import { ClassValue } from 'clsx';
import { EgSearchableMultiselect, SelectOption } from '@egose/shadcn-theme-ng/searchable-multiselect';

@Component({
  selector: 'eg-form-searchable-multiselect',
  standalone: true,
  host: {
    class: 'tw:w-full',
  },
  imports: [ReactiveFormsModule, HlmFormField, HlmError, HlmHint, HlmLabel, EgSearchableMultiselect],
  providers: [{ provide: ControlContainer, useExisting: FormGroupDirective }],
  template: `
    @let lbl = label(); @let nm = controlName(); @let err = error(); @let hnt = hint(); @let rqrd = required();

    <hlm-form-field>
      @if (lbl) {
      <span hlmLabel [class]="$labelClass()">
        {{ lbl }}
        @if (rqrd) {
        <span class="tw:text-red-500">*</span>
        }
      </span>
      }

      <eg-searchable-multiselect
        [options]="options()"
        [placeholder]="placeholder()"
        [formControlName]="nm"
        [disabled]="disabled()"
        [required]="rqrd"
        [class]="$controlClass()"
      ></eg-searchable-multiselect>

      @if (err) {
      <hlm-error [class]="$errorClass()">
        {{ err }}
      </hlm-error>
      } @if (hnt) {
      <hlm-hint [class]="$hintClass()">
        {{ hnt }}
      </hlm-hint>
      }
    </hlm-form-field>
  `,
})
export class EgFormSearchableMultiselect {
  // Form field inputs
  label = input<string | undefined>(undefined);
  controlName = input<string>(''); // required for form binding
  error = input<string | undefined>(undefined);
  hint = input<string | undefined>(undefined);

  // HTML/control attributes
  placeholder = input<string>('Start typing to add…');
  disabled = input<boolean>(false);
  required = input<boolean>(false);

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
