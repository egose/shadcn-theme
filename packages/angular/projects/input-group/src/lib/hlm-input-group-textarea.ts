import { Directive } from '@angular/core';
import { HlmTextarea } from '@egose/shadcn-theme-ng/textarea';
import { classes } from '@egose/shadcn-theme-ng/utils';

@Directive({
  selector: 'textarea[hlmInputGroupTextarea]',
  hostDirectives: [HlmTextarea],
  host: { 'data-slot': 'input-group-control' },
})
export class HlmInputGroupTextarea {
  constructor() {
    classes(
      () =>
        'tw:rounded-none tw:border-0 tw:bg-transparent tw:py-2 tw:shadow-none tw:ring-0 tw:focus-visible:ring-0 tw:data-[matches-spartan-invalid=true]:ring-0 tw:dark:bg-transparent tw:flex-1 tw:resize-none',
    );
  }
}
