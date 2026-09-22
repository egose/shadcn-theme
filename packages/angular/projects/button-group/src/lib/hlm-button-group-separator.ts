import { Directive } from '@angular/core';
import { BrnSeparator, provideBrnSeparatorConfig } from '@spartan-ng/brain/separator';
import { classes } from '@egose/shadcn-theme-ng/utils';

@Directive({
  selector: '[hlmButtonGroupSeparator],hlm-button-group-separator',
  providers: [provideBrnSeparatorConfig({ orientation: 'vertical' })],
  hostDirectives: [{ directive: BrnSeparator, inputs: ['orientation', 'decorative'] }],
  host: {
    'data-slot': 'button-group-separator',
  },
})
export class HlmButtonGroupSeparator {
  constructor() {
    classes(() => [
      'tw:bg-input tw:relative tw:self-stretch tw:data-horizontal:mx-px tw:data-horizontal:w-auto tw:data-vertical:my-px tw:data-vertical:h-auto',
      // separator classes
      'tw:shrink-0 tw:data-horizontal:h-px tw:data-vertical:w-px tw:data-vertical:self-stretch',
    ]);
  }
}
