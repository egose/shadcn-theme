import { Component, Input, computed, signal } from '@angular/core';
import { cva, type VariantProps } from 'class-variance-authority';
import { type ClassValue } from 'clsx';
import { cn } from '@egose/shadcn-theme-ng/utils';

/* Tailwind + CVA variant config */
export const badgeVariants = cva(
  [
    'tw:inline-flex',
    'tw:items-center',
    'tw:rounded-sm',
    'tw:font-medium',
    'tw:whitespace-nowrap',
    'tw:transition-colors',
    'tw:focus-visible:outline-none',
    'tw:focus-visible:ring-1',
    'tw:focus-visible:ring-ring',
  ],
  {
    variants: {
      variant: {
        primary: 'tw:bg-primary tw:text-primary-foreground tw:hover:bg-primary/90',
        secondary: 'tw:bg-secondary tw:text-secondary-foreground tw:hover:bg-secondary/90',
        success: 'tw:bg-success tw:text-success-foreground tw:hover:bg-success/90',
        warning: 'tw:bg-warning tw:text-warning-foreground tw:hover:bg-warning/90',
        danger: 'tw:bg-danger tw:text-danger-foreground tw:hover:bg-danger/90',
        info: 'tw:bg-info tw:text-info-foreground tw:hover:bg-info/90',
        light: 'tw:bg-light tw:text-light-foreground tw:hover:bg-light/90',
        dark: 'tw:bg-dark tw:text-dark-foreground tw:hover:bg-dark/90',
        accent: 'tw:bg-accent tw:text-accent-foreground tw:hover:bg-accent/90',
        destructive: 'tw:bg-destructive tw:text-destructive-foreground tw:hover:bg-destructive/90',
        muted: 'tw:bg-muted tw:text-muted-foreground tw:hover:bg-muted/90',
        link: 'tw:text-primary tw:underline-offset-4 tw:hover:underline',
        ghost: 'tw:hover:bg-light tw:hover:text-light-foreground',
      },
      size: {
        sm: 'tw:h-5 tw:px-2 tw:text-xs',
        default: 'tw:h-6 tw:px-3 tw:text-sm',
        lg: 'tw:h-7 tw:px-4 tw:text-base',
      },
      appearance: {
        solid: '',
        outline: 'tw:bg-white tw:border',
        'outline-filled': 'tw:bg-white tw:border',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'default',
      appearance: 'solid',
    },
  },
);

export type BadgeVariants = VariantProps<typeof badgeVariants>;
export type BadgeVariantType = NonNullable<BadgeVariants['variant']>;
export type BadgeSizeType = NonNullable<BadgeVariants['size']>;
export type BadgeAppearanceType = NonNullable<BadgeVariants['appearance']>;

@Component({
  selector: 'span[egBadge], a[egBadge]',
  standalone: true,
  imports: [],
  host: {
    '[class]': '_computedClass()',
  },
  template: ` <ng-content></ng-content> `,
})
export class EgBadge {
  /** Props */
  @Input() variant: BadgeVariantType = 'primary';
  @Input() size: BadgeSizeType = 'default';
  @Input() appearance: BadgeAppearanceType = 'solid';
  @Input() userClass: ClassValue = '';

  private readonly _additionalClasses = signal<ClassValue>('');

  /** Computed badge class merging */
  protected readonly _computedClass = computed(() => {
    const outlineClasses =
      this.appearance === 'outline' || this.appearance === 'outline-filled'
        ? [this.getOutlineClasses(this.variant)]
        : [];
    if (this.appearance === 'outline-filled') {
      outlineClasses.push(this.getOutlineFilledClasses(this.variant));
    }
    return cn(
      badgeVariants({
        variant: this.variant,
        size: this.size,
        appearance: this.appearance,
        className: this.userClass,
      }),
      outlineClasses,
      this._additionalClasses(),
    );
  });

  setClass(classes: string): void {
    this._additionalClasses.set(classes);
  }

  /** Helper functions */
  private getOutlineClasses(variant: BadgeVariantType) {
    const colors: Record<BadgeVariantType, string> = {
      primary: 'tw:border-primary tw:text-primary tw:hover:bg-primary/10',
      secondary: 'tw:border-secondary tw:text-secondary tw:hover:bg-secondary/10',
      success: 'tw:border-success tw:text-success tw:hover:bg-success/10',
      warning: 'tw:border-warning tw:text-warning tw:hover:bg-warning/10',
      danger: 'tw:border-danger tw:text-danger tw:hover:bg-danger/10',
      info: 'tw:border-info tw:text-info tw:hover:bg-info/10',
      light: 'tw:border-light tw:text-light-foreground tw:hover:bg-light/10',
      dark: 'tw:border-dark tw:text-dark tw:hover:bg-dark/10',
      accent: 'tw:border-accent tw:text-accent tw:hover:bg-accent/10',
      destructive: 'tw:border-destructive tw:text-destructive tw:hover:bg-destructive/10',
      muted: 'tw:border-muted tw:text-muted-foreground tw:hover:bg-muted/10',
      link: 'tw:text-primary',
      ghost: 'tw:text-light-foreground',
    };
    return colors[variant];
  }

  private getOutlineFilledClasses(variant: BadgeVariantType) {
    const colors: Record<BadgeVariantType, string> = {
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
}
