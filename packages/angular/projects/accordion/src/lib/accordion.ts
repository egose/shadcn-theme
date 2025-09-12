import { Directive, computed, inject, input } from '@angular/core';
import { BrnAccordion } from '@spartan-ng/brain/accordion';
import { cn } from '@egose/shadcn-theme-ng/utils';
import type { ClassValue } from 'clsx';

@Directive({
  selector: '[egAccordion], eg-accordion',
  host: {
    '[class]': '_computedClass()',
  },
  hostDirectives: [{ directive: BrnAccordion, inputs: ['type', 'dir', 'orientation'] }],
})
export class EgAccordion {
  private readonly _brn = inject(BrnAccordion);

  public readonly userClass = input<ClassValue>('', { alias: 'class' });
  protected readonly _computedClass = computed(() =>
    cn('tw:flex', this._brn.orientation() === 'horizontal' ? 'tw:flex-row' : 'tw:flex-col', this.userClass()),
  );
}
