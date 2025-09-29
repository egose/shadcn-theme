import { Component, computed, input } from '@angular/core';
import { ControlContainer, FormGroupDirective, ReactiveFormsModule } from '@angular/forms';
import { HlmFormField, HlmError, HlmHint } from '@egose/shadcn-theme-ng/form-field';
import { HlmLabel } from '@egose/shadcn-theme-ng/label';
import { HlmInput } from '@egose/shadcn-theme-ng/input';
import { hlm } from '@egose/shadcn-theme-ng/utils';
import { ClassValue } from 'clsx';

let nextId = 0;

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
    @let cid = controlId();
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

      <textarea
        hlmInput
        [attr.aria-label]="lbl"
        [id]="cid || id()"
        [name]="cnm || name()"
        [formControlName]="cnm"
        [class]="$textareaClass()"
        [placeholder]="placeholder()"
        [readonly]="readonly()"
        [maxlength]="maxlength()"
        [minlength]="minlength()"
        [required]="rqrd"
        [rows]="rows()"
        [cols]="cols()"
      ></textarea>

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
export class EgFormTextarea {
  // General props
  label = input<string | undefined>(undefined);
  controlId = input<string | undefined>(undefined);
  controlName = input<string>('');
  error = input<string | undefined>(undefined);
  hint = input<string | undefined>(undefined);

  // HTML/textarea attributes
  id = input<string>(crypto.randomUUID());
  // id = input<string>(`eg-form-text-input-${nextId++}`);

  name = input<string | undefined>(undefined);
  placeholder = input<string>('');
  readonly = input<boolean>(false);
  disabled = input<boolean>(false);
  maxlength = input<string | number | null>(null);
  minlength = input<string | number | null>(null);
  required = input<boolean>(false);
  rows = input<string | number | undefined>(3);
  cols = input<string | number | undefined>(undefined);

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
