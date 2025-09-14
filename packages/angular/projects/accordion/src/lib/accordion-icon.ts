import { Directive, computed, input } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import { lucideChevronDown } from '@ng-icons/lucide';
import { provideHlmIconConfig } from '@egose/shadcn-theme-ng/icon';
import { cn } from '@egose/shadcn-theme-ng/utils';
import type { ClassValue } from 'clsx';

@Directive({
  selector: 'ng-icon[egAccordionIcon], ng-icon[hlmAccIcon]',
  providers: [provideIcons({ lucideChevronDown }), provideHlmIconConfig({ size: 'sm' })],
  host: {
    '[class]': '_computedClass()',
  },
})
export class HlmAccordionIcon {
  public readonly userClass = input<ClassValue>('', { alias: 'class' });
  protected readonly _computedClass = computed(() =>
    cn(
      'tw:text-muted-foreground tw:pointer-events-none tw:size-4 tw:shrink-0 tw:translate-y-0.5 tw:transition-transform tw:duration-200',
      this.userClass(),
    ),
  );
}
