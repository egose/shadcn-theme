import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const alertVariants = cva(
  'relative w-full items-start gap-y-0.5 rounded-lg border px-4 py-3 text-sm ' +
    '[&>svg+div]:translate-y-[-3px] ' +
    '[&>svg]:absolute [&>svg]:left-4 [&>svg]:top-2 [&>svg]:text-current ' +
    '[&>svg~*]:pl-7',
  {
    variants: {
      variant: {
        primary: 'bg-primary text-primary-foreground [&_[data-alert-description]]:text-primary-foreground/90',
        secondary: 'bg-secondary text-secondary-foreground [&_[data-alert-description]]:text-secondary-foreground/90',
        success: 'bg-success text-success-foreground [&_[data-alert-description]]:text-success-foreground/90',
        warning: 'bg-warning text-warning-foreground [&_[data-alert-description]]:text-warning-foreground/90',
        danger: 'bg-danger text-danger-foreground [&_[data-alert-description]]:text-danger-foreground/90',
        info: 'bg-info text-info-foreground [&_[data-alert-description]]:text-info-foreground/90',
        light: 'bg-light text-light-foreground [&_[data-alert-description]]:text-light-foreground/90',
        dark: 'bg-dark text-dark-foreground [&_[data-alert-description]]:text-dark-foreground/90',
        accent: 'bg-accent text-accent-foreground [&_[data-alert-description]]:text-accent-foreground/90',
        destructive:
          'bg-destructive text-destructive-foreground [&_[data-alert-description]]:text-destructive-foreground/90',
        muted: 'bg-muted text-muted-foreground [&_[data-alert-description]]:text-muted-foreground/90',
        link: 'text-primary underline-offset-4 [&_[data-alert-description]]:text-primary/90',
        ghost: '[&_[data-alert-description]]:text-muted-foreground',
      },
      appearance: {
        solid: '',
        light: 'font-semibold',
      },
    },
    compoundVariants: [
      {
        variant: 'primary',
        appearance: 'light',
        class: 'bg-primary/20 text-primary [&_[data-alert-description]]:text-primary',
      },
      {
        variant: 'secondary',
        appearance: 'light',
        class: 'bg-secondary/20 text-secondary [&_[data-alert-description]]:text-secondary',
      },
      {
        variant: 'success',
        appearance: 'light',
        class: 'bg-success/20 text-success [&_[data-alert-description]]:text-success',
      },
      {
        variant: 'warning',
        appearance: 'light',
        class: 'bg-warning/20 text-warning [&_[data-alert-description]]:text-warning',
      },
      {
        variant: 'danger',
        appearance: 'light',
        class: 'bg-danger/20 text-danger [&_[data-alert-description]]:text-danger',
      },
      { variant: 'info', appearance: 'light', class: 'bg-info/20 text-info [&_[data-alert-description]]:text-info' },
      {
        variant: 'light',
        appearance: 'light',
        class: 'bg-light/20 text-light [&_[data-alert-description]]:text-light',
      },
      { variant: 'dark', appearance: 'light', class: 'bg-dark/20 text-dark [&_[data-alert-description]]:text-dark' },
      {
        variant: 'accent',
        appearance: 'light',
        class: 'bg-accent/20 text-accent [&_[data-alert-description]]:text-accent',
      },
      {
        variant: 'destructive',
        appearance: 'light',
        class: 'bg-destructive/20 text-destructive [&_[data-alert-description]]:text-destructive',
      },
      {
        variant: 'muted',
        appearance: 'light',
        class: 'bg-muted/20 text-muted [&_[data-alert-description]]:text-muted',
      },
      {
        variant: 'link',
        appearance: 'light',
        class: 'bg-primary/10 text-primary [&_[data-alert-description]]:text-primary',
      },
      {
        variant: 'ghost',
        appearance: 'light',
        class: 'bg-muted/10 text-muted-foreground [&_[data-alert-description]]:text-muted-foreground',
      },
    ],
    defaultVariants: {
      variant: 'primary',
      appearance: 'solid',
    },
  },
);

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof alertVariants> {}
export type VariantType = NonNullable<VariantProps<typeof alertVariants>['variant']>;

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(({ className, variant, appearance, ...props }, ref) => (
  <div ref={ref} role="alert" className={cn(alertVariants({ variant, appearance }), className)} {...props} />
));
Alert.displayName = 'Alert';

const AlertTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h5 ref={ref} className={cn('mb-1 font-semibold leading-none tracking-tight', className)} {...props} />
  ),
);
AlertTitle.displayName = 'AlertTitle';

const AlertDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-alert-description
      className={cn('font-medium text-sm [&_p]:leading-relaxed', className)}
      {...props}
    />
  ),
);
AlertDescription.displayName = 'AlertDescription';

export { Alert, AlertTitle, AlertDescription };
