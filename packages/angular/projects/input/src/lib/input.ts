import {
  computed,
  Directive,
  type DoCheck,
  effect,
  forwardRef,
  inject,
  Injector,
  input,
  linkedSignal,
  untracked,
} from '@angular/core';
import { FormGroupDirective, NgControl, NgForm } from '@angular/forms';
import { BrnFormFieldControl } from '@spartan-ng/brain/form-field';
import { ErrorStateMatcher, ErrorStateTracker } from '@spartan-ng/brain/forms';
import { cn } from '@egose/shadcn-theme-ng/utils';
import { cva, VariantProps } from 'class-variance-authority';
import type { ClassValue } from 'clsx';

export const inputVariants = cva(
  'tw:file:text-foreground tw:placeholder:text-muted-foreground tw:selection:bg-primary tw:selection:text-primary-foreground tw:dark:bg-input/10 tw:border-input tw:shadow-xs tw:focus-visible:border-ring tw:focus-visible:ring-ring/50 tw:flex tw:h-9 tw:w-full tw:min-w-0 tw:rounded-md tw:border tw:bg-transparent tw:px-3 tw:py-1 tw:text-base tw:outline-none tw:transition-[color,box-shadow] tw:file:inline-flex tw:file:h-7 tw:file:border-0 tw:file:bg-transparent tw:file:text-sm tw:file:font-medium tw:focus-visible:ring-[3px] tw:disabled:pointer-events-none tw:disabled:cursor-not-allowed tw:disabled:opacity-50 md:text-sm',
  {
    variants: {
      error: {
        auto: 'tw:[&.ng-invalid.ng-touched]:text-destructive/20 tw:dark:[&.ng-invalid.ng-touched]:text-destructive/40 tw:[&.ng-invalid.ng-touched]:border-destructive tw:[&.ng-invalid.ng-touched]:focus-visible:ring-destructive',
        true: 'tw:text-destructive/90 dark:text-destructive/60 tw:border-destructive tw:focus-visible:ring-destructive',
      },
    },
    defaultVariants: {
      error: 'auto',
    },
  },
);
type InputVariants = VariantProps<typeof inputVariants>;

@Directive({
  selector: '[hlmInput]',
  host: {
    '[class]': '_computedClass()',
  },
  providers: [
    {
      provide: BrnFormFieldControl,
      useExisting: forwardRef(() => HlmInput),
    },
  ],
})
export class HlmInput implements BrnFormFieldControl, DoCheck {
  public readonly error = input<InputVariants['error']>('auto');

  protected readonly _state = linkedSignal(() => ({ error: this.error() }));

  public readonly userClass = input<ClassValue>('', { alias: 'class' });
  protected readonly _computedClass = computed(() =>
    cn(inputVariants({ error: this._state().error }), this.userClass()),
  );

  private readonly _injector = inject(Injector);

  public readonly ngControl: NgControl | null = this._injector.get(NgControl, null);

  private readonly _errorStateTracker: ErrorStateTracker;

  private readonly _defaultErrorStateMatcher = inject(ErrorStateMatcher);
  private readonly _parentForm = inject(NgForm, { optional: true });
  private readonly _parentFormGroup = inject(FormGroupDirective, { optional: true });

  public readonly errorState = computed(() => this._errorStateTracker.errorState());

  constructor() {
    this._errorStateTracker = new ErrorStateTracker(
      this._defaultErrorStateMatcher,
      this.ngControl,
      this._parentFormGroup,
      this._parentForm,
    );

    effect(() => {
      const error = this._errorStateTracker.errorState();
      untracked(() => {
        if (this.ngControl) {
          const shouldShowError = error && this.ngControl.invalid && (this.ngControl.touched || this.ngControl.dirty);
          this._errorStateTracker.errorState.set(shouldShowError ? true : false);
          this.setError(shouldShowError ? true : 'auto');
        }
      });
    });
  }

  ngDoCheck() {
    this._errorStateTracker.updateErrorState();
  }

  setError(error: InputVariants['error']) {
    this._state.set({ error });
  }
}
