import { Directive } from '@angular/core';
import { classes } from '@egose/shadcn-theme-ng/utils';

@Directive({
  selector: '[hlmInputOtpGroup],hlm-input-otp-group',
  host: { 'data-slot': 'input-otp-group' },
})
export class HlmInputOtpGroup {
  constructor() {
    classes(
      () =>
        'tw:data-[matches-spartan-invalid=true]:ring-destructive/20 tw:dark:data-[matches-spartan-invalid=true]:ring-destructive/40 tw:data-[matches-spartan-invalid=true]:border-destructive tw:rounded-md tw:data-[matches-spartan-invalid=true]:ring-3 tw:flex tw:items-center',
    );
  }
}
