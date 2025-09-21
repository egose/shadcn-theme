import { Component, ChangeDetectionStrategy, OnInit, computed, input } from '@angular/core';
import { ControlContainer, FormGroupDirective, ReactiveFormsModule } from '@angular/forms';
import { HlmLabel } from '@egose/shadcn-theme-ng/label';
import { HlmCheckbox } from '@egose/shadcn-theme-ng/checkbox';
import { HlmError, HlmHint } from '@egose/shadcn-theme-ng/form-field';
import { EgFormField } from '@egose/shadcn-theme-ng/form-field-simple';
import { hlm } from '@egose/shadcn-theme-ng/utils';
import { ClassValue } from 'clsx';

@Component({
  selector: 'eg-form-checkbox',
  standalone: true,
  host: {
    '[class]': '_computedClass()',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, HlmCheckbox, HlmLabel, EgFormField, HlmError, HlmHint],
  providers: [{ provide: ControlContainer, useExisting: FormGroupDirective }],
  template: `
    @let lbl = label();
    @let nm = controlName();
    @let err = error();
    @let hnt = hint();
    @let rqrd = required();

    <eg-form-field>
      <div class="tw:flex tw:items-center tw:gap-1">
        <hlm-checkbox
          [id]="id()"
          [name]="nm || name() || null"
          [formControlName]="nm"
          [class]="$checkboxClass()"
          [checked]="checked()"
          [required]="rqrd"
        />
        <label hlmLabel [for]="id()" [class]="$labelClass()">
          {{ lbl }}
          @if (rqrd) {
          <span class="tw:text-red-500">*</span>
          }
        </label>
      </div>

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
    </eg-form-field>
  `,
})
export class EgFormCheckbox {
  // Classes
  public readonly userClass = input<ClassValue>('', { alias: 'class' });
  protected readonly _computedClass = computed(() => hlm('', this.userClass()));

  // Inputs
  label = input<string>('');
  controlName = input<string>(''); // must be provided
  error = input<string | undefined>(undefined);
  hint = input<string | undefined>(undefined);

  id = input<string>(crypto.randomUUID());
  name = input<string | undefined>(undefined);
  checked = input<boolean>(false);
  required = input<boolean>(false);
  disabled = input<boolean>(false);

  // Styling
  checkboxClass = input<string>('');
  labelClass = input<string>('');

  // Computed styling
  $checkboxClass = computed(() => hlm(this.checkboxClass()));
  $labelClass = computed(() => hlm(this.labelClass()));
  $errorClass = input<string>('');
  $hintClass = input<string>('');
}
