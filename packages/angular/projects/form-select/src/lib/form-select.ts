import { Component, computed, inject, input } from '@angular/core';
import { ControlContainer, FormGroupDirective, ReactiveFormsModule } from '@angular/forms';
import { HlmFormField, HlmError, HlmHint, HlmFormIdGenerator } from '@egose/shadcn-theme-ng/form-field';
import { HlmLabel } from '@egose/shadcn-theme-ng/label';
import { hlm } from '@egose/shadcn-theme-ng/utils';
import { ClassValue } from 'clsx';
import { BrnSelectImports } from '@spartan-ng/brain/select';
import {
  HlmSelectImports,
  HlmSelect,
  HlmSelectTrigger,
  HlmSelectValue,
  HlmSelectContent,
  HlmSelectItem,
  HlmSelectLabel,
} from '@egose/shadcn-theme-ng/select';

interface SelectOption {
  value: string;
  label: string;
}

@Component({
  selector: 'eg-form-select',
  standalone: true,
  host: {
    class: 'tw:w-full',
  },
  imports: [
    ReactiveFormsModule,
    HlmFormField,
    HlmError,
    HlmHint,
    HlmLabel,
    BrnSelectImports,
    HlmSelectImports,
    HlmSelect,
    HlmSelectTrigger,
    HlmSelectValue,
    HlmSelectContent,
    HlmSelectItem,
    HlmSelectLabel,
  ],
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

      @if (multiple()) {
        <brn-select-multiple hlmSelect [formControlName]="cnm">
          <hlm-select-trigger
            [buttonId]="effectiveId()"
            [ariaDescribedby]="describedBy()"
            [wrapperDisabled]="disabled()"
            [class]="$selectClass()"
          >
            <hlm-select-value [placeholder]="placeholder()" />
          </hlm-select-trigger>

          <hlm-select-content>
            @if (options().length) {
              @if (optionsLabel()) {
                <hlm-select-label>{{ optionsLabel() }}</hlm-select-label>
              }
              @for (option of options(); track option.value) {
                <hlm-select-item [value]="option.value">{{ option.label }}</hlm-select-item>
              }
            }
          </hlm-select-content>
        </brn-select-multiple>
      } @else {
        <brn-select hlmSelect [formControlName]="cnm">
          <hlm-select-trigger
            [buttonId]="effectiveId()"
            [ariaDescribedby]="describedBy()"
            [wrapperDisabled]="disabled()"
            [class]="$selectClass()"
          >
            <hlm-select-value [placeholder]="placeholder()" />
          </hlm-select-trigger>

          <hlm-select-content>
            @if (options().length) {
              @if (optionsLabel()) {
                <hlm-select-label>{{ optionsLabel() }}</hlm-select-label>
              }
              @for (option of options(); track option.value) {
                <hlm-select-item [value]="option.value">{{ option.label }}</hlm-select-item>
              }
            }
          </hlm-select-content>
        </brn-select>
      }

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
export class EgFormSelect {
  private readonly formGroupDirective = inject(FormGroupDirective);
  private readonly generatedId = inject(HlmFormIdGenerator).generate('eg-form-select');

  label = input<string | undefined>(undefined);
  controlId = input<string | undefined>(undefined);
  controlName = input<string>('');
  error = input<string | undefined>(undefined);
  hint = input<string | undefined>(undefined);

  // HTML/select attributes
  id = input<string | undefined>(undefined);
  placeholder = input<string>('');
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

  // Select-specific
  multiple = input<boolean>(false);
  options = input<SelectOption[]>([]);
  optionsLabel = input<string | undefined>(undefined); // optional group label

  // Styling classes
  userClass = input<ClassValue>('', { alias: 'class' });
  labelClass = input<string>('');
  selectClass = input<string>('');
  errorClass = input<string>('');
  hintClass = input<string>('');

  // Computed classes
  $userClass = computed(() => hlm('tw:flex tw:flex-col', this.userClass()));
  $labelClass = computed(() => hlm('tw:mb-1 tw:gap-0', this.labelClass()));
  $selectClass = computed(() => hlm('tw:w-full', this.selectClass()));
  $errorClass = computed(() => hlm('tw:mt-0', this.errorClass()));
  $hintClass = computed(() => hlm('tw:mt-0', this.hintClass()));
}
