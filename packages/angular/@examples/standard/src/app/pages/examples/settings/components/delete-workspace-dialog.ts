import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { BrnDialogRef, injectBrnDialogContext } from '@spartan-ng/brain/dialog';
import { HlmButton } from '@egose/shadcn-theme-ng/button';
import { HlmDialogDescription, HlmDialogFooter, HlmDialogHeader, HlmDialogTitle } from '@egose/shadcn-theme-ng/dialog';
import { HlmInput } from '@egose/shadcn-theme-ng/input';
import { HlmLabel } from '@egose/shadcn-theme-ng/label';
import type { DeleteWorkspaceContext } from '../settings-types';

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
  templateUrl: './delete-workspace-dialog.html',
  host: { class: 'tw:flex tw:flex-col tw:gap-2' },
})
export class DeleteWorkspaceDialog {
  private readonly _dialogRef = inject<BrnDialogRef<string | null>>(BrnDialogRef);
  protected readonly context = injectBrnDialogContext<DeleteWorkspaceContext>();
  protected readonly form = inject(FormBuilder).nonNullable.group({ confirmation: '' });

  protected matches(): boolean {
    return this.form.controls.confirmation.value.trim() === this.context.expectedSlug;
  }
  protected cancel(): void {
    this._dialogRef.close(null);
  }
  protected confirm(): void {
    if (this.matches()) this._dialogRef.close(this.form.controls.confirmation.value.trim());
  }
}
