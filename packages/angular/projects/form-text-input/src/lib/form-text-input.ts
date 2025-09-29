import { Component, Directive, ElementRef, Renderer2, OnChanges, computed, input, Input } from '@angular/core';
import { ControlContainer, FormGroupDirective, ReactiveFormsModule } from '@angular/forms';
import { HlmFormField, HlmError, HlmHint } from '@egose/shadcn-theme-ng/form-field';
import { HlmLabel } from '@egose/shadcn-theme-ng/label';
import { HlmInput } from '@egose/shadcn-theme-ng/input';
import { hlm } from '@egose/shadcn-theme-ng/utils';
import { ClassValue } from 'clsx';

// NOT USED
@Directive({
  selector: '[spreadAttrs]',
  standalone: true,
})
export class SpreadAttrsDirective implements OnChanges {
  attrs = input<Record<string, any>>({});

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
  ) {}

  ngOnChanges() {
    const obj = this.attrs();
    for (const [key, value] of Object.entries(obj)) {
      if (value === null || value === undefined || value === false) {
        this.renderer.removeAttribute(this.el.nativeElement, key);
      } else {
        this.renderer.setAttribute(this.el.nativeElement, key, String(value));
      }
    }
  }
}

let nextId = 0;

@Component({
  selector: 'eg-form-text-input',
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

      <input
        hlmInput
        [attr.aria-label]="lbl"
        [id]="cid || id()"
        [name]="cnm || name()"
        [formControlName]="cnm"
        [class]="$inputClass()"
        [type]="type()"
        [placeholder]="placeholder()"
        [readonly]="readonly()"
        [max]="max()"
        [min]="min()"
        [maxlength]="maxlength()"
        [minlength]="minlength()"
        [pattern]="pattern()"
        [autocomplete]="autocomplete()"
        [autofocus]="autofocus()"
        [required]="rqrd"
      />

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
export class EgFormTextInput {
  label = input<string | undefined>(undefined);
  controlId = input<string | undefined>(undefined);
  controlName = input<string>('');
  error = input<string | undefined>(undefined);
  hint = input<string | undefined>(undefined);

  // HTML/input attributes
  id = input<string>(crypto.randomUUID());
  // id = input<string>(`eg-form-text-input-${nextId++}`);

  name = input<string | undefined>(undefined);
  type = input<string>('text');
  placeholder = input<string>('');
  readonly = input<boolean>(false);
  disabled = input<boolean>(false);
  maxlength = input<string | number | null>(null);
  minlength = input<string | number | null>(null);
  max = input<string | number | null>(null);
  min = input<string | number | null>(null);
  pattern = input<string | RegExp>('');
  autocomplete = input<string | undefined>(undefined);
  autofocus = input<boolean>(false);
  required = input<boolean>(false);

  // Styling classes
  userClass = input<ClassValue>('', { alias: 'class' });
  labelClass = input<string>('');
  inputClass = input<string>('');
  errorClass = input<string>('');
  hintClass = input<string>('');

  // Computed class bindings
  $userClass = computed(() => hlm('tw:flex tw:flex-col', this.userClass()));
  $labelClass = computed(() => hlm('tw:mb-1 tw:gap-0', this.labelClass()));
  $inputClass = computed(() => hlm('tw:mb-1', this.inputClass()));
  $errorClass = computed(() => hlm('tw:mt-0', this.errorClass()));
  $hintClass = computed(() => hlm('tw:mt-0', this.hintClass()));
}
