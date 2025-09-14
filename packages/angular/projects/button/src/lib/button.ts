import { Component, Input, computed, signal } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { BrnButton } from '@spartan-ng/brain/button';
import { HlmSpinner } from '@egose/shadcn-theme-ng/spinner';
import { cva, type VariantProps } from 'class-variance-authority';
import { type ClassValue } from 'clsx';
import { cn } from '@egose/shadcn-theme-ng/utils';

export const buttonVariants = cva(
  [
    'tw:cursor-pointer',
    'tw:active:translate-y-[0.5px]',
    'tw:disabled:pointer-events-none',
    'tw:disabled:opacity-50',
    'tw:focus-visible:outline-none',
    'tw:focus-visible:ring-1',
    'tw:focus-visible:ring-ring',
    'tw:font-medium',
    'tw:gap-2',
    'tw:inline-flex',
    'tw:items-center',
    'tw:justify-center',
    'tw:rounded-sm',
    'tw:text-sm',
    'tw:transform',
    'tw:transition',
    'tw:transition-colors',
    'tw:whitespace-nowrap',
    'tw:[&_svg]:pointer-events-none',
    'tw:[&_svg]:shrink-0',
    'tw:[&_svg]:size-4',
  ],
  {
    variants: {
      variant: {
        primary:
          'tw:border tw:border-primary tw:bg-primary tw:text-primary-foreground tw:shadow-sm tw:hover:bg-primary/90',
        secondary:
          'tw:border tw:border-secondary tw:bg-secondary tw:text-secondary-foreground tw:shadow-sm tw:hover:bg-secondary/90',
        success:
          'tw:border tw:border-success tw:bg-success tw:text-success-foreground tw:shadow-sm tw:hover:bg-success/90',
        warning:
          'tw:border tw:border-warning tw:bg-warning tw:text-warning-foreground tw:shadow-sm tw:hover:bg-warning/90',
        danger: 'tw:border tw:border-danger tw:bg-danger tw:text-danger-foreground tw:shadow-sm tw:hover:bg-danger/90',
        info: 'tw:border tw:border-info tw:bg-info tw:text-info-foreground tw:shadow-sm tw:hover:bg-info/90',
        light: 'tw:border tw:border-light tw:bg-light tw:text-light-foreground tw:shadow-sm tw:hover:bg-light/90',
        dark: 'tw:border tw:border-dark tw:bg-dark tw:text-dark-foreground tw:shadow-sm tw:hover:bg-dark/90',
        accent: 'tw:border tw:border-accent tw:bg-accent tw:text-accent-foreground tw:shadow-sm tw:hover:bg-accent/90',
        destructive:
          'tw:border tw:border-destructive tw:bg-destructive tw:text-destructive-foreground tw:shadow-sm tw:hover:bg-destructive/90',
        muted: 'tw:border tw:border-muted tw:bg-muted tw:text-muted-foreground tw:shadow-sm tw:hover:bg-muted/90',
        link: 'tw:text-primary tw:underline-offset-4 tw:hover:underline',
        ghost: 'tw:hover:bg-light tw:hover:text-light-foreground',
      },
      size: {
        default: 'tw:h-9 tw:px-4 tw:py-2',
        sm: 'tw:h-8 tw:rounded-sm tw:px-3 tw:text-xs',
        lg: 'tw:h-10 tw:rounded-sm tw:px-8',
        icon: 'tw:h-9 tw:w-9',
        'compact-default': 'tw:h-8 tw:px-2 tw:py-1',
        'compact-sm': 'tw:h-7 tw:px-2 tw:py-1',
        'compact-lg': 'tw:h-9 tw:px-2 tw:py-1',
        'compact-icon': 'tw:h-8 tw:w-8',
      },
      appearance: {
        solid: '',
        outline: 'tw:bg-white tw:border',
        'outline-filled': 'tw:bg-white tw:border',
      },
      loading: {
        true: 'tw:pointer-events-none',
        false: null,
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'default',
      appearance: 'solid',
      loading: false,
    },
  },
);

export type ButtonVariants = VariantProps<typeof buttonVariants>;
export type VariantType = NonNullable<ButtonVariants['variant']>;
export type SizeType = NonNullable<ButtonVariants['size']>;
export type AppearanceType = NonNullable<ButtonVariants['appearance']>;

@Component({
  selector: 'button[hlmButton], a[hlmButton]',
  standalone: true,
  imports: [BrnButton, HlmSpinner, NgTemplateOutlet],
  hostDirectives: [{ directive: BrnButton, inputs: ['disabled'] }],
  host: {
    '[class]': '_computedClass()',
    '[attr.aria-busy]': 'loading || null',
    '[attr.disabled]': '(loading || disabled) ? true : null',
    '[attr.type]': 'type',
  },
  template: `
    <ng-template #projected>
      <ng-content></ng-content>
    </ng-template>

    @if (loading) {
      <div class="tw:relative tw:inline-flex tw:items-center">
        <span class="tw:invisible">
          <ng-container *ngTemplateOutlet="projected" />
        </span>
        <span class="tw:absolute tw:inset-0 tw:flex tw:items-center tw:justify-center">
          <hlm-spinner size="small" [spinnerClass]="spinnerClass()" />
        </span>
      </div>
    } @else {
      <div class="tw:flex tw:items-center tw:gap-1">
        @if (icon && iconPosition === 'left') {
          <ng-container *ngTemplateOutlet="icon" />
        }
        <ng-container *ngTemplateOutlet="projected" />
        @if (icon && iconPosition === 'right') {
          <ng-container *ngTemplateOutlet="icon" />
        }
      </div>
    }
  `,
})
export class HlmButton {
  /** Props */
  @Input() variant: VariantType = 'primary';
  @Input() size: SizeType = 'default';
  @Input() appearance: AppearanceType = 'solid';
  @Input() loading = false;
  @Input() icon?: any;
  @Input() iconPosition: 'left' | 'right' = 'left';
  @Input() userClass: ClassValue = '';
  @Input() spinnerUserClass: ClassValue = '';
  @Input() disabled = false;
  @Input() type: 'button' | 'submit' | 'reset' = 'button';

  private readonly _additionalClasses = signal<ClassValue>('');

  /** Computed button class merging */
  protected readonly _computedClass = computed(() => {
    const outlineClasses =
      this.appearance === 'outline' || this.appearance === 'outline-filled'
        ? [this.getOutlineClasses(this.variant)]
        : [];
    if (this.appearance === 'outline-filled') {
      outlineClasses.push(this.getOutlineFilledClasses(this.variant));
    }
    return cn(
      buttonVariants({
        variant: this.variant,
        size: this.size,
        appearance: this.appearance,
        loading: this.loading,
        className: this.userClass,
      }),
      outlineClasses,
      this.loading ? 'tw:pointer-events-none' : '',
      this._additionalClasses(),
    );
  });

  /** Computed spinner classes */
  protected readonly spinnerClass = computed(() => {
    const base =
      this.appearance === 'outline' || this.appearance === 'outline-filled'
        ? this.getOutlineSpinnerClasses(this.variant)
        : this.getSpinnerClasses(this.variant);
    return cn(base, this.spinnerUserClass);
  });

  setClass(classes: string): void {
    this._additionalClasses.set(classes);
  }

  /** Helper functions */
  private getOutlineClasses(variant: VariantType) {
    const colors: Record<VariantType, string> = {
      primary: 'tw:border-primary tw:text-primary tw:shadow-sm tw:hover:bg-primary/10',
      secondary: 'tw:border-secondary tw:text-secondary tw:shadow-sm tw:hover:bg-secondary/10',
      success: 'tw:border-success tw:text-success tw:shadow-sm tw:hover:bg-success/10',
      warning: 'tw:border-warning tw:text-warning tw:shadow-sm tw:hover:bg-warning/10',
      danger: 'tw:border-danger tw:text-danger tw:shadow-sm tw:hover:bg-danger/10',
      info: 'tw:border-info tw:text-info tw:shadow-sm tw:hover:bg-info/10',
      light: 'tw:border-light tw:text-light-foreground tw:shadow-sm tw:hover:bg-light/10',
      dark: 'tw:border-dark tw:text-dark tw:shadow-sm tw:hover:bg-dark/10',
      accent: 'tw:border-accent tw:text-accent tw:shadow-sm tw:hover:bg-accent/10',
      destructive: 'tw:border-destructive tw:text-destructive tw:shadow-sm tw:hover:bg-destructive/10',
      muted: 'tw:border-muted tw:text-muted-foreground tw:shadow-sm tw:hover:bg-muted/10',
      link: 'tw:text-primary',
      ghost: 'tw:text-light-foreground',
    };
    return colors[variant];
  }

  private getOutlineFilledClasses(variant: VariantType) {
    const colors: Record<VariantType, string> = {
      primary: 'tw:hover:bg-primary tw:hover:text-primary-foreground',
      secondary: 'tw:hover:bg-secondary tw:hover:text-secondary-foreground',
      success: 'tw:hover:bg-success tw:hover:text-success-foreground',
      warning: 'tw:hover:bg-warning tw:hover:text-warning-foreground',
      danger: 'tw:hover:bg-danger tw:hover:text-danger-foreground',
      info: 'tw:hover:bg-info tw:hover:text-info-foreground',
      light: 'tw:hover:bg-light tw:hover:text-light-foreground',
      dark: 'tw:hover:bg-dark tw:hover:text-dark-foreground',
      accent: 'tw:hover:bg-accent tw:hover:text-accent-foreground',
      destructive: 'tw:hover:bg-destructive tw:hover:text-destructive-foreground',
      muted: 'tw:hover:bg-muted tw:hover:text-muted-foreground',
      link: 'tw:hover:underline',
      ghost: 'tw:hover:bg-light',
    };
    return colors[variant];
  }

  private getSpinnerClasses(variant: VariantType) {
    const colors: Record<VariantType, string> = {
      primary: 'tw:[&>svg]:text-primary-foreground',
      secondary: 'tw:[&>svg]:text-secondary-foreground',
      success: 'tw:[&>svg]:text-success-foreground',
      warning: 'tw:[&>svg]:text-warning-foreground',
      danger: 'tw:[&>svg]:text-danger-foreground',
      info: 'tw:[&>svg]:text-info-foreground',
      light: 'tw:[&>svg]:text-light-foreground',
      dark: 'tw:[&>svg]:text-dark-foreground',
      accent: 'tw:[&>svg]:text-accent-foreground',
      destructive: 'tw:[&>svg]:text-destructive-foreground',
      muted: 'tw:[&>svg]:text-muted-foreground',
      link: 'tw:[&>svg]:text-primary',
      ghost: 'tw:[&>svg]:text-light-foreground',
    };
    return colors[variant];
  }

  private getOutlineSpinnerClasses(variant: VariantType) {
    const colors: Record<VariantType, string> = {
      primary: 'tw:[&>svg]:text-primary',
      secondary: 'tw:[&>svg]:text-secondary',
      success: 'tw:[&>svg]:text-success',
      warning: 'tw:[&>svg]:text-warning',
      danger: 'tw:[&>svg]:text-danger',
      info: 'tw:[&>svg]:text-info',
      light: 'tw:[&>svg]:text-light',
      dark: 'tw:[&>svg]:text-dark',
      accent: 'tw:[&>svg]:text-accent',
      destructive: 'tw:[&>svg]:text-destructive',
      muted: 'tw:[&>svg]:text-muted-foreground',
      link: 'tw:[&>svg]:text-primary',
      ghost: 'tw:[&>svg]:text-light-foreground',
    };
    return colors[variant];
  }
}
