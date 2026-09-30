import type { NumberInput } from '@angular/cdk/coercion';
import { ChangeDetectionStrategy, Component, computed, inject, input, numberAttribute } from '@angular/core';
import { BrnInputOtpSlot } from '@spartan-ng/brain/input-otp';
import { classes } from '@egose/shadcn-theme-ng/utils';
import { HlmInputOtpFakeCaret } from './hlm-input-otp-fake-caret';
import { HlmInputOtpControl } from './hlm-input-otp-control';

@Component({
  selector: 'hlm-input-otp-slot',
  imports: [BrnInputOtpSlot, HlmInputOtpFakeCaret],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'data-slot': 'input-otp-slot' },
  template: `
    @if (_control) {
      <span
        [attr.data-active]="_slot()?.isActive"
        [attr.data-invalid]="_control.invalid?.() ? 'true' : null"
        [attr.data-touched]="_control.touched?.() ? 'true' : null"
        [attr.data-dirty]="_control.dirty?.() ? 'true' : null"
        [attr.data-matches-spartan-invalid]="_control.spartanInvalid?.() ? 'true' : null"
      >
        {{ _slot()?.char }}
        @if (_slot()?.hasFakeCaret) {
          <hlm-input-otp-fake-caret />
        }
      </span>
    } @else {
      <brn-input-otp-slot [index]="index()">
        <hlm-input-otp-fake-caret />
      </brn-input-otp-slot>
    }
  `,
})
export class HlmInputOtpSlot {
  protected readonly _control = inject(HlmInputOtpControl, { optional: true });
  protected readonly _slot = computed(() => this._control?.context()[this.index()]);
  /** The index of the slot to render the char or a fake caret */
  public readonly index = input.required<number, NumberInput>({ transform: numberAttribute });

  constructor() {
    classes(
      () =>
        'tw:dark:bg-input/30 tw:border-input tw:has-[[data-active="true"]]:border-ring tw:has-[[data-active="true"]]:ring-ring/50 tw:has-[[data-active="true"]]:data-[matches-spartan-invalid=true]:ring-destructive/20 tw:dark:has-[[data-active="true"]]:data-[matches-spartan-invalid=true]:ring-destructive/40 tw:data-[matches-spartan-invalid=true]:border-destructive tw:has-[[data-active="true"]]:data-[matches-spartan-invalid=true]:border-destructive tw:size-9 tw:border-y tw:border-e tw:text-sm tw:shadow-xs tw:transition-all tw:outline-none tw:first:rounded-s-md tw:first:border-s tw:last:rounded-e-md tw:has-[[data-active="true"]]:ring-3 tw:relative tw:flex tw:items-center tw:justify-center tw:has-[[data-active="true"]]:z-10',
    );
  }
}
