import { Directive, input } from '@angular/core';
import { classes } from '@egose/shadcn-theme-ng/utils';

@Directive({
  selector: 'legend[hlmFieldLegend]',
  host: {
    'data-slot': 'field-legend',
    '[attr.data-variant]': 'variant()',
  },
})
export class HlmFieldLegend {
  public readonly variant = input<'label' | 'legend'>('legend');

  constructor() {
    classes(() => 'tw:mb-3 tw:font-medium tw:data-[variant=label]:text-sm tw:data-[variant=legend]:text-base');
  }
}
