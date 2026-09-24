import { Component, computed, inject, input } from '@angular/core';
import { ControlContainer, FormGroupDirective, ReactiveFormsModule } from '@angular/forms';
import { HlmFormField, HlmError, HlmHint, HlmFormIdGenerator } from '@egose/shadcn-theme-ng/form-field';
import { HlmLabel } from '@egose/shadcn-theme-ng/label';
import {
  HlmAutocomplete,
  HlmAutocompleteContent,
  HlmAutocompleteEmpty,
  HlmAutocompleteGroup,
  HlmAutocompleteInput,
  HlmAutocompleteItem,
  HlmAutocompleteLabel,
  HlmAutocompleteList,
} from '@egose/shadcn-theme-ng/autocomplete';
import { hlm } from '@egose/shadcn-theme-ng/utils';
import { ClassValue } from 'clsx';
import { injectEgFormAutocompleteConfig } from './form-autocomplete.token';

@Component({
  selector: 'eg-form-autocomplete',
  standalone: true,
  host: {
    '[class]': '$userClass()',
  },
  imports: [
    ReactiveFormsModule,
    HlmFormField,
    HlmError,
    HlmHint,
    HlmLabel,
    HlmAutocomplete,
    HlmAutocompleteContent,
    HlmAutocompleteEmpty,
    HlmAutocompleteGroup,
    HlmAutocompleteInput,
    HlmAutocompleteItem,
    HlmAutocompleteLabel,
    HlmAutocompleteList,
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

      <div hlmAutocomplete [formControlName]="cnm" [disabled]="effectiveDisabled()" [class]="$controlClass()">
        <hlm-autocomplete-input [inputId]="effectiveId()" [placeholder]="placeholder()" [class]="$inputClass()" />
        <hlm-autocomplete-content>
          <div hlmAutocompleteList>
            <div hlmAutocompleteGroup>
              @for (option of options(); track option) {
                <hlm-autocomplete-item [value]="option">{{ option }}</hlm-autocomplete-item>
              }
            </div>
          </div>
          <div hlmAutocompleteEmpty>{{ emptyText() }}</div>
        </hlm-autocomplete-content>
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
    </hlm-form-field>
  `,
})
export class EgFormAutocomplete {
  private readonly formGroupDirective = inject(FormGroupDirective);
  private readonly generatedId = inject(HlmFormIdGenerator).generate('eg-form-autocomplete');
  private readonly _config = injectEgFormAutocompleteConfig();

  label = input<string | undefined>(undefined);
  controlId = input<string | undefined>(undefined);
  controlName = input<string>('');
  error = input<string | undefined>(undefined);
  hint = input<string | undefined>(undefined);

  id = input<string | undefined>(undefined);
  placeholder = input<string>('Type to search…');
  emptyText = input<string>('No result.');
  disabled = input<boolean>(false);
  required = input<boolean>(false);

  options = input<string[]>([]);

  readonly effectiveId = computed(() => this.controlId() || this.id() || this.generatedId);
  readonly errorId = computed(() => `${this.effectiveId()}-error`);
  readonly hintId = computed(() => `${this.effectiveId()}-hint`);

  /**
   * Combined lock for the brain `linkedSignal`-based disabled state: the raw
   * input write always carries the resolved value, so a same-pass
   * wrapper-toggle + `control.disable()` cannot clobber CVA state.
   */
  effectiveDisabled(): boolean {
    return this.disabled() || !!this.formGroupDirective.form.get(this.controlName())?.disabled;
  }

  // Styling
  userClass = input<ClassValue>('', { alias: 'class' });
  labelClass = input<string>('');
  controlClass = input<string>('');
  inputClass = input<string>('');
  errorClass = input<string>('');
  hintClass = input<string>('');

  // Computed classes (library base < global config < per-instance).
  // NOTE: the autocomplete input exposes no aria-describedby, so error/hint
  // ids render without an input-level describedby link.
  $userClass = computed(() => hlm('tw:w-full', this.userClass()));
  $labelClass = computed(() => hlm('tw:mb-1', this._config.labelClass, this.labelClass()));
  $controlClass = computed(() => hlm(this._config.controlClass, this.controlClass()));
  $inputClass = computed(() => hlm(this._config.inputClass, this.inputClass()));
  $errorClass = computed(() => hlm('tw:mt-0', this._config.errorClass, this.errorClass()));
  $hintClass = computed(() => hlm('tw:mt-0', this._config.hintClass, this.hintClass()));
}
