import { Component } from '@angular/core';
import { BrnAlertDialogImports } from '@spartan-ng/brain/alert-dialog';
import { HlmAlertDialogImports } from '@egose/shadcn-theme-ng/alert-dialog';
import { HlmButton } from '@egose/shadcn-theme-ng/button';

@Component({
  selector: 'app-alert-dialog-page',
  imports: [BrnAlertDialogImports, HlmAlertDialogImports, HlmButton],
  template: `
    <h3 class="tw:text-2xl tw:font-bold tw:mb-2">Alert Dialog</h3>
    <p class="tw:text-gray-500 tw:mb-4">A modal dialog that interrupts the user.</p>

    <hlm-alert-dialog>
      <button hlmButton variant="destructive" hlmAlertDialogTrigger type="button">Delete account</button>
      <hlm-alert-dialog-content class="tw:max-w-[425px]">
        <hlm-alert-dialog-header>
          <h3 hlmAlertDialogTitle>Are you absolutely sure?</h3>
          <p hlmAlertDialogDescription>
            This action cannot be undone. This will permanently delete your account and remove your data.
          </p>
        </hlm-alert-dialog-header>
        <hlm-alert-dialog-footer>
          <button hlmAlertDialogCancel hlmButton variant="secondary" appearance="outline">Cancel</button>
          <button hlmAlertDialogAction hlmButton variant="destructive">Delete</button>
        </hlm-alert-dialog-footer>
      </hlm-alert-dialog-content>
    </hlm-alert-dialog>
  `,
})
export class AlertDialogPage {}
