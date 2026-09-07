import { Component, inject, signal } from '@angular/core';
import { DemoHeaderComponent } from '../../../shared/demo-header';
import { EgConfirmationDialogService } from '@egose/shadcn-theme-ng/confirmation-dialog';
import { HlmButton } from '@egose/shadcn-theme-ng/button';

@Component({
  selector: 'app-confirmation-dialog-page',
  imports: [DemoHeaderComponent, HlmButton],
  template: `
    <app-demo-header title="Confirmation Dialog" description="A convenience service for confirm prompts." />

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
