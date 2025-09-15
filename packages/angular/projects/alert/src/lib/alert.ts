import { Directive, computed, input } from '@angular/core';
import { hlm } from '@egose/shadcn-theme-ng/utils';
import { type VariantProps, cva } from 'class-variance-authority';
import type { ClassValue } from 'clsx';

const alertVariants = cva(
  'tw:relative tw:w-full tw:items-start tw:gap-y-0.5 tw:rounded-lg tw:border tw:px-4 tw:py-3 tw:text-sm tw:has-[>[hlmAlertIcon]]:grid tw:has-[>[hlmAlertIcon]]:grid-cols-[calc(theme(spacing.1)*4)_1fr] tw:has-[>[hlmAlertIcon]]:gap-x-3 tw:[&>[hlmAlertIcon]]:size-4 tw:[&>[hlmAlertIcon]]:translate-y-0.5 tw:[&>[hlmAlertIcon]]:text-current',
  {
    variants: {
      variant: {
        primary:
          'tw:bg-primary tw:text-primary-foreground tw:[&>[hlmAlertDescription]]:text-primary-foreground/90 tw:[&>[hlmAlertDesc]]:text-primary-foreground/90',
        secondary:
          'tw:bg-secondary tw:text-secondary-foreground tw:[&>[hlmAlertDescription]]:text-secondary-foreground/90 tw:[&>[hlmAlertDesc]]:text-secondary-foreground/90',
        success:
          'tw:bg-success tw:text-success-foreground tw:[&>[hlmAlertDescription]]:text-success-foreground/90 tw:[&>[hlmAlertDesc]]:text-success-foreground/90',
        warning:
          'tw:bg-warning tw:text-warning-foreground tw:[&>[hlmAlertDescription]]:text-warning-foreground/90 tw:[&>[hlmAlertDesc]]:text-warning-foreground/90',
        danger:
          'tw:bg-danger tw:text-danger-foreground tw:[&>[hlmAlertDescription]]:text-danger-foreground/90 tw:[&>[hlmAlertDesc]]:text-danger-foreground/90',
        info: 'tw:bg-info tw:text-info-foreground tw:[&>[hlmAlertDescription]]:text-info-foreground/90 tw:[&>[hlmAlertDesc]]:text-info-foreground/90',
        light:
          'tw:bg-light tw:text-light-foreground tw:[&>[hlmAlertDescription]]:text-light-foreground/90 tw:[&>[hlmAlertDesc]]:text-light-foreground/90',
        dark: 'tw:bg-dark tw:text-dark-foreground tw:[&>[hlmAlertDescription]]:text-dark-foreground/90 tw:[&>[hlmAlertDesc]]:text-dark-foreground/90',
        accent:
          'tw:bg-accent tw:text-accent-foreground tw:[&>[hlmAlertDescription]]:text-accent-foreground/90 tw:[&>[hlmAlertDesc]]:text-accent-foreground/90',
        destructive:
          'tw:bg-destructive tw:text-destructive-foreground tw:[&>[hlmAlertDescription]]:text-destructive-foreground/90 tw:[&>[hlmAlertDesc]]:text-destructive-foreground/90',
        muted:
          'tw:bg-muted tw:text-muted-foreground tw:[&>[hlmAlertDescription]]:text-muted-foreground/90 tw:[&>[hlmAlertDesc]]:text-muted-foreground/90',
        link: 'tw:text-primary tw:underline-offset-4 tw:[&>[hlmAlertDescription]]:text-primary/90 tw:[&>[hlmAlertDesc]]:text-primary/90',
        ghost: 'tw:[&>[hlmAlertDescription]]:text-muted-foreground tw:[&>[hlmAlertDesc]]:text-muted-foreground',
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
  selector: '[hlmAlert]',
  host: {
    role: 'alert',
    '[class]': '_computedClass()',
  },
})
export class HlmAlert {
  public readonly userClass = input<ClassValue>('', { alias: 'class' });
  protected readonly _computedClass = computed(() => hlm(alertVariants({ variant: this.variant() }), this.userClass()));

  public readonly variant = input<AlertVariants['variant']>('primary');
}
