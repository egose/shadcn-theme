import { Directive, computed, input } from '@angular/core';
import { BrnAccordionItem } from '@spartan-ng/brain/accordion';
import { cn } from '@egose/shadcn-theme-ng/utils';
import type { ClassValue } from 'clsx';

@Directive({
  selector: '[egAccordionItem],brn-accordion-item[eg],eg-accordion-item',
  host: {
    '[class]': '_computedClass()',
  },
  hostDirectives: [
    {
      directive: BrnAccordionItem,
      inputs: ['isOpened'],
    },
  ],
})
export class EgAccordionItem {
  public readonly userClass = input<ClassValue>('', { alias: 'class' });
  protected readonly _computedClass = computed(() =>
    cn('tw:border-border tw:flex tw:flex-1 tw:flex-col tw:border-b', this.userClass()),
  );
}
