import { Directive, computed, input } from '@angular/core';
import { cn } from '@egose/shadcn-theme-ng/utils';
import { type VariantProps, cva } from 'class-variance-authority';
import type { ClassValue } from 'clsx';

const alertVariants = cva(
  'tw:relative tw:w-full tw:items-start tw:gap-y-0.5 tw:rounded-lg tw:border tw:px-4 tw:py-3 tw:text-sm tw:has-[>[egAlertIcon]]:grid tw:has-[>[egAlertIcon]]:grid-cols-[calc(theme(spacing.1)*4)_1fr] tw:has-[>[egAlertIcon]]:gap-x-3 tw:[&>[egAlertIcon]]:size-4 tw:[&>[egAlertIcon]]:translate-y-0.5 tw:[&>[egAlertIcon]]:text-current',
  {
    variants: {
      variant: {
        primary:
          'tw:bg-primary tw:text-primary-foreground tw:[&>[egAlertDescription]]:text-primary-foreground/90 tw:[&>[egAlertDesc]]:text-primary-foreground/90',
        secondary:
          'tw:bg-secondary tw:text-secondary-foreground tw:[&>[egAlertDescription]]:text-secondary-foreground/90 tw:[&>[egAlertDesc]]:text-secondary-foreground/90',
        success:
          'tw:bg-success tw:text-success-foreground tw:[&>[egAlertDescription]]:text-success-foreground/90 tw:[&>[egAlertDesc]]:text-success-foreground/90',
        warning:
          'tw:bg-warning tw:text-warning-foreground tw:[&>[egAlertDescription]]:text-warning-foreground/90 tw:[&>[egAlertDesc]]:text-warning-foreground/90',
        danger:
          'tw:bg-danger tw:text-danger-foreground tw:[&>[egAlertDescription]]:text-danger-foreground/90 tw:[&>[egAlertDesc]]:text-danger-foreground/90',
        info: 'tw:bg-info tw:text-info-foreground tw:[&>[egAlertDescription]]:text-info-foreground/90 tw:[&>[egAlertDesc]]:text-info-foreground/90',
        light:
          'tw:bg-light tw:text-light-foreground tw:[&>[egAlertDescription]]:text-light-foreground/90 tw:[&>[egAlertDesc]]:text-light-foreground/90',
        dark: 'tw:bg-dark tw:text-dark-foreground tw:[&>[egAlertDescription]]:text-dark-foreground/90 tw:[&>[egAlertDesc]]:text-dark-foreground/90',
        accent:
          'tw:bg-accent tw:text-accent-foreground tw:[&>[egAlertDescription]]:text-accent-foreground/90 tw:[&>[egAlertDesc]]:text-accent-foreground/90',
        destructive:
          'tw:bg-destructive tw:text-destructive-foreground tw:[&>[egAlertDescription]]:text-destructive-foreground/90 tw:[&>[egAlertDesc]]:text-destructive-foreground/90',
        muted:
          'tw:bg-muted tw:text-muted-foreground tw:[&>[egAlertDescription]]:text-muted-foreground/90 tw:[&>[egAlertDesc]]:text-muted-foreground/90',
        link: 'tw:text-primary tw:underline-offset-4 tw:[&>[egAlertDescription]]:text-primary/90 tw:[&>[egAlertDesc]]:text-primary/90',
        ghost: 'tw:[&>[egAlertDescription]]:text-muted-foreground tw:[&>[egAlertDesc]]:text-muted-foreground',
      },
    },
    defaultVariants: {
      variant: 'primary',
    },
  },
);

export type AlertVariants = VariantProps<typeof alertVariants>;
export type VariantType = NonNullable<AlertVariants['variant']>;

@Directive({
  selector: '[egAlert]',
  host: {
    role: 'alert',
    '[class]': '_computedClass()',
  },
})
export class EgAlert {
  public readonly userClass = input<ClassValue>('', { alias: 'class' });
  protected readonly _computedClass = computed(() => cn(alertVariants({ variant: this.variant() }), this.userClass()));

  public readonly variant = input<AlertVariants['variant']>('primary');
}
