import { Component, inject, Injectable } from '@angular/core';
import { HlmButton } from '@egose/shadcn-theme-ng/button';

import { HlmAlertIcon } from '@egose/shadcn-theme-ng/alert';
import {
  HlmDialogDescription,
  HlmDialogHeader,
  HlmDialogFooter,
  HlmDialogService,
  HlmDialogTitle,
} from '@egose/shadcn-theme-ng/dialog';
import { BrnDialogRef, injectBrnDialogContext } from '@spartan-ng/brain/dialog';
import { HlmIcon } from '@egose/shadcn-theme-ng/icon';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideTriangleAlert } from '@ng-icons/lucide';

@Component({
  imports: [
    HlmButton,
    HlmAlertIcon,
    HlmDialogDescription,
    HlmDialogHeader,
    HlmDialogFooter,
    HlmDialogTitle,
    NgIcon,
    HlmIcon,
  ],
  standalone: true,
  providers: [provideIcons({ lucideTriangleAlert })],
  template: `
    <hlm-dialog-header>
      <div class="tw:flex tw:items-center tw:gap-1">
        <ng-icon hlm hlmAlertIcon name="lucideTriangleAlert" size="base" />
        <h3 hlmDialogTitle class="tw:text-xl">{{ _title }}</h3>
      </div>
      <p hlmDialogDescription class="tw:text-base tw:text-gray-700">{{ _description }}</p>
    </hlm-dialog-header>

    <hlm-dialog-footer class="tw:mt-4">
      <button hlmButton variant="secondary" appearance="outline" (click)="close(false)">Cancel</button>
      <button hlmButton variant="danger" (click)="close(true)">Confirm</button>
    </hlm-dialog-footer>
  `,
  host: {
    class: 'tw:w-full tw:p-1',
  },
})
export class EgConfirmationDialog {
  private readonly _dialogRef = inject<BrnDialogRef<boolean>>(BrnDialogRef);
  private readonly _dialogContext = injectBrnDialogContext<{ title: string; description: string }>();

  protected readonly _title = this._dialogContext.title || 'Are you absolutely sure?';
  protected readonly _description = this._dialogContext.description || 'This action cannot be undone.';

  public close(confirm: boolean) {
    this._dialogRef.close(confirm);
  }
}

/** @deprecated Use `EgConfirmationDialog`. The misspelled name will be removed in the next major release. */
export type EgConfirmationDiaglog = EgConfirmationDialog;
/** @deprecated Use `EgConfirmationDialog`. The misspelled name will be removed in the next major release. */
export const EgConfirmationDiaglog = EgConfirmationDialog;

@Injectable({ providedIn: 'root' })
export class EgConfirmationDialogService {
  constructor(private hlmDialogService: HlmDialogService) {}

  showConfirmationDialog({ title, description }: { title: string; description: string }) {
    return new Promise<boolean>((resolve) => {
      const dialogRef = this.hlmDialogService.open<boolean>(EgConfirmationDialog, {
        context: { title, description },
        contentClass: '',
      });

      dialogRef.closed$.subscribe((confirm) => {
        resolve(confirm ?? false);
      });
    });
  }
}
