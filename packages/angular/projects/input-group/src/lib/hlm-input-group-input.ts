import { Directive } from '@angular/core';
import { HlmInput } from '@egose/shadcn-theme-ng/input';
import { classes } from '@egose/shadcn-theme-ng/utils';

@Directive({
  selector: 'input[hlmInputGroupInput]',
  hostDirectives: [HlmInput],
  host: { 'data-slot': 'input-group-control' },
})
export class HlmInputGroupInput {
  constructor() {
    classes(
      () =>
        `tw:rounded-none tw:border-0 tw:bg-transparent tw:shadow-none tw:ring-0 tw:focus-visible:ring-0 tw:data-[matches-spartan-invalid=true]:ring-0 tw:dark:bg-transparent tw:flex-1`,
    );
  }
}
