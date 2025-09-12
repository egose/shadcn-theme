import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { type ClassValue } from 'clsx';
import { NgIcon } from '@ng-icons/core';
import { tablerLoader2 } from '@ng-icons/tabler-icons';
import { cn } from '@egose/shadcn-theme-ng/utils';

type SpinnerSize = 'small' | 'medium' | 'large';

@Component({
  selector: 'eg-spinner',
  imports: [NgIcon],
  host: {
    '[class]': '_containerClass()',
    role: 'status',
  },
  template: `<ng-icon [svg]="icon" [class]="_iconClass()" />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class EgSpinner {
  icon = tablerLoader2;

  // Variants
  public readonly size = input<SpinnerSize>('medium');
  public readonly show = input<boolean>(true);

  // Optional extra classes from user
  public readonly wrapperClass = input<ClassValue>('', { alias: 'class' });
  public readonly spinnerClass = input<ClassValue>('', { alias: 'spinnerClass' });

  // Map sizes to Tailwind classes
  private readonly sizeClasses: Record<SpinnerSize, string> = {
    small: 'tw:size-6!',
    medium: 'tw:size-8!',
    large: 'tw:size-12!',
  };

  // Outer container class (visibility + layout)
  protected readonly _containerClass = computed(() =>
    cn(
      'tw:flex-col tw:items-center tw:justify-center', // base container styles
      this.show() ? 'tw:flex' : 'tw:hidden',
      this.wrapperClass(),
    ),
  );

  // SVG spinner class (size + animation + color)
  protected readonly _iconClass = computed(() =>
    cn(
      'tw:[&>svg]:animate-spin tw:[&>svg]:text-primary', // base svg styles
      this.sizeClasses[this.size()],
      this.spinnerClass(),
    ),
  );
}
