import { Component, input, output } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { EgBasicAlert } from '@egose/shadcn-theme-ng/basic-alert';
import { HlmButton } from '@egose/shadcn-theme-ng/button';
import { HlmLabel } from '@egose/shadcn-theme-ng/label';
import { HlmTextarea } from '@egose/shadcn-theme-ng/textarea';
import { EXAMPLE_READ_ONLY_MESSAGE } from '../../../../shared/real-examples/example-view-state';
import type { SupportTicket, TicketReplyState } from '../support-inbox-types';

@Component({
  selector: 'app-support-ticket-composer',
  imports: [ReactiveFormsModule, EgBasicAlert, HlmButton, HlmLabel, HlmTextarea],
  templateUrl: './ticket-composer.html',
  host: { class: 'tw:block tw:min-w-0' },
})
export class SupportTicketComposerComponent {
  readonly ticket = input.required<SupportTicket>();
  readonly reply = input.required<TicketReplyState>();
  readonly readOnly = input(false);
  readonly simulateFailure = input(false);
  readonly failureChange = output<boolean>();
  readonly send = output<void>();
  readonly resolve = output<void>();
  readonly reopen = output<void>();
  protected readonly READ_ONLY_MESSAGE = EXAMPLE_READ_ONLY_MESSAGE;

  protected bodyError(): string | null {
    const control = this.reply().form.controls.body;
    if (!control.touched || control.valid || control.disabled) return null;
    if (control.hasError('required')) return 'Write a reply before sending';
    if (control.hasError('minlength')) return 'Use at least 2 characters for the reply';
    return 'Use no more than 2000 characters for the reply';
  }
}
