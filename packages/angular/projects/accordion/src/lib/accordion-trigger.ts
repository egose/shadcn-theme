import { Directive, computed, input } from '@angular/core';
import { BrnAccordionTrigger } from '@spartan-ng/brain/accordion';
import { hlm } from '@egose/shadcn-theme-ng/utils';
import type { ClassValue } from 'clsx';

@Directive({
  selector: '[hlmAccordionTrigger]',
  host: {
    '[style.--tw-ring-offset-shadow]': '"0 0 #000"',
    '[class]': '_computedClass()',
  },
  hostDirectives: [BrnAccordionTrigger],
})
export class HlmAccordionTrigger {
  public readonly userClass = input<ClassValue>('', { alias: 'class' });
  protected readonly _computedClass = computed(() =>
    hlm(
      'tw:focus-visible:border-ring tw:focus-visible:ring-ring/50 tw:flex tw:flex-1 tw:items-start tw:justify-between tw:gap-4 tw:rounded-md tw:py-4 tw:text-left tw:text-sm tw:font-medium tw:outline-none tw:transition-all tw:hover:underline tw:focus-visible:ring-[3px] tw:disabled:pointer-events-none tw:disabled:opacity-50 tw:[&[data-state=open]>[egAccIcon]]:rotate-180',
      this.userClass(),
    ),
  );
}
