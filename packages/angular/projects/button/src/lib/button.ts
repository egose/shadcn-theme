import { Component, Input, computed, signal } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { BrnButton } from '@spartan-ng/brain/button';
import { EgSpinner } from '@egose/shadcn-theme-ng/spinner';
import { cva, type VariantProps } from 'class-variance-authority';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/* Utility for merging classes */
function hlm(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/* Tailwind + CVA variant config */
export const buttonVariants = cva(
  [
    'cursor-pointer',
    'active:translate-y-[0.5px]',
    'disabled:pointer-events-none',
    'disabled:opacity-50',
    'focus-visible:outline-none',
    'focus-visible:ring-1',
    'focus-visible:ring-ring',
    'font-medium',
    'gap-2',
    'inline-flex',
    'items-center',
    'justify-center',
    'rounded-sm',
    'text-sm',
    'transform',
    'transition',
    'transition-colors',
    'whitespace-nowrap',
    '[&_svg]:pointer-events-none',
    '[&_svg]:shrink-0',
    '[&_svg]:size-4',
  ],
  {
    variants: {
      variant: {
        primary: 'border border-primary bg-primary text-primary-foreground shadow-sm hover:bg-primary/90',
        secondary: 'border border-secondary bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/90',
        success: 'border border-success bg-success text-success-foreground shadow-sm hover:bg-success/90',
        warning: 'border border-warning bg-warning text-warning-foreground shadow-sm hover:bg-warning/90',
        danger: 'border border-danger bg-danger text-danger-foreground shadow-sm hover:bg-danger/90',
        info: 'border border-info bg-info text-info-foreground shadow-sm hover:bg-info/90',
        light: 'border border-light bg-light text-light-foreground shadow-sm hover:bg-light/90',
        dark: 'border border-dark bg-dark text-dark-foreground shadow-sm hover:bg-dark/90',
        accent: 'border border-accent bg-accent text-accent-foreground shadow-sm hover:bg-accent/90',
        destructive:
          'border border-destructive bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90',
        muted: 'border border-muted bg-muted text-muted-foreground shadow-sm hover:bg-muted/90',
        link: 'text-primary underline-offset-4 hover:underline',
        ghost: 'hover:bg-light hover:text-light-foreground',
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-8 rounded-sm px-3 text-xs',
        lg: 'h-10 rounded-sm px-8',
        icon: 'h-9 w-9',
      },
      outline: { false: null, true: '' },
      outlineFilled: { false: null, true: '' },
      loading: { false: null, true: '' },
      compact: { false: null, true: '' },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'default',
      outline: false,
      outlineFilled: false,
      loading: false,
      compact: false,
    },
  },
);

export type ButtonVariants = VariantProps<typeof buttonVariants>;

@Component({
  selector: 'button[egBtn], a[egBtn]',
  standalone: true,
  imports: [BrnButton, EgSpinner, NgTemplateOutlet],
  hostDirectives: [{ directive: BrnButton, inputs: ['disabled'] }],
  host: {
    '[class]': '_computedClass()',
  },
  template: `
    <ng-template #projected>
      <ng-content></ng-content>
    </ng-template>

    @if (loading) {
      <div class="relative inline-flex items-center">
        <span class="invisible">
          <ng-container *ngTemplateOutlet="projected" />
        </span>
        <span class="absolute inset-0 flex items-center justify-center">
          <eg-spinner size="small" [spinnerClass]="spinnerClass()" />
        </span>
      </div>
    } @else {
      <div class="flex items-center gap-1">
        @if (left) {
          <ng-container *ngTemplateOutlet="left" />
        }
        <ng-container *ngTemplateOutlet="projected" />
      </div>
    }
  `,
})
export class EgButton {
  /** Props */
  @Input() variant: ButtonVariants['variant'] = 'primary';
  @Input() size: ButtonVariants['size'] = 'default';
  @Input() outline = false;
  @Input() outlineFilled = false;
  @Input() loading = false;
  @Input() compact = false;
  @Input() left?: any;
  @Input() userClass: ClassValue = '';
  @Input() spinnerUserClass: ClassValue = ''; // NEW: matches React spinner `className`

  private readonly _additionalClasses = signal<ClassValue>('');

  /** Computed button class merging */
  protected readonly _computedClass = computed(() => {
    const outlineClasses =
      this.outline || this.outlineFilled ? ['bg-white border', this.getOutlineClasses(this.variant)] : [];

    if (this.outlineFilled) {
      outlineClasses.push(this.getOutlineFilledClasses(this.variant));
    }

    const compactClasses = this.compact ? this.getCompactClasses(this.size) : '';

    return hlm(
      buttonVariants({
        variant: this.variant,
        size: this.size,
        outline: this.outline,
        outlineFilled: this.outlineFilled,
        loading: this.loading,
        compact: this.compact,
        className: this.userClass,
      }),
      outlineClasses,
      compactClasses,
      this.loading ? 'pointer-events-none' : '',
      this._additionalClasses(),
    );
  });

  /** Computed spinner classes (matches React logic) */
  protected readonly spinnerClass = computed(() => {
    const base =
      this.outline || this.outlineFilled
        ? this.getOutlineSpinnerClasses(this.variant)
        : this.getSpinnerClasses(this.variant);

    return hlm(
      base,
      this.spinnerUserClass, // allow passing in extra spinner styles
    );
  });

  setClass(classes: string): void {
    this._additionalClasses.set(classes);
  }

  /** Helper functions */
  private getOutlineClasses(variant: any) {
    const colors: Record<string, string> = {
      primary: 'border-primary text-primary shadow-sm hover:bg-primary/10',
      secondary: 'border-secondary text-secondary shadow-sm hover:bg-secondary/10',
      success: 'border-success text-success shadow-sm hover:bg-success/10',
      warning: 'border-warning text-warning shadow-sm hover:bg-warning/10',
      danger: 'border-danger text-danger shadow-sm hover:bg-danger/10',
      info: 'border-info text-info shadow-sm hover:bg-info/10',
      light: 'border-light text-light-foreground shadow-sm hover:bg-light/10',
      dark: 'border-dark text-dark shadow-sm hover:bg-dark/10',
      accent: 'border-accent text-accent shadow-sm hover:bg-accent/10',
      destructive: 'border-destructive text-destructive-foreground shadow-sm hover:bg-destructive/10',
      muted: 'border-muted text-muted-foreground shadow-sm hover:bg-muted/10',
    };
    return colors[variant ?? 'primary'];
  }

  private getOutlineFilledClasses(variant: any) {
    const colors: Record<string, string> = {
      primary: 'hover:bg-primary hover:text-primary-foreground',
      secondary: 'hover:bg-secondary hover:text-secondary-foreground',
      success: 'hover:bg-success hover:text-success-foreground',
      warning: 'hover:bg-warning hover:text-warning-foreground',
      danger: 'hover:bg-danger hover:text-danger-foreground',
      info: 'hover:bg-info hover:text-info-foreground',
      light: 'hover:bg-light hover:text-light-foreground',
      dark: 'hover:bg-dark hover:text-dark-foreground',
      accent: 'hover:bg-accent hover:text-accent-foreground',
      destructive: 'hover:bg-destructive hover:text-destructive-foreground',
      muted: 'hover:bg-muted hover:text-muted-foreground',
    };
    return colors[variant ?? 'primary'];
  }

  private getCompactClasses(size: any) {
    const sizes: Record<string, string> = {
      default: 'h-8 px-2 py-1',
      sm: 'h-7 px-2 py-1',
      lg: 'h-9 px-2 py-1',
      icon: 'h-8 w-8',
    };
    return sizes[size ?? 'default'];
  }

  private getSpinnerClasses(variant: any) {
    const colors: Record<string, string> = {
      primary: '[&>svg]:text-primary-foreground',
      secondary: '[&>svg]:text-secondary-foreground',
      success: '[&>svg]:text-success-foreground',
      warning: '[&>svg]:text-warning-foreground',
      danger: '[&>svg]:text-danger-foreground',
      info: '[&>svg]:text-info-foreground',
      light: '[&>svg]:text-light-foreground',
      dark: '[&>svg]:text-dark-foreground',
      accent: '[&>svg]:text-accent-foreground',
      destructive: '[&>svg]:text-destructive-foreground',
      muted: '[&>svg]:text-muted-foreground',
      link: '[&>svg]:text-primary',
    };
    return colors[variant ?? 'primary'];
  }

  private getOutlineSpinnerClasses(variant: any) {
    const colors: Record<string, string> = {
      primary: '[&>svg]:text-primary',
      secondary: '[&>svg]:text-secondary',
      success: '[&>svg]:text-success',
      warning: '[&>svg]:text-warning',
      danger: '[&>svg]:text-danger',
      info: '[&>svg]:text-info',
      light: '[&>svg]:text-light',
      dark: '[&>svg]:text-dark',
      accent: '[&>svg]:text-accent',
      destructive: '[&>svg]:text-destructive',
      muted: '[&>svg]:text-muted-foreground',
      link: '[&>svg]:text-primary',
    };
    return colors[variant ?? 'primary'];
  }
}
