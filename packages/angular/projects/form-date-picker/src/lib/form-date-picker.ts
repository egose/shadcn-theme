import { Component, computed, input } from '@angular/core';
import { ControlContainer, FormGroupDirective, ReactiveFormsModule } from '@angular/forms';
import { HlmFormField, HlmError, HlmHint } from '@egose/shadcn-theme-ng/form-field';
import { HlmLabel } from '@egose/shadcn-theme-ng/label';
import { HlmDatePicker } from '@egose/shadcn-theme-ng/date-picker';
import { hlm } from '@egose/shadcn-theme-ng/utils';
import { ClassValue } from 'clsx';

let nextId = 0;

@Component({
  selector: 'eg-form-date-picker',
  standalone: true,
  host: {
    class: 'tw:w-full',
  },
  imports: [ReactiveFormsModule, HlmFormField, HlmError, HlmHint, HlmLabel, HlmDatePicker],
  providers: [{ provide: ControlContainer, useExisting: FormGroupDirective }],
  // prettier-ignore
  template: `
    @let lbl = label();
    @let nm = controlName();
    @let err = error();
    @let hnt = hint();
    @let rqrd = required();

    <hlm-form-field>
      @if (lbl) {
        <span hlmLabel [class]="$labelClass()">{{ lbl }}
        @if (rqrd) {
          <span class="tw:text-red-500">*</span>
        }
        </span>
      }

      <hlm-date-picker
        [buttonId]="id()"
        [min]="min()"
        [max]="max()"
        [formControlName]="nm"
        [autoCloseOnSelect]="autoCloseOnSelect()"
        [required]="rqrd"
        [class]="$pickerClass()"
      >
        <span>{{ placeholder() }}</span>
      </hlm-date-picker>

      @if (err) {
        <hlm-error [class]="$errorClass()">
          {{ err }}
        </hlm-error>
      }

      @if (hnt) {
        <hlm-hint [class]="$hintClass()">
          {{ hnt }}
        </hlm-hint>
      }
    </hlm-form-field>
  `,
})
export class EgFormDatePicker {
  // Inputs
  label = input<string | undefined>(undefined);
  controlName = input<string>('');
  error = input<string | undefined>(undefined);
  hint = input<string | undefined>(undefined);

  // HTML attributes
  id = input<string>(`eg-form-date-picker-${nextId++}`);
  name = input<string | undefined>(undefined);
  placeholder = input<string>('Pick a date');
  readonly = input<boolean>(false);
  disabled = input<boolean>(false);
  required = input<boolean>(false);
  min = input<Date | string | null>(null);
  max = input<Date | string | null>(null);
  autoCloseOnSelect = input<boolean>(true);

  // Styling
  userClass = input<ClassValue>('', { alias: 'class' });
  labelClass = input<string>('');
  pickerClass = input<string>('');
  errorClass = input<string>('');
  hintClass = input<string>('');

  // Computed classes
  $userClass = computed(() => hlm('tw:flex tw:flex-col', this.userClass()));
  $labelClass = computed(() => hlm('tw:mb-1', this.labelClass()));
  $pickerClass = computed(() => hlm('tw:mb-1', this.pickerClass()));
  $errorClass = computed(() => hlm('tw:mt-0', this.errorClass()));
  $hintClass = computed(() => hlm('tw:mt-0', this.hintClass()));
}
