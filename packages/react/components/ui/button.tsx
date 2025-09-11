import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';
import { Spinner } from './spinner';

const buttonVariants = cva(
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
        'compact-default': 'h-8 px-2 py-1',
        'compact-sm': 'h-7 px-2 py-1',
        'compact-lg': 'h-9 px-2 py-1',
        'compact-icon': 'h-8 w-8',
      },
      appearance: {
        solid: '',
        outline: 'bg-white border',
        outlineFilled: 'bg-white border',
      },
      loading: {
        true: 'pointer-events-none',
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

// Type safety for variant and size
export type VariantType = NonNullable<VariantProps<typeof buttonVariants>['variant']>;
export type SizeType = NonNullable<VariantProps<typeof buttonVariants>['size']>;
export type VariantStyleType = NonNullable<VariantProps<typeof buttonVariants>['appearance']>;

export interface ButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'size'>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

function getOutlineClasses(variant: VariantType) {
  const colors: Record<VariantType, string> = {
    primary: 'border-primary text-primary shadow-sm hover:bg-primary/10',
    secondary: 'border-secondary text-secondary shadow-sm hover:bg-secondary/10',
    success: 'border-success text-success shadow-sm hover:bg-success/10',
    warning: 'border-warning text-warning shadow-sm hover:bg-warning/10',
    danger: 'border-danger text-danger shadow-sm hover:bg-danger/10',
    info: 'border-info text-info shadow-sm hover:bg-info/10',
    light: 'border-light text-light-foreground shadow-sm hover:bg-light/10',
    dark: 'border-dark text-dark shadow-sm hover:bg-dark/10',
    accent: 'border-accent text-accent shadow-sm hover:bg-accent/10',
    destructive: 'border-destructive text-destructive shadow-sm hover:bg-destructive/10',
    muted: 'border-muted text-muted-foreground shadow-sm hover:bg-muted/10',
    link: 'text-primary',
    ghost: 'text-light-foreground',
  };
  return colors[variant];
}

function getOutlineFilledClasses(variant: VariantType) {
  const colors: Record<VariantType, string> = {
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

function getSpinnerClasses(variant: VariantType) {
  const colors: Record<VariantType, string> = {
    primary: 'bg-primary text-primary-foreground',
    secondary: 'bg-secondary text-secondary-foreground',
    success: 'bg-success text-success-foreground',
    warning: 'bg-warning text-warning-foreground',
    danger: 'bg-danger text-danger-foreground',
    info: 'bg-info text-info-foreground',
    light: 'bg-light text-light-foreground',
    dark: 'bg-dark text-dark-foreground',
    accent: 'bg-accent text-accent-foreground',
    destructive: 'bg-destructive text-destructive-foreground',
    muted: 'bg-muted text-muted-foreground',
    link: 'text-primary',
    ghost: 'text-light-foreground',
  };
  return colors[variant];
}

function getOutlineSpinnerClasses(variant: VariantType) {
  const colors: Record<VariantType, string> = {
    primary: 'text-primary',
    secondary: 'text-secondary',
    success: 'text-success',
    warning: 'text-warning',
    danger: 'text-danger',
    info: 'text-info',
    light: 'text-light',
    dark: 'text-dark',
    accent: 'text-accent',
    destructive: 'text-destructive',
    muted: 'text-muted-foreground',
    link: 'text-primary',
    ghost: 'text-light-foreground',
  };
  return colors[variant];
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant, size, appearance, loading, icon, iconPosition = 'left', asChild = false, children, ...props },
    ref,
  ) => {
    const Comp = asChild ? Slot : 'button';

    const outlineClasses =
      appearance === 'outline' || appearance === 'outlineFilled' ? [getOutlineClasses(variant as VariantType)] : [];

    if (appearance === 'outlineFilled') {
      outlineClasses.push(getOutlineFilledClasses(variant as VariantType));
    }

    const spinnerClasses =
      appearance === 'outline' || appearance === 'outlineFilled'
        ? getOutlineSpinnerClasses(variant as VariantType)
        : getSpinnerClasses(variant as VariantType);

    return (
      <Comp
        type="button"
        className={cn(buttonVariants({ variant, size, appearance, loading, className }), outlineClasses)}
        ref={ref}
        aria-busy={loading || undefined}
        disabled={loading || props.disabled}
        {...props}
      >
        {loading ? (
          <div className="relative inline-flex items-center justify-center w-full">
            <span className="invisible">{children}</span>
            <span className="absolute inset-0 flex items-center justify-center">
              <Spinner className={cn(spinnerClasses, 'animate-spin')} />
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-1">
            {icon && iconPosition === 'left' && <span className="flex-shrink-0">{icon}</span>}
            {children}
            {icon && iconPosition === 'right' && <span className="flex-shrink-0">{icon}</span>}
          </div>
        )}
      </Comp>
    );
  },
);

Button.displayName = 'Button';

export { Button, buttonVariants };
