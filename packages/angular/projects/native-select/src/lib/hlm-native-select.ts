import type { BooleanInput } from '@angular/cdk/coercion';
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  forwardRef,
  inject,
  input,
  linkedSignal,
  output,
} from '@angular/core';
import { NG_VALUE_ACCESSOR, type ControlValueAccessor } from '@angular/forms';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronDown } from '@ng-icons/lucide';
import { BrnFieldControl, provideBrnLabelable } from '@spartan-ng/brain/field';
import { type ChangeFn, type TouchFn } from '@spartan-ng/brain/forms';
import { classes, hlm } from '@egose/shadcn-theme-ng/utils';
import type { ClassValue } from 'clsx';

export const HLM_NATIVE_SELECT_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => HlmNativeSelect),
  multi: true,
};

@Component({
  selector: 'hlm-native-select',
  imports: [NgIcon],
  providers: [
    HLM_NATIVE_SELECT_VALUE_ACCESSOR,
    provideIcons({ lucideChevronDown }),
    provideBrnLabelable(HlmNativeSelect),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [BrnFieldControl],
  host: {
    'data-slot': 'native-select-wrapper',
    '[attr.data-size]': 'size()',
  },
  template: `
    <select
      data-slot="native-select"
      [id]="selectId()"
      [class]="_computedSelectClass()"
      [attr.data-size]="size()"
      [attr.aria-invalid]="_ariaInvalid() ? 'true' : null"
      [attr.data-invalid]="_ariaInvalid() ? 'true' : null"
      [attr.data-dirty]="_dirty?.() ? 'true' : null"
      [attr.data-touched]="_touched?.() ? 'true' : null"
      [attr.data-matches-spartan-invalid]="_spartanInvalid() ? 'true' : null"
      [value]="value()"
      [disabled]="_disabled()"
      (change)="_valueChanged($event)"
      (blur)="_blur()"
    >
      <ng-content />
    </select>

    <ng-icon
      name="lucideChevronDown"
      [class]="_computedSelectIconClass()"
      aria-hidden="true"
      data-slot="native-select-icon"
    />
  `,
})
export class HlmNativeSelect implements ControlValueAccessor {
  private readonly _fieldControl = inject(BrnFieldControl, { optional: true });

  private static _id = 0;

  public readonly selectId = input<string>(`hlm-native-select-${HlmNativeSelect._id++}`);

  public readonly selectClass = input<ClassValue>('');

  protected readonly _computedSelectClass = computed(() =>
    hlm(
      'tw:border-input tw:placeholder:text-muted-foreground tw:selection:bg-primary tw:selection:text-primary-foreground tw:dark:bg-input/30 tw:dark:hover:bg-input/50 tw:focus-visible:border-ring tw:focus-visible:ring-ring/50 tw:data-[matches-spartan-invalid=true]:ring-destructive/20 tw:dark:data-[matches-spartan-invalid=true]:ring-destructive/40 tw:data-[matches-spartan-invalid=true]:border-destructive tw:dark:data-[matches-spartan-invalid=true]:border-destructive/50 tw:h-9 tw:w-full tw:min-w-0 tw:appearance-none tw:rounded-md tw:border tw:bg-transparent tw:py-1 tw:ps-2.5 tw:pe-8 tw:text-sm tw:shadow-xs tw:transition-[color,box-shadow] tw:select-none tw:focus-visible:ring-3 tw:data-[matches-spartan-invalid=true]:ring-3 tw:data-[size=sm]:h-8 tw:outline-none tw:disabled:pointer-events-none tw:disabled:cursor-not-allowed',
      this.selectClass(),
    ),
  );

  public readonly selectIconClass = input<ClassValue>('');

  protected readonly _computedSelectIconClass = computed(() =>
    hlm(
      'tw:text-muted-foreground tw:end-2.5 tw:top-1/2 tw:-translate-y-1/2 tw:text-[length:--spacing(4)] tw:pointer-events-none tw:absolute tw:select-none',
      this.selectIconClass(),
    ),
  );

  public readonly size = input<'sm' | 'default'>('default');

  public readonly disabled = input<boolean, BooleanInput>(false, { transform: booleanAttribute });

  protected readonly _disabled = linkedSignal(this.disabled);

  /** Whether to force the input into an invalid state. */
  public readonly forceInvalid = input<boolean, BooleanInput>(false, { transform: booleanAttribute });

  /** Manual override for aria-invalid. When not set, auto-detects from the parent autocomplete error state. */
  public readonly ariaInvalidOverride = input<boolean | undefined, BooleanInput>(undefined, {
    transform: (v: BooleanInput) => (v === '' || v === undefined ? undefined : booleanAttribute(v)),
    alias: 'aria-invalid',
  });

  protected readonly _ariaInvalid = computed(() => this.ariaInvalidOverride() ?? this._invalid?.());

  public readonly valueInput = input<string | undefined | null>('', { alias: 'value' });
  public readonly value = linkedSignal(this.valueInput);

  public readonly valueChange = output<string | undefined | null>();

  protected _onChange?: ChangeFn<string | undefined | null>;
  protected _onTouched?: TouchFn;

  public readonly labelableId = this.selectId;

  protected readonly _invalid = this._fieldControl?.invalid;
  protected readonly _touched = this._fieldControl?.touched;
  protected readonly _dirty = this._fieldControl?.dirty;
  protected readonly _spartanInvalid = computed(() => this.forceInvalid() || this._fieldControl?.spartanInvalid());

  constructor() {
    classes(() => 'tw:group/native-select tw:relative tw:w-fit tw:has-[select:disabled]:opacity-50');
  }

  protected _valueChanged(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.value.set(value);
    this.valueChange.emit(value);
    this._onChange?.(value);
    this._onTouched?.();
  }

  protected _blur(): void {
    this._onTouched?.();
  }

  /** CONTROL VALUE ACCESSOR */
  public writeValue(value: string | undefined | null): void {
    this.value.set(value);
  }

  public registerOnChange(fn: ChangeFn<string | undefined | null>): void {
    this._onChange = fn;
  }

  public registerOnTouched(fn: TouchFn): void {
    this._onTouched = fn;
  }

  public setDisabledState(isDisabled: boolean): void {
    this._disabled.set(isDisabled);
  }
}
