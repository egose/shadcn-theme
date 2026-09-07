import { Component, signal } from '@angular/core';
import { DemoHeaderComponent } from '../../../shared/demo-header';
import { HlmTextarea } from '@egose/shadcn-theme-ng/textarea';
import { HlmButton } from '@egose/shadcn-theme-ng/button';

@Component({
  selector: 'app-textarea-page',
  imports: [DemoHeaderComponent, HlmTextarea, HlmButton],
  template: `
    <section class="tw:space-y-8">
      <app-demo-header
        title="Textarea"
        description="Multi-line text inputs shown in two contexts: a customer support reply and an internal review note."
      />

      <div class="tw:grid tw:gap-6 xl:tw:grid-cols-2">
        <article class="tw:rounded-[28px] tw:border tw:border-slate-200 tw:bg-white tw:p-6 tw:shadow-sm">
          <div>
            <p class="tw:text-xs tw:font-semibold tw:uppercase tw:tracking-[0.2em] tw:text-slate-500">Support reply</p>
            <h3 class="tw:mt-2 tw:text-lg tw:font-semibold tw:text-slate-900">Customer-facing message</h3>
          </div>

          <label class="tw:mt-5 tw:grid tw:gap-2">
            <span class="tw:text-sm tw:font-medium tw:text-slate-700">Response</span>
            <textarea hlmTextarea class="tw:min-h-[180px]" placeholder="Write your response">
Thanks for flagging this. I can reproduce the problem on our side and have opened a ticket with the team.</textarea
            >
          </label>

          <div class="tw:mt-5 tw:flex tw:justify-end tw:gap-2">
            <button
              hlmButton
              variant="secondary"
              appearance="outline"
              type="button"
              (click)="note('Reply saved as a draft.')"
            >
              Save draft
            </button>
            <button hlmButton type="button" (click)="note('Reply sent to the customer thread.')">Send reply</button>
          </div>
        </article>

        <article class="tw:rounded-[28px] tw:border tw:border-slate-200 tw:bg-slate-50 tw:p-6">
          <div>
            <p class="tw:text-xs tw:font-semibold tw:uppercase tw:tracking-[0.2em] tw:text-slate-500">Internal note</p>
            <h3 class="tw:mt-2 tw:text-lg tw:font-semibold tw:text-slate-900">Internal review note</h3>
          </div>

          <label class="tw:mt-5 tw:grid tw:gap-2">
            <span class="tw:text-sm tw:font-medium tw:text-slate-700">Notes</span>
            <textarea hlmTextarea class="tw:min-h-[180px] tw:bg-white" placeholder="Capture the latest QA notes">
Follow up with the customer on Monday once the fix ships; keep the thread linked to ticket #4821.</textarea
            >
          </label>

          <div class="tw:mt-5 tw:rounded-2xl tw:border tw:border-dashed tw:border-slate-300 tw:bg-white tw:p-4">
            <p class="tw:text-sm tw:leading-7 tw:text-slate-600">
              Long-form inputs benefit from enough padding around the field so the component does not feel cramped.
            </p>
          </div>
        </article>
      </div>

      @if (textareaMessage()) {
        <p role="status" class="tw:text-sm tw:text-slate-600">{{ textareaMessage() }}</p>
      }
    </section>
  `,
})
export class TextareaPage {
  readonly textareaMessage = signal<string | null>(null);

  note(message: string) {
    this.textareaMessage.set(message);
  }
}
