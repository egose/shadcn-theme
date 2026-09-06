import { Component, signal } from '@angular/core';
import { DemoHeaderComponent } from '../../../shared/demo-header';
import { BrnAlertDialogImports } from '@spartan-ng/brain/alert-dialog';
import { HlmAlertDialogImports } from '@egose/shadcn-theme-ng/alert-dialog';
import { HlmButton } from '@egose/shadcn-theme-ng/button';

@Component({
  selector: 'app-alert-dialog-page',
  imports: [DemoHeaderComponent, BrnAlertDialogImports, HlmAlertDialogImports, HlmButton],
  template: `
    <app-demo-header title="Alert Dialog" description="A modal dialog that interrupts the user." />

    <hlm-alert-dialog>
      <button hlmButton variant="destructive" hlmAlertDialogTrigger type="button">Delete account</button>
      <!-- Structural brain content registers this panel with the dialog: without
        *brnAlertDialogContent the trigger would silently do nothing. -->
      <hlm-alert-dialog-content *brnAlertDialogContent="let ctx" class="tw:max-w-[425px]">
        <hlm-alert-dialog-header>
          <h3 hlmAlertDialogTitle>Are you absolutely sure?</h3>
          <p hlmAlertDialogDescription>
            This action cannot be undone. This will permanently delete your account and remove your data.
          </p>
        </hlm-alert-dialog-header>
        <hlm-alert-dialog-footer>
          <button hlmAlertDialogCancel hlmButton variant="secondary" appearance="outline" type="button">Cancel</button>
          <button hlmAlertDialogAction hlmButton variant="destructive" type="button" (click)="confirmDelete()">
            Delete
          </button>
        </hlm-alert-dialog-footer>
      </hlm-alert-dialog-content>
    </hlm-alert-dialog>

    @if (alertMessage()) {
      <p role="status" class="tw:mt-4 tw:text-sm tw:text-slate-600">{{ alertMessage() }}</p>
    }
  `,
})
export class AlertDialogPage {
  readonly alertMessage = signal<string | null>(null);

  confirmDelete() {
    this.alertMessage.set('Account deletion confirmed for this demo workspace.');
  }
}
