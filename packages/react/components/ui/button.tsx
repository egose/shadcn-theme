import * as React from 'react';
import { Slot } from 'radix-ui';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/ui';
import { Spinner } from './spinner';

// Complete utility names keep every tone discoverable by consumer Tailwind builds.
const toneTextClasses = {
  primary: 'text-primary',
  secondary: 'text-secondary-foreground',
  action: 'text-action',
  success: 'text-success',
  warning: 'text-warning',
  danger: 'text-danger',
  info: 'text-info',
  light: 'text-foreground',
  dark: 'text-dark',
  accent: 'text-accent',
  destructive: 'text-destructive',
  muted: 'text-muted-foreground',
  link: 'text-primary',
  ghost: 'text-light-foreground',
};

type ToneVariant = keyof typeof toneTextClasses;

const outlineClasses: Record<ToneVariant, string> = {
  primary: 'border-primary hover:bg-primary/10',
  secondary: 'border-border hover:bg-secondary/10',
  action: 'border-action hover:bg-action/10',
  success: 'border-success hover:bg-success/10',
  warning: 'border-warning hover:bg-warning/10',
  danger: 'border-danger hover:bg-danger/10',
  info: 'border-info hover:bg-info/10',
  light: 'border-border hover:bg-muted',
  dark: 'border-dark hover:bg-dark/10',
  accent: 'border-accent hover:bg-accent/10',
  destructive: 'border-destructive hover:bg-destructive/10',
  muted: 'border-muted hover:bg-muted/10',
  link: '',
  ghost: '',
};

const outlineFilledClasses: Record<ToneVariant, string> = {
  primary: 'hover:bg-primary hover:text-primary-foreground',
  secondary: 'hover:bg-secondary hover:text-secondary-foreground',
  action: 'hover:bg-action hover:text-action-foreground',
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

/**
 * `class-variance-authority` variant resolver backing {@link Button}. Exported
 * so consumers can compose the same color and appearance styles elsewhere.
 * Merge the result and consumer overrides with cn() to resolve utility conflicts.
 *
 * @example
 * buttonVariants({ variant: 'primary', size: 'default', appearance: 'solid' })
 */
const buttonVariants = cva(
  [
    "[&_svg:not([class*='size-'])]:size-4",
    '[&_svg]:pointer-events-none',
    '[&_svg]:shrink-0',
    'active:translate-y-[0.5px]',
    'aria-invalid:border-destructive',
    'aria-invalid:ring-3',
    'aria-invalid:ring-destructive/20',
    'bg-clip-padding',
    'border-transparent',
    'cursor-pointer',
    'dark:aria-invalid:border-destructive/50',
    'dark:aria-invalid:ring-destructive/40',
    'disabled:pointer-events-none',
    'disabled:opacity-50',
    'focus-visible:border-ring',
    'focus-visible:outline-none',
    'focus-visible:ring-3',
    'focus-visible:ring-ring/50',
    'font-medium',
    'gap-2',
    'group/button',
    'inline-flex',
    'items-center',
    'justify-center',
    'outline-none',
    'rounded-sm',
    'select-none',
    'shrink-0',
    'text-sm',
    'transform',
    'transition-all',
    'whitespace-nowrap',
  ],
  {
    variants: {
      variant: {
        primary: 'border border-primary bg-primary text-primary-foreground shadow-sm hover:bg-primary/80',
        secondary: 'border border-secondary bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80',
        action: 'border border-action bg-action text-action-foreground shadow-sm hover:bg-action/80',
        success: 'border border-success bg-success text-success-foreground shadow-sm hover:bg-success/80',
        warning: 'border border-warning bg-warning text-warning-foreground shadow-sm hover:bg-warning/80',
        danger: 'border border-danger bg-danger text-danger-foreground shadow-sm hover:bg-danger/80',
        info: 'border border-info bg-info text-info-foreground shadow-sm hover:bg-info/80',
        light: 'border border-light bg-light text-light-foreground shadow-sm hover:bg-light/80',
        dark: 'border border-dark bg-dark text-dark-foreground shadow-sm hover:bg-dark/80',
        accent: 'border border-accent bg-accent text-accent-foreground shadow-sm hover:bg-accent/80',
        destructive:
          'border border-destructive bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/80',
        muted: 'border border-muted bg-muted text-muted-foreground shadow-sm hover:bg-muted/80',
        link: 'text-primary underline-offset-4 hover:underline',
        ghost: 'hover:bg-light hover:text-light-foreground',
      },
      size: {
        xs: 'h-7 rounded-xs px-2 text-xs',
        sm: 'h-8 rounded-sm px-3',
        default: 'h-9 px-4 py-2',
        lg: 'h-10 rounded-sm px-7 text-base',
        icon: 'size-8',
        'icon-xs':
          "size-6 rounded-[min(var(--radius-md),10px)] in-data-[slot=button-group]:rounded-lg [&_svg:not([class*='size-'])]:size-3",
        'icon-sm': 'size-7 rounded-[min(var(--radius-md),12px)] in-data-[slot=button-group]:rounded-lg',
        'icon-lg': 'size-9',
        'compact-xs': 'h-6 px-2 py-1 text-xs',
        'compact-sm': 'h-7 px-2 py-1',
        'compact-default': 'h-8 px-2 py-1',
        'compact-lg': 'h-9 px-2 py-1 text-base',
        'compact-icon': 'h-8 w-8',
      },
      appearance: {
        solid: '',
        outline: 'bg-background border shadow-sm',
        'outline-filled': 'bg-background border shadow-sm',
        ghost: 'bg-transparent border-0 shadow-none',
        link: 'bg-transparent border-0 shadow-none hover:bg-transparent underline-offset-4 hover:underline',
      },
      loading: {
        true: 'pointer-events-none',
        false: null,
      },
    },
    compoundVariants: (Object.keys(toneTextClasses) as ToneVariant[]).flatMap((variant) => [
      {
        variant,
        appearance: ['outline', 'outline-filled', 'ghost', 'link'] as Array<
          'outline' | 'outline-filled' | 'ghost' | 'link'
        >,
        class: toneTextClasses[variant],
      },
      {
        variant,
        appearance: ['outline', 'outline-filled', 'ghost'] as Array<'outline' | 'outline-filled' | 'ghost'>,
        class: outlineClasses[variant],
      },
      {
        variant,
        appearance: 'outline-filled' as const,
        class: outlineFilledClasses[variant],
      },
    ]),
    defaultVariants: {
      variant: 'primary',
      size: 'default',
      appearance: 'solid',
      loading: false,
    },
  },
);

// Type safety for variant and size
/** Color variant for {@link Button}. One of the theme color names (primary, secondary, action, success, warning, danger, info, light, dark, accent, destructive, muted, link, ghost). */
export type VariantType = NonNullable<VariantProps<typeof buttonVariants>['variant']>;
/** Size slot for {@link Button} (`xs`, `sm`, `default`, `lg`). */
export type SizeType = NonNullable<VariantProps<typeof buttonVariants>['size']>;
/** Visual treatment independent of color (`solid`, `outline`, `outline-filled`, `ghost`, `link`). */
export type VariantStyleType = NonNullable<VariantProps<typeof buttonVariants>['appearance']>;

/**
 * Props for the {@link Button} component. Pick `variant`, `size`, and
 * `appearance` to control the visual style, and pass `loading` to swap the
 * label for a spinner that inherits the button's text color. Consumer className
 * overrides are merged after all appearance styles. Legacy link and ghost
 * variants remain supported. `asChild` (from Radix `Slot`) forwards props onto the
 * immediate child instead of rendering a `<button>`.
 */
export interface ButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'size'>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

/**
 * Themed button built on top of Tailwind class variants.
 *
 * @example
 * <Button variant="primary" size="default">Save</Button>
 * <Button variant="danger" appearance="outline" loading>Deleting…</Button>
 */
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'default',
      appearance = 'solid',
      loading,
      icon,
      iconPosition = 'left',
      asChild = false,
      children,
      ...props
    },
    ref, // This ref is now valid because of forwardRef!
  ) => {
    const Comp = asChild ? Slot.Root : 'button';

    return (
      <Comp
        type="button"
        data-variant={variant}
        data-size={size}
        data-appearance={appearance}
        className={cn(buttonVariants({ variant, size, appearance, loading }), className)}
        ref={ref}
        aria-busy={loading || undefined}
        disabled={loading || props.disabled}
        {...props}
      >
        {loading ? (
          <div className="relative inline-flex items-center justify-center w-full">
            <span className="invisible">{children}</span>
            <span className="absolute inset-0 flex items-center justify-center">
              <Spinner size="small" className="size-4 text-current" />
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

export { Button, buttonVariants };
