import type { NumberInput } from '@angular/cdk/coercion';
import { ChangeDetectionStrategy, Component, input, numberAttribute } from '@angular/core';
import { BrnInputOtpSlot } from '@spartan-ng/brain/input-otp';
import { classes } from '@egose/shadcn-theme-ng/utils';
import { HlmInputOtpFakeCaret } from './hlm-input-otp-fake-caret';

@Component({
  selector: 'hlm-input-otp-slot',
  imports: [BrnInputOtpSlot, HlmInputOtpFakeCaret],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'data-slot': 'input-otp-slot' },
  template: `
    <brn-input-otp-slot [index]="index()">
      <hlm-input-otp-fake-caret />
    </brn-input-otp-slot>
  `,
})
export class HlmInputOtpSlot {
  /** The index of the slot to render the char or a fake caret */
  public readonly index = input.required<number, NumberInput>({ transform: numberAttribute });

  constructor() {
    classes(
      () =>
        'tw:dark:bg-input/30 tw:border-input tw:has-[brn-input-otp-slot[data-active="true"]]:border-ring tw:has-[brn-input-otp-slot[data-active="true"]]:ring-ring/50 tw:has-[brn-input-otp-slot[data-active="true"]]:data-[matches-spartan-invalid=true]:ring-destructive/20 tw:dark:has-[brn-input-otp-slot[data-active="true"]]:data-[matches-spartan-invalid=true]:ring-destructive/40 tw:data-[matches-spartan-invalid=true]:border-destructive tw:has-[brn-input-otp-slot[data-active="true"]]:data-[matches-spartan-invalid=true]:border-destructive tw:size-9 tw:border-y tw:border-e tw:text-sm tw:shadow-xs tw:transition-all tw:outline-none tw:first:rounded-s-md tw:first:border-s tw:last:rounded-e-md tw:has-[brn-input-otp-slot[data-active="true"]]:ring-3 tw:relative tw:flex tw:items-center tw:justify-center tw:has-[brn-input-otp-slot[data-active="true"]]:z-10',
    );
  }
}
