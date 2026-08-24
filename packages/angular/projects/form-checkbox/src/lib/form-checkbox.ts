import { Component, ChangeDetectionStrategy, computed, inject, input } from '@angular/core';
import { ControlContainer, FormGroupDirective, ReactiveFormsModule } from '@angular/forms';
import { HlmLabel } from '@egose/shadcn-theme-ng/label';
import { HlmCheckbox } from '@egose/shadcn-theme-ng/checkbox';
import { HlmError, HlmHint, HlmFormIdGenerator } from '@egose/shadcn-theme-ng/form-field';
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
    @let cnm = controlName();
    @let err = error();
    @let hnt = hint();
    @let rqrd = required();

    <eg-form-field>
      <div class="tw:flex tw:items-center tw:gap-1">
        <hlm-checkbox
          [id]="effectiveId()"
          [name]="cnm || name() || null"
          [formControlName]="cnm"
          [class]="$checkboxClass()"
          [checked]="checked()"
          [required]="rqrd"
          [wrapperDisabled]="disabled()"
          [aria-describedby]="describedBy()"
        />
        <label hlmLabel [for]="effectiveId()" [class]="$labelClass()">
          {{ lbl }}
          @if (rqrd) {
            <span class="tw:text-red-500">*</span>
          }
        </label>
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
export class EgFormCheckbox {
  private readonly formGroupDirective = inject(FormGroupDirective);
  private readonly generatedId = inject(HlmFormIdGenerator).generate('eg-form-checkbox');

  // Classes
  public readonly userClass = input<ClassValue>('', { alias: 'class' });
  protected readonly _computedClass = computed(() => hlm('', this.userClass()));

  // Inputs
  label = input<string>('');
  controlId = input<string | undefined>(undefined);
  controlName = input<string>('');
  error = input<string | undefined>(undefined);
  hint = input<string | undefined>(undefined);

  id = input<string | undefined>(undefined);
  name = input<string | undefined>(undefined);
  checked = input<boolean>(false);
  required = input<boolean>(false);
  disabled = input<boolean>(false);

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
  checkboxClass = input<string>('');
  labelClass = input<string>('');

  // Computed styling
  $checkboxClass = computed(() => hlm(this.checkboxClass()));
  $labelClass = computed(() => hlm(this.labelClass()));
  $errorClass = input<string>('');
  $hintClass = input<string>('');
}
