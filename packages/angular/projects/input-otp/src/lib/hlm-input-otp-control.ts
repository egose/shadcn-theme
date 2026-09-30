import { BooleanInput } from '@angular/cdk/coercion';
import { booleanAttribute, ChangeDetectionStrategy, Component, forwardRef, input } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { BrnFieldControl, BrnFieldControlDescribedBy, provideBrnLabelable } from '@spartan-ng/brain/field';
import { BrnInputOtp } from '@spartan-ng/brain/input-otp';
import { HlmInputOtp } from './hlm-input-otp';

/**
 * BrnInputOtp's CVA and editing behavior with declarative native-input ARIA forwarding.
 * Use with HlmInputOtpSlot; the legacy brn-input-otp skin remains available.
 */
@Component({
  selector: 'hlm-input-otp',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BrnFieldControlDescribedBy],
  hostDirectives: [BrnFieldControl, HlmInputOtp],
  providers: [
    { provide: BrnInputOtp, useExisting: forwardRef(() => HlmInputOtpControl) },
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => HlmInputOtpControl), multi: true },
    provideBrnLabelable(HlmInputOtpControl),
  ],
  template: `
    <ng-content />
    <div [style]="containerStyles()">
      <input
        #otpInput
        data-slot="input-otp"
        [id]="inputId()"
        [class]="inputClass()"
        [autocomplete]="inputAutocomplete()"
        [style]="inputStyles()"
        [disabled]="_disabled()"
        [inputMode]="inputMode()"
        [value]="value() ?? ''"
        brnFieldControlDescribedBy
        [aria-describedby]="ariaDescribedBy()"
        [attr.aria-required]="required() || null"
        [attr.aria-invalid]="invalid?.() ? 'true' : null"
        (input)="onInputChange($event)"
        (paste)="onPaste($event)"
        (focus)="_focused.set(true)"
        (blur)="onBlur()"
      />
    </div>
  `,
})
export class HlmInputOtpControl extends BrnInputOtp {
  /** Native input description IDs, merged with enclosing Spartan field descriptions. */
  public readonly ariaDescribedBy = input<string | null>(null, { alias: 'aria-describedby' });
  public readonly required = input<boolean, BooleanInput>(false, { transform: booleanAttribute });
}
