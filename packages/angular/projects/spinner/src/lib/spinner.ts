import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { twMerge } from 'tailwind-merge';
import { clsx, type ClassValue } from 'clsx';
import { NgIcon } from '@ng-icons/core';
import { tablerLoader2 } from '@ng-icons/tabler-icons';

function hlm(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

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
    small: '!size-6',
    medium: '!size-8',
    large: '!size-12',
  };

  // Outer container class (visibility + layout)
  protected readonly _containerClass = computed(() =>
    hlm(
      'flex-col items-center justify-center', // base container styles
      this.show() ? 'flex' : 'hidden',
      this.wrapperClass(),
    ),
  );

  // SVG spinner class (size + animation + color)
  protected readonly _iconClass = computed(() =>
    hlm(
      '[&>svg]:animate-spin [&>svg]:text-primary', // base svg styles
      this.sizeClasses[this.size()],
      this.spinnerClass(),
    ),
  );
}
