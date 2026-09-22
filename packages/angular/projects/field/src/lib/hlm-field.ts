import { Directive, input } from '@angular/core';
import { BrnField } from '@spartan-ng/brain/field';
import { classes } from '@egose/shadcn-theme-ng/utils';
import { cva, VariantProps } from 'class-variance-authority';

const fieldVariants = cva(
  'tw:data-[matches-spartan-invalid=true]:text-destructive tw:gap-3 tw:group/field tw:flex tw:w-full',
  {
    variants: {
      orientation: {
        vertical: 'tw:flex-col tw:*:w-full tw:[&>.sr-only]:w-auto',
        horizontal: [
          'tw:flex-row tw:items-center',
          'tw:*:data-[slot=field-label]:flex-auto',
          'tw:has-[>[data-slot=field-content]]:items-start tw:has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio]]:mt-px',
        ],
        responsive: [
          'tw:flex-col tw:*:w-full tw:@md/field-group:flex-row tw:@md/field-group:items-center tw:@md/field-group:*:w-auto tw:[&>.sr-only]:w-auto',
          'tw:@md/field-group:*:data-[slot=field-label]:flex-auto',
          'tw:@md/field-group:has-[>[data-slot=field-content]]:items-start tw:@md/field-group:has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio]]:mt-px',
        ],
      },
    },
    defaultVariants: {
      orientation: 'vertical',
    },
  },
);

export type FieldVariants = VariantProps<typeof fieldVariants>;

@Directive({
  selector: '[hlmField],hlm-field',
  hostDirectives: [{ directive: BrnField, inputs: ['data-invalid', 'forceInvalid'] }],
  host: {
    role: 'group',
    'data-slot': 'field',
    '[attr.data-orientation]': 'orientation()',
  },
})
export class HlmField {
  public readonly orientation = input<FieldVariants['orientation']>('vertical');

  constructor() {
    classes(() => fieldVariants({ orientation: this.orientation() }));
  }
}
