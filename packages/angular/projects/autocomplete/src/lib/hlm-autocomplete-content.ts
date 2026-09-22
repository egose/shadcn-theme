import { Directive } from '@angular/core';
import { BrnAutocompleteContent } from '@spartan-ng/brain/autocomplete';
import { classes } from '@egose/shadcn-theme-ng/utils';

@Directive({
  selector: '[hlmAutocompleteContent],hlm-autocomplete-content',
  hostDirectives: [BrnAutocompleteContent],
})
export class HlmAutocompleteContent {
  constructor() {
    classes(
      () =>
        'tw:bg-popover tw:text-popover-foreground tw:data-open:animate-in tw:data-closed:animate-out data-closed:fade-out-0 data-open:fade-in-0 tw:data-closed:zoom-out-95 tw:data-open:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 tw:ring-foreground/10 tw:max-h-72 tw:min-w-36 tw:overflow-hidden tw:rounded-md tw:shadow-md tw:ring-1 tw:duration-100 tw:group/autocomplete-content tw:flex tw:w-(--brn-autocomplete-width) tw:flex-col tw:p-0',
    );
  }
}
