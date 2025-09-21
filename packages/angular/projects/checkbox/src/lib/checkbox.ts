import { BooleanInput } from '@angular/cdk/coercion';
import {
  ChangeDetectionStrategy,
  Component,
  booleanAttribute,
  computed,
  forwardRef,
  input,
  model,
  output,
  signal,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCheck } from '@ng-icons/lucide';
import { BrnCheckbox } from '@spartan-ng/brain/checkbox';
import type { ChangeFn, TouchFn } from '@spartan-ng/brain/forms';
import { HlmIcon } from '@egose/shadcn-theme-ng/icon';
import { hlm } from '@egose/shadcn-theme-ng/utils';
import type { ClassValue } from 'clsx';

export const HLM_CHECKBOX_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => HlmCheckbox),
  multi: true,
};

@Component({
  selector: 'hlm-checkbox',
  imports: [BrnCheckbox, NgIcon, HlmIcon],
  template: `
    <brn-checkbox
      [id]="id()"
      [name]="name()"
      [class]="_computedClass()"
      [checked]="checked()"
      [disabled]="_state().disabled()"
      [required]="required()"
      [aria-label]="ariaLabel()"
      [aria-labelledby]="ariaLabelledby()"
      [aria-describedby]="ariaDescribedby()"
      (changed)="_handleChange()"
      (touched)="_onTouched?.()"
    >
      @if (checked()) {
        <span class="tw:flex tw:items-center tw:justify-center tw:text-current tw:transition-none">
          <ng-icon hlm size="14px" name="lucideCheck" />
        </span>
      }
    </brn-checkbox>
  `,
  host: {
    class: 'contents peer',
    '[attr.id]': 'null',
    '[attr.aria-label]': 'null',
    '[attr.aria-labelledby]': 'null',
    '[attr.aria-describedby]': 'null',
    '[attr.data-disabled]': '_state().disabled() ? "" : null',
  },
  providers: [HLM_CHECKBOX_VALUE_ACCESSOR],
  viewProviders: [provideIcons({ lucideCheck })],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HlmCheckbox implements ControlValueAccessor {
  public readonly userClass = input<ClassValue>('', { alias: 'class' });

  protected readonly _computedClass = computed(() =>
    hlm(
      'tw:border-input tw:dark:bg-input/30 tw:data-[state=checked]:bg-primary tw:data-[state=checked]:text-primary-foreground tw:dark:data-[state=checked]:bg-primary tw:data-[state=checked]:border-primary tw:focus-visible:border-ring tw:focus-visible:ring-ring/50 tw:aria-invalid:ring-destructive/20 tw:dark:aria-invalid:ring-destructive/40 tw:aria-invalid:border-destructive tw:shadow-xs tw:peer tw:size-4 tw:shrink-0 tw:cursor-default tw:rounded-[4px] tw:border tw:outline-none tw:transition-shadow tw:focus-visible:ring-[3px] tw:disabled:cursor-not-allowed tw:disabled:opacity-50',
      this.userClass(),
      this._state().disabled() ? 'tw:cursor-not-allowed tw:opacity-50' : '',
    ),
  );

  /** Used to set the id on the underlying brn element. */
  public readonly id = input<string | null>(null);

  /** Used to set the aria-label attribute on the underlying brn element. */
  public readonly ariaLabel = input<string | null>(null, { alias: 'aria-label' });

  /** Used to set the aria-labelledby attribute on the underlying brn element. */
  public readonly ariaLabelledby = input<string | null>(null, { alias: 'aria-labelledby' });

  /** Used to set the aria-describedby attribute on the underlying brn element. */
  public readonly ariaDescribedby = input<string | null>(null, { alias: 'aria-describedby' });

  /** The checked state of the checkbox. */
  public readonly checked = model<CheckboxValue>(false);

  /** The name attribute of the checkbox. */
  public readonly name = input<string | null>(null);

  /** Whether the checkbox is required. */
  public readonly required = input<boolean, BooleanInput>(false, { transform: booleanAttribute });

  /** Whether the checkbox is disabled. */
  public readonly disabled = input<boolean, BooleanInput>(false, { transform: booleanAttribute });

  protected readonly _state = computed(() => ({
    disabled: signal(this.disabled()),
  }));

  public readonly changed = output<boolean>();

  protected _onChange?: ChangeFn<CheckboxValue>;
  protected _onTouched?: TouchFn;

  protected _handleChange(): void {
    if (this._state().disabled()) return;

    const previousChecked = this.checked();
    this.checked.set(previousChecked === 'indeterminate' ? true : !previousChecked);
    this._onChange?.(!previousChecked);
    this.changed.emit(!previousChecked);
  }

  /** CONTROL VALUE ACCESSOR */
  writeValue(value: CheckboxValue): void {
    this.checked.set(!!value);
  }

  registerOnChange(fn: ChangeFn<CheckboxValue>): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: TouchFn): void {
    this._onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this._state().disabled.set(isDisabled);
  }
}

type CheckboxValue = boolean | 'indeterminate';
