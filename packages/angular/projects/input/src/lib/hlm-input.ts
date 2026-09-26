import { Directive, input } from '@angular/core';
import { BrnFieldControlDescribedBy } from '@spartan-ng/brain/field';
import { BrnInput } from '@spartan-ng/brain/input';
import { classes, hlm } from '@egose/shadcn-theme-ng/utils';

@Directive({
  selector: '[hlmInput]',
  hostDirectives: [{ directive: BrnInput, inputs: ['id', 'forceInvalid'] }, BrnFieldControlDescribedBy],
  host: {
    'data-slot': 'input',
    '[attr.aria-describedby]': 'ariaDescribedby()',
  },
})
export class HlmInput {
  public readonly ariaDescribedby = input<string | null>(null);
  /** Height density. Merged after the base height class, so it wins via `twMerge`. */
  public readonly size = input<'sm' | 'default' | 'lg'>('default');

  constructor() {
    classes(() =>
      hlm(
        'tw:dark:bg-input/30 tw:border-input tw:focus-visible:border-ring tw:focus-visible:ring-ring/50 tw:data-[matches-spartan-invalid=true]:ring-destructive/20 tw:dark:data-[matches-spartan-invalid=true]:ring-destructive/40 tw:data-[matches-spartan-invalid=true]:border-destructive tw:dark:data-[matches-spartan-invalid=true]:border-destructive/50 tw:h-9 tw:rounded-md tw:border tw:bg-transparent tw:px-2.5 tw:py-1 tw:text-base tw:shadow-xs tw:transition-[color,box-shadow] tw:file:h-7 tw:file:text-sm tw:file:font-medium tw:focus-visible:ring-3 tw:data-[matches-spartan-invalid=true]:ring-3 tw:md:text-sm tw:file:text-foreground tw:placeholder:text-muted-foreground tw:w-full tw:min-w-0 tw:outline-none tw:file:inline-flex tw:file:border-0 tw:file:bg-transparent tw:disabled:pointer-events-none tw:disabled:cursor-not-allowed tw:disabled:opacity-50',
        this.size() === 'sm' ? 'tw:h-8' : this.size() === 'lg' ? 'tw:h-10' : '',
      ),
    );
  }
}
