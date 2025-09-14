import { BooleanInput } from '@angular/cdk/coercion';
import {
  ChangeDetectionStrategy,
  Component,
  booleanAttribute,
  computed,
  forwardRef,
  input,
  linkedSignal,
  model,
  output,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ChangeFn, TouchFn } from '@spartan-ng/brain/forms';
import { BrnSwitch, BrnSwitchThumb } from '@spartan-ng/brain/switch';
import { cn } from '@egose/shadcn-theme-ng/utils';
import type { ClassValue } from 'clsx';
import { HlmSwitchThumb } from './switch-thumb';
export const EG_SWITCH_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => HlmSwitch),
  multi: true,
};

@Component({
  selector: 'hlm-switch',
  imports: [BrnSwitchThumb, BrnSwitch, HlmSwitchThumb],
  host: {
    class: 'contents',
    '[attr.id]': 'null',
    '[attr.aria-label]': 'null',
    '[attr.aria-labelledby]': 'null',
    '[attr.aria-describedby]': 'null',
  },
  template: `
    <brn-switch
      [class]="_computedClass()"
      [checked]="checked()"
      (changed)="handleChange($event)"
      (touched)="_onTouched?.()"
      [disabled]="_disabled()"
      [id]="id()"
      [aria-label]="ariaLabel()"
      [aria-labelledby]="ariaLabelledby()"
      [aria-describedby]="ariaDescribedby()"
    >
      <brn-switch-thumb hlm />
    </brn-switch>
  `,
  providers: [EG_SWITCH_VALUE_ACCESSOR],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HlmSwitch implements ControlValueAccessor {
  public readonly userClass = input<ClassValue>('', { alias: 'class' });
  protected readonly _computedClass = computed(() =>
    cn(
      'tw:data-[state=checked]:bg-primary tw:data-[state=unchecked]:bg-input tw:focus-visible:border-ring tw:focus-visible:ring-ring/50 tw:dark:data-[state=unchecked]:bg-input/80 tw:shadow-xs tw:group tw:inline-flex tw:h-[1.15rem] tw:w-8 tw:shrink-0 tw:items-center tw:rounded-full tw:border tw:border-transparent tw:outline-none tw:transition-all tw:focus-visible:ring-[3px] tw:data-[disabled=true]:cursor-not-allowed tw:data-[disabled=true]:opacity-50',
      this.userClass(),
    ),
  );

  /** The checked state of the switch. */
  public readonly checked = model<boolean>(false);

  /** The disabled state of the switch. */
  public readonly disabled = input<boolean, BooleanInput>(false, {
    transform: booleanAttribute,
  });

  /** Used to set the id on the underlying brn element. */
  public readonly id = input<string | null>(null);

  /** Used to set the aria-label attribute on the underlying brn element. */
  public readonly ariaLabel = input<string | null>(null, { alias: 'aria-label' });

  /** Used to set the aria-labelledby attribute on the underlying brn element. */
  public readonly ariaLabelledby = input<string | null>(null, { alias: 'aria-labelledby' });

  /** Used to set the aria-describedby attribute on the underlying brn element. */
  public readonly ariaDescribedby = input<string | null>(null, { alias: 'aria-describedby' });

  /** Emits when the checked state of the switch changes. */
  public readonly changed = output<boolean>();

  protected readonly _disabled = linkedSignal(this.disabled);

  protected _onChange?: ChangeFn<boolean>;
  protected _onTouched?: TouchFn;

  protected handleChange(value: boolean): void {
    this.checked.set(value);
    this._onChange?.(value);
    this.changed.emit(value);
  }

  /** CONROL VALUE ACCESSOR */

  writeValue(value: boolean): void {
    this.checked.set(Boolean(value));
  }

  registerOnChange(fn: ChangeFn<boolean>): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: TouchFn): void {
    this._onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this._disabled.set(isDisabled);
  }
}
