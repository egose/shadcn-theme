import { Directive, computed, input } from '@angular/core';
import { BrnTabsContent } from '@spartan-ng/brain/tabs';
import { cn } from '@egose/shadcn-theme-ng/utils';
import type { ClassValue } from 'clsx';

@Directive({
  selector: '[egTabsContent]',
  hostDirectives: [{ directive: BrnTabsContent, inputs: ['brnTabsContent: egTabsContent'] }],
  host: {
    '[class]': '_computedClass()',
  },
})
export class EgTabsContent {
  public readonly contentFor = input.required<string>({ alias: 'egTabsContent' });

  public readonly userClass = input<ClassValue>('', { alias: 'class' });
  protected readonly _computedClass = computed(() =>
    cn(
      'tw:ring-offset-background tw:focus-visible:ring-ring tw:mt-2 tw:focus-visible:outline-none tw:focus-visible:ring-2 tw:focus-visible:ring-offset-2',
      this.userClass(),
    ),
  );
}
