import { Directive, computed, input } from '@angular/core';
import { BrnTabsContent } from '@spartan-ng/brain/tabs';
import { hlm } from '@egose/shadcn-theme-ng/utils';
import type { ClassValue } from 'clsx';

@Directive({
  selector: '[hlmTabsContent]',
  hostDirectives: [{ directive: BrnTabsContent, inputs: ['brnTabsContent: hlmTabsContent'] }],
  host: {
    '[class]': '_computedClass()',
  },
})
export class HlmTabsContent {
  public readonly contentFor = input.required<string>({ alias: 'hlmTabsContent' });

  public readonly userClass = input<ClassValue>('', { alias: 'class' });
  protected readonly _computedClass = computed(() =>
    hlm(
      'tw:ring-offset-background tw:focus-visible:ring-ring tw:mt-2 tw:focus-visible:outline-none tw:focus-visible:ring-2 tw:focus-visible:ring-offset-2',
      this.userClass(),
    ),
  );
}
