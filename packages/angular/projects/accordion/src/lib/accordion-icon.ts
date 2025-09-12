import { Directive, computed, input } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import { lucideChevronDown } from '@ng-icons/lucide';
import { provideEgIconConfig } from '@egose/shadcn-theme-ng/icon';
import { cn } from '@egose/shadcn-theme-ng/utils';
import type { ClassValue } from 'clsx';

@Directive({
  selector: 'ng-icon[egAccordionIcon], ng-icon[egAccIcon]',
  providers: [provideIcons({ lucideChevronDown }), provideEgIconConfig({ size: 'sm' })],
  host: {
    '[class]': '_computedClass()',
  },
})
export class EgAccordionIcon {
  public readonly userClass = input<ClassValue>('', { alias: 'class' });
  protected readonly _computedClass = computed(() =>
    cn(
      'tw:text-muted-foreground tw:pointer-events-none tw:size-4 tw:shrink-0 tw:translate-y-0.5 tw:transition-transform tw:duration-200',
      this.userClass(),
    ),
  );
}
