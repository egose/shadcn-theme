import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { BrnDialogRef, injectBrnDialogContext } from '@spartan-ng/brain/dialog';
import { HlmButton } from '@egose/shadcn-theme-ng/button';
import { HlmDialogDescription, HlmDialogFooter, HlmDialogHeader, HlmDialogTitle } from '@egose/shadcn-theme-ng/dialog';
import { HlmLabel } from '@egose/shadcn-theme-ng/label';
import { HlmNativeSelectImports } from '@egose/shadcn-theme-ng/native-select';
import { MEMBER_ROLES, isMemberRole } from '../team-management-fixtures';
import type { RoleChangeContext, RoleChangeResult } from '../team-management-types';

@Component({
  imports: [
    ReactiveFormsModule,
    HlmButton,
    HlmDialogDescription,
    HlmDialogFooter,
    HlmDialogHeader,
    HlmDialogTitle,
    HlmLabel,
    HlmNativeSelectImports,
  ],
  templateUrl: './change-role-dialog.html',
  host: { class: 'tw:flex tw:min-w-0 tw:flex-col tw:gap-2' },
})
export class ChangeRoleDialog {
  private readonly _ref = inject<BrnDialogRef<RoleChangeResult | null>>(BrnDialogRef);
  protected readonly context = injectBrnDialogContext<RoleChangeContext>();
  protected readonly roleOptions = MEMBER_ROLES;
  protected readonly form = inject(FormBuilder).nonNullable.group({ role: [this.context.currentRole] });
  protected cancel(): void {
    this._ref.close(null);
  }
  protected submit(): void {
    const role = this.form.getRawValue().role;
    if (isMemberRole(role)) this._ref.close({ role });
  }
}
