import { Directive } from '@angular/core';
import { BrnFieldControlDescribedBy } from '@spartan-ng/brain/field';
import { BrnTextarea } from '@spartan-ng/brain/textarea';
import { classes } from '@egose/shadcn-theme-ng/utils';

@Directive({
  selector: '[hlmTextarea]',
  hostDirectives: [{ directive: BrnTextarea, inputs: ['id', 'forceInvalid'] }, BrnFieldControlDescribedBy],
  host: { 'data-slot': 'textarea' },
})
export class HlmTextarea {
  constructor() {
    classes(
      () =>
        'tw:border-input tw:dark:bg-input/30 tw:focus-visible:border-ring tw:focus-visible:ring-ring/50 tw:data-[matches-spartan-invalid=true]:ring-destructive/20 tw:dark:data-[matches-spartan-invalid=true]:ring-destructive/40 tw:data-[matches-spartan-invalid=true]:border-destructive tw:dark:data-[matches-spartan-invalid=true]:border-destructive/50 tw:rounded-md tw:border tw:bg-transparent tw:px-2.5 tw:py-2 tw:text-base tw:shadow-xs tw:transition-[color,box-shadow] tw:focus-visible:ring-3 tw:data-[matches-spartan-invalid=true]:ring-3 tw:md:text-sm tw:placeholder:text-muted-foreground tw:flex tw:field-sizing-content tw:min-h-16 tw:w-full tw:outline-none tw:disabled:cursor-not-allowed tw:disabled:opacity-50',
    );
  }
}
