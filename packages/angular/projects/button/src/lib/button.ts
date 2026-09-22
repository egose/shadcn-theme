import { Component, computed, signal, input, type TemplateRef } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { BrnButton } from '@spartan-ng/brain/button';
import { HlmSpinner } from '@egose/shadcn-theme-ng/spinner';
import { cva, type VariantProps } from 'class-variance-authority';
import { type ClassValue } from 'clsx';
import { hlm } from '@egose/shadcn-theme-ng/utils';

// Keep complete utility names here so consumer Tailwind builds can discover every tone.
const toneTextClasses = {
  default: 'tw:text-primary',
  primary: 'tw:text-primary',
  secondary: 'tw:text-secondary',
  success: 'tw:text-success',
  warning: 'tw:text-warning',
  danger: 'tw:text-danger',
  info: 'tw:text-info',
  light: 'tw:text-light-foreground',
  dark: 'tw:text-dark',
  accent: 'tw:text-accent',
  destructive: 'tw:text-destructive',
  muted: 'tw:text-muted-foreground',
  outline: 'tw:text-primary',
  link: 'tw:text-primary',
  ghost: 'tw:text-light-foreground',
};

type ToneVariant = keyof typeof toneTextClasses;

const outlineClasses: Record<ToneVariant, string> = {
  default: 'tw:border-primary tw:hover:bg-primary/10',
  primary: 'tw:border-primary tw:hover:bg-primary/10',
  secondary: 'tw:border-secondary tw:hover:bg-secondary/10',
  success: 'tw:border-success tw:hover:bg-success/10',
  warning: 'tw:border-warning tw:hover:bg-warning/10',
  danger: 'tw:border-danger tw:hover:bg-danger/10',
  info: 'tw:border-info tw:hover:bg-info/10',
  light: 'tw:border-light tw:hover:bg-light/10',
  dark: 'tw:border-dark tw:hover:bg-dark/10',
  accent: 'tw:border-accent tw:hover:bg-accent/10',
  destructive: 'tw:border-destructive tw:hover:bg-destructive/10',
  muted: 'tw:border-muted tw:hover:bg-muted/10',
  outline: 'tw:border-primary tw:hover:bg-primary/10',
  link: '',
  ghost: '',
};

const outlineFilledClasses: Record<ToneVariant, string> = {
  default: 'tw:hover:bg-primary tw:hover:text-primary-foreground',
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
  outline: 'tw:hover:bg-primary tw:hover:text-primary-foreground',
  link: 'tw:hover:underline',
  ghost: 'tw:hover:bg-light',
};

/** Semantic color utilities and appearances. Merge the result with hlm() for custom hosts. */
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
    'tw:no-underline',
  ],
  {
    variants: {
      variant: {
        default:
          'tw:border tw:border-primary tw:bg-primary tw:text-primary-foreground tw:shadow-sm tw:hover:bg-primary/90',
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
        outline: 'tw:border tw:border-primary tw:bg-background tw:text-primary tw:shadow-sm tw:hover:bg-primary/10',
        link: 'tw:text-primary tw:underline-offset-4 tw:hover:underline',
        ghost: 'tw:hover:bg-light tw:hover:text-light-foreground',
      },
      size: {
        xs: 'tw:h-7 tw:rounded-xs tw:px-2 tw:text-xs',
        sm: 'tw:h-8 tw:rounded-sm tw:px-3',
        default: 'tw:h-9 tw:px-4 tw:py-2',
        lg: 'tw:h-10 tw:rounded-sm tw:px-7 tw:text-base',
        icon: 'tw:h-9 tw:w-9',
        'icon-xs': 'tw:h-6 tw:w-6 tw:rounded-xs',
        'icon-sm': 'tw:h-8 tw:w-8 tw:rounded-sm',
        'icon-lg': 'tw:h-10 tw:w-10 tw:rounded-sm',
        'compact-xs': 'tw:h-6 tw:px-2 tw:py-1 tw:text-xs',
        'compact-sm': 'tw:h-7 tw:px-2 tw:py-1',
        'compact-default': 'tw:h-8 tw:px-2 tw:py-1',
        'compact-lg': 'tw:h-9 tw:px-2 tw:py-1 tw:text-base',
        'compact-icon': 'tw:h-8 tw:w-8',
      },
      appearance: {
        solid: '',
        outline: 'tw:bg-background tw:border tw:shadow-sm',
        'outline-filled': 'tw:bg-background tw:border tw:shadow-sm',
        ghost: 'tw:bg-transparent tw:border-0 tw:shadow-none',
        link: 'tw:bg-transparent tw:border-0 tw:shadow-none tw:hover:bg-transparent tw:underline-offset-4 tw:hover:underline',
      },
      loading: {
        true: 'tw:pointer-events-none',
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
    '[attr.aria-busy]': 'loading() || null',
    '[attr.disabled]': '(loading() || disabled()) ? true : null',
    '[attr.type]': 'type()',
  },
  template: `
    <ng-template #projected>
      <ng-content></ng-content>
    </ng-template>

    @if (loading()) {
      <div class="tw:relative tw:inline-flex tw:items-center">
        <span class="tw:invisible">
          <ng-container *ngTemplateOutlet="projected" />
        </span>
        <span class="tw:absolute tw:inset-0 tw:flex tw:items-center tw:justify-center">
          <hlm-spinner [spinnerClass]="spinnerClass()" />
        </span>
      </div>
    } @else {
      <div class="tw:flex tw:items-center tw:gap-1">
        @if (icon() && iconPosition() === 'left') {
          <ng-container *ngTemplateOutlet="icon()" />
        }
        <ng-container *ngTemplateOutlet="projected" />
        @if (icon() && iconPosition() === 'right') {
          <ng-container *ngTemplateOutlet="icon()" />
        }
      </div>
    }
  `,
})
export class HlmButton {
  /** Semantic color token. Legacy default, outline, link, and ghost variants remain supported. */
  public readonly variant = input<VariantType>('primary');
  public readonly size = input<SizeType>('default');
  /** Visual treatment independent of color: solid, outline, outline-filled, ghost, or link. */
  public readonly appearance = input<AppearanceType>('solid');
  public readonly loading = input<boolean>(false);
  public readonly icon = input<TemplateRef<unknown> | undefined>(undefined);
  public readonly iconPosition = input<'left' | 'right'>('left');
  public readonly userClass = input<ClassValue>('', { alias: 'class' });
  public readonly spinnerUserClass = input<ClassValue>('');
  public readonly disabled = input<boolean>(false);
  public readonly type = input<'button' | 'submit' | 'reset'>('button');
  private readonly _additionalClasses = signal<ClassValue>('');

  /** Computed button class merging */
  protected readonly _computedClass = computed(() =>
    hlm(
      buttonVariants({
        variant: this.variant(),
        size: this.size(),
        appearance: this.appearance(),
        loading: this.loading(),
      }),
      this.userClass(),
      this.loading() ? 'tw:pointer-events-none' : '',
      this._additionalClasses(),
    ),
  );

  /** Inherit the button's resolved text color, including theme and consumer overrides. */
  protected readonly spinnerClass = computed(() => hlm('tw:[&>svg]:text-current', this.spinnerUserClass()));

  setClass(classes: string): void {
    this._additionalClasses.set(classes);
  }
}
