import { Component, inject, signal } from '@angular/core';
import { EgConfirmationDialogService } from '@egose/shadcn-theme-ng/confirmation-dialog';
import { HlmButton } from '@egose/shadcn-theme-ng/button';

@Component({
  selector: 'app-confirmation-dialog-page',
  imports: [HlmButton],
  template: `
    <h3 class="tw:text-2xl tw:font-bold tw:mb-2">Confirmation Dialog</h3>
    <p class="tw:text-gray-500 tw:mb-4">A convenience service for confirm prompts.</p>

    <button hlmButton variant="primary" type="button" (click)="ask()">Ask confirmation</button>
    @if (result() !== null) {
      <p class="tw:mt-3 tw:text-sm">Result: {{ result() }}</p>
    }
  `,
})
export class ConfirmationDialogPage {
  private readonly _confirm = inject(EgConfirmationDialogService);
  readonly result = signal<boolean | null>(null);

  async ask() {
    const ok = await this._confirm.showConfirmationDialog({
      title: 'Delete this item?',
      description: 'This action cannot be undone.',
    });
    this.result.set(ok);
  }
}
