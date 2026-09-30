import { Component, ElementRef, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BrnDialogRef, injectBrnDialogContext } from '@spartan-ng/brain/dialog';
import { HlmButton } from '@egose/shadcn-theme-ng/button';
import { HlmDialogDescription, HlmDialogFooter, HlmDialogHeader, HlmDialogTitle } from '@egose/shadcn-theme-ng/dialog';
import { HlmInput } from '@egose/shadcn-theme-ng/input';
import { HlmLabel } from '@egose/shadcn-theme-ng/label';
import { isValidSeatCount } from '../pricing-fixtures';
import type { PlanConfirmContext, PlanConfirmResult } from '../pricing-types';

@Component({
  imports: [
    ReactiveFormsModule,
    HlmButton,
    HlmDialogDescription,
    HlmDialogFooter,
    HlmDialogHeader,
    HlmDialogTitle,
    HlmInput,
    HlmLabel,
  ],
  templateUrl: './plan-confirm-dialog.html',
  host: { class: 'tw:flex tw:min-w-0 tw:flex-col tw:gap-2' },
})
export class PlanConfirmDialog {
  private readonly _dialogRef = inject<BrnDialogRef<PlanConfirmResult | null>>(BrnDialogRef);
  private readonly _host = inject<ElementRef<HTMLElement>>(ElementRef);
  protected readonly context = injectBrnDialogContext<PlanConfirmContext>();
  // Native number inputs produce null when cleared, even with nonNullable controls.
  protected readonly form = new FormGroup({
    seats: new FormControl<number | null>(5, [
      Validators.required,
      (control) => (control.value == null || isValidSeatCount(control.value) ? null : { seatCount: true }),
    ]),
  });

  protected seatsError(): string | null {
    const control = this.form.controls.seats;
    if (!control.touched || control.valid) return null;
    if (control.hasError('required')) return 'Seats are required';
    return 'Enter a finite whole number of seats from 1 to 1000';
  }

  protected cancel(): void {
    this._dialogRef.close(null);
  }

  protected confirm(): void {
    this.form.markAllAsTouched();
    const seats = this.form.controls.seats.value;
    if (this.form.invalid || !isValidSeatCount(seats)) {
      this._host.nativeElement.querySelector<HTMLInputElement>('#plan-seats')?.focus();
      return;
    }
    this._dialogRef.close({ seats });
  }
}
