import { Component, computed, input } from '@angular/core';
import { ControlContainer, FormGroupDirective, ReactiveFormsModule } from '@angular/forms';
import { HlmFormField, HlmError, HlmHint } from '@egose/shadcn-theme-ng/form-field';
import { HlmLabel } from '@egose/shadcn-theme-ng/label';
import { cn } from '@egose/shadcn-theme-ng/utils';
import { ClassValue } from 'clsx';
import { BrnSelectImports } from '@spartan-ng/brain/select';
import { HlmSelectImports } from '@egose/shadcn-theme-ng/select';

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
  imports: [ReactiveFormsModule, HlmFormField, HlmError, HlmHint, HlmLabel, BrnSelectImports, HlmSelectImports],
  providers: [{ provide: ControlContainer, useExisting: FormGroupDirective }],
  // prettier-ignore
  template: `
    @let lbl = label();
    @let nm = controlName();
    @let err = error();
    @let hnt = hint();

    <hlm-form-field>
      @if (lbl) {
      <span hlmLabel [class]="$labelClass()">{{ lbl }}</span>
      }

      <brn-select
        [multiple]="multiple()"
        [placeholder]="placeholder()"
        [formControlName]="nm"
        [required]="required()"
      >
        <hlm-select-trigger [class]="$selectClass()">
          <hlm-select-value />
        </hlm-select-trigger>

        <hlm-select-content>
          @if (options().length) {
            @if (optionsLabel()) {
            <hlm-select-label>{{ optionsLabel() }}</hlm-select-label>
            }
            @for (option of options(); track option.value) {
            <hlm-option [value]="option.value">{{ option.label }}</hlm-option>
            }
          }
        </hlm-select-content>
      </brn-select>

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
export class EgFormSelect {
  label = input<string | undefined>(undefined);
  controlName = input<string>('');
  error = input<string | undefined>(undefined);
  hint = input<string | undefined>(undefined);

  // HTML/select attributes
  placeholder = input<string>('');
  disabled = input<boolean>(false);
  required = input<boolean>(false);

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
  $userClass = computed(() => cn('tw:flex tw:flex-col', this.userClass()));
  $labelClass = computed(() => cn('tw:mb-1', this.labelClass()));
  $selectClass = computed(() => cn('tw:w-full', this.selectClass()));
  $errorClass = computed(() => cn('tw:mt-0', this.errorClass()));
  $hintClass = computed(() => cn('tw:mt-0', this.hintClass()));
}
