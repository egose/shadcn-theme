import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

export const badgeVariants = cva(
  [
    'inline-flex',
    'items-center',
    'rounded-sm',
    'font-medium',
    'whitespace-nowrap',
    'transition-colors',
    'focus-visible:outline-none',
    'focus-visible:ring-1',
    'focus-visible:ring-ring',
  ],
  {
    variants: {
      variant: {
        primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/90',
        success: 'bg-success text-success-foreground hover:bg-success/90',
        warning: 'bg-warning text-warning-foreground hover:bg-warning/90',
        danger: 'bg-danger text-danger-foreground hover:bg-danger/90',
        info: 'bg-info text-info-foreground hover:bg-info/90',
        light: 'bg-light text-light-foreground hover:bg-light/90',
        dark: 'bg-dark text-dark-foreground hover:bg-dark/90',
        accent: 'bg-accent text-accent-foreground hover:bg-accent/90',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        muted: 'bg-muted text-muted-foreground hover:bg-muted/90',
        link: 'text-primary underline-offset-4 hover:underline',
        ghost: 'hover:bg-light hover:text-light-foreground',
      },
      size: {
        sm: 'h-5 px-2 text-xs',
        default: 'h-6 px-3 text-sm',
        lg: 'h-7 px-4 text-base',
      },
      appearance: {
        solid: '',
        outline: 'bg-white border',
        outlineFilled: 'bg-white border',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'default',
      appearance: 'solid',
    },
  },
);

export type BadgeVariant = NonNullable<VariantProps<typeof badgeVariants>['variant']>;
export type BadgeSize = NonNullable<VariantProps<typeof badgeVariants>['size']>;
export type BadgeAppearance = NonNullable<VariantProps<typeof badgeVariants>['appearance']>;

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {
  asChild?: boolean;
}

function getOutlineClasses(variant: BadgeVariant) {
  const colors: Record<BadgeVariant, string> = {
    primary: 'border-primary text-primary hover:bg-primary/10',
    secondary: 'border-secondary text-secondary hover:bg-secondary/10',
    success: 'border-success text-success hover:bg-success/10',
    warning: 'border-warning text-warning hover:bg-warning/10',
    danger: 'border-danger text-danger hover:bg-danger/10',
    info: 'border-info text-info hover:bg-info/10',
    light: 'border-light text-light-foreground hover:bg-light/10',
    dark: 'border-dark text-dark hover:bg-dark/10',
    accent: 'border-accent text-accent hover:bg-accent/10',
    destructive: 'border-destructive text-destructive hover:bg-destructive/10',
    muted: 'border-muted text-muted-foreground hover:bg-muted/10',
    link: 'text-primary',
    ghost: 'text-light-foreground',
  };
  return colors[variant];
}

function getOutlineFilledClasses(variant: BadgeVariant) {
  const colors: Record<BadgeVariant, string> = {
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
    link: 'hover:underline',
    ghost: 'hover:bg-light',
  };
  return colors[variant];
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant, size, appearance, asChild = false, children, ...props }, ref) => {
    const Comp = asChild ? Slot : 'span';

    const outlineClasses =
      appearance === 'outline' || appearance === 'outlineFilled' ? [getOutlineClasses(variant as BadgeVariant)] : [];
    if (appearance === 'outlineFilled') {
      outlineClasses.push(getOutlineFilledClasses(variant as BadgeVariant));
    }

    return (
      <Comp
        ref={ref}
        className={cn(badgeVariants({ variant, size, appearance, className }), outlineClasses)}
        {...props}
      >
        {children}
      </Comp>
    );
  },
);

Badge.displayName = 'Badge';

export { Badge };
