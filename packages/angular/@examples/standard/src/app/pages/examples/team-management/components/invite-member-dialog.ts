import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { BrnDialogRef, injectBrnDialogContext } from '@spartan-ng/brain/dialog';
import { HlmButton } from '@egose/shadcn-theme-ng/button';
import { HlmDialogDescription, HlmDialogFooter, HlmDialogHeader, HlmDialogTitle } from '@egose/shadcn-theme-ng/dialog';
import { HlmInput } from '@egose/shadcn-theme-ng/input';
import { HlmLabel } from '@egose/shadcn-theme-ng/label';
import { HlmNativeSelectImports } from '@egose/shadcn-theme-ng/native-select';
import { MEMBER_ROLES, isMemberRole, normalizeMemberEmail } from '../team-management-fixtures';
import type { InviteMemberContext, InviteMemberResult, MemberRole } from '../team-management-types';

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
    HlmNativeSelectImports,
  ],
  templateUrl: './invite-member-dialog.html',
  host: { class: 'tw:flex tw:min-w-0 tw:flex-col tw:gap-2' },
})
export class InviteMemberDialog {
  private readonly _ref = inject<BrnDialogRef<InviteMemberResult | null>>(BrnDialogRef);
  private readonly _context = injectBrnDialogContext<InviteMemberContext>();
  private readonly _fb = inject(FormBuilder);
  protected readonly roleOptions = MEMBER_ROLES;
  protected readonly form = this._fb.nonNullable.group({
    name: ['', (control: { value: string }) => (control.value.trim().length >= 2 ? null : { normalizedName: true })],
    email: [
      '',
      (control: { value: string }) => {
        const value = normalizeMemberEmail(control.value);
        if (!value) return { required: true };
        if (Validators.email(new FormControl(value))) return { email: true };
        return this._context.emailExists(value) ? { duplicate: true } : null;
      },
    ],
    role: this._fb.nonNullable.control<MemberRole>('Member', (control) =>
      isMemberRole(control.value) ? null : { role: true },
    ),
  });

  protected nameError(): string | null {
    const control = this.form.controls.name;
    return control.touched && control.invalid
      ? 'Enter the teammate’s full name using at least 2 non-padding characters'
      : null;
  }

  protected emailError(): string | null {
    const control = this.form.controls.email;
    if (!control.touched || control.valid) return null;
    if (control.hasError('required')) return 'Enter a work email address';
    if (control.hasError('duplicate')) return 'This email already belongs to a workspace member';
    return 'Enter a valid email like sam@example.com';
  }

  protected cancel(): void {
    this._ref.close(null);
  }

  protected submit(): void {
    // Recheck the live roster, including changes since the dialog opened.
    this.form.controls.email.updateValueAndValidity();
    this.form.markAllAsTouched();
    if (this.form.invalid) return;
    const value = this.form.getRawValue();
    this._ref.close({ name: value.name.trim(), email: normalizeMemberEmail(value.email), role: value.role });
  }
}
