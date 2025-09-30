import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { type ClassValue } from 'clsx';
import { NgIcon } from '@ng-icons/core';
import { tablerLoader2 } from '@ng-icons/tabler-icons';
import { hlm } from '@egose/shadcn-theme-ng/utils';

@Component({
  selector: 'hlm-spinner',
  imports: [NgIcon],
  host: {
    '[class]': '_containerClass()',
    role: 'status',
  },
  template: `<ng-icon [svg]="icon" [size]="size()" [class]="_iconClass()" />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class HlmSpinner {
  icon = tablerLoader2;

  // Variants
  public readonly size = input<string>('1.5rem');
  public readonly show = input<boolean>(true);

  // Optional extra classes from user
  public readonly wrapperClass = input<ClassValue>('', { alias: 'class' });
  public readonly spinnerClass = input<ClassValue>('', { alias: 'spinnerClass' });

  // Outer container class (visibility + layout)
  protected readonly _containerClass = computed(() =>
    hlm(
      'tw:flex-col tw:items-center tw:justify-center', // base container styles
      this.show() ? 'tw:flex' : 'tw:hidden',
      this.wrapperClass(),
    ),
  );

  // SVG spinner class (size + animation + color)
  protected readonly _iconClass = computed(() =>
    hlm(
      'tw:[&>svg]:animate-spin tw:[&>svg]:text-primary', // base svg styles
      this.spinnerClass(),
    ),
  );
}
