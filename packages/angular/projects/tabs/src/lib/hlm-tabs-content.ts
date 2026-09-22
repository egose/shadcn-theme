import { Directive, input } from '@angular/core';
import { BrnTabsContent } from '@spartan-ng/brain/tabs';
import { classes } from '@egose/shadcn-theme-ng/utils';

@Directive({
  selector: '[hlmTabsContent]',
  hostDirectives: [{ directive: BrnTabsContent, inputs: ['brnTabsContent: hlmTabsContent'] }],
  host: {
    'data-slot': 'tabs-content',
  },
})
export class HlmTabsContent {
  public readonly contentFor = input.required<string>({ alias: 'hlmTabsContent' });

  constructor() {
    classes(() => 'tw:flex-1 tw:text-sm tw:outline-none');
  }
}
