import { Component } from '@angular/core';
import { HlmTextarea } from '@egose/shadcn-theme-ng/textarea';
import { HlmButton } from '@egose/shadcn-theme-ng/button';

@Component({
  selector: 'app-textarea-page',
  imports: [HlmTextarea, HlmButton],
  template: `
    <section class="tw:space-y-8">
      <div class="tw:max-w-3xl tw:space-y-3">
        <h3 class="tw:text-2xl tw:font-bold tw:text-slate-950">Textarea</h3>
        <p class="tw:text-sm tw:leading-7 tw:text-slate-600 sm:tw:text-base">
          Textareas are easier to judge when they show different writing intents, like a customer reply and an internal
          review note.
        </p>
      </div>

      <div class="tw:grid tw:gap-6 xl:tw:grid-cols-2">
        <article class="tw:rounded-[28px] tw:border tw:border-slate-200 tw:bg-white tw:p-6 tw:shadow-sm">
          <div>
            <p class="tw:text-xs tw:font-semibold tw:uppercase tw:tracking-[0.2em] tw:text-slate-500">Support reply</p>
            <h4 class="tw:mt-2 tw:text-lg tw:font-semibold tw:text-slate-900">Customer-facing message</h4>
          </div>

          <label class="tw:mt-5 tw:grid tw:gap-2">
            <span class="tw:text-sm tw:font-medium tw:text-slate-700">Response</span>
            <textarea hlmTextarea class="tw:min-h-[180px]" placeholder="Write your response">
Thanks for flagging the issue. We refreshed the examples to make the new packages easier to evaluate in realistic UI contexts.</textarea
            >
          </label>

          <div class="tw:mt-5 tw:flex tw:justify-end tw:gap-2">
            <button hlmButton variant="secondary" appearance="outline" type="button">Save draft</button>
            <button hlmButton type="button">Send reply</button>
          </div>
        </article>

        <article class="tw:rounded-[28px] tw:border tw:border-slate-200 tw:bg-slate-50 tw:p-6">
          <div>
            <p class="tw:text-xs tw:font-semibold tw:uppercase tw:tracking-[0.2em] tw:text-slate-500">Internal note</p>
            <h4 class="tw:mt-2 tw:text-lg tw:font-semibold tw:text-slate-900">Review summary</h4>
          </div>

          <label class="tw:mt-5 tw:grid tw:gap-2">
            <span class="tw:text-sm tw:font-medium tw:text-slate-700">Notes</span>
            <textarea hlmTextarea class="tw:min-h-[180px] tw:bg-white" placeholder="Capture the latest QA notes">
The textarea looks strongest when paired with a clear label, enough vertical height, and nearby actions. A single bare field undersold the component.</textarea
            >
          </label>

          <div class="tw:mt-5 tw:rounded-2xl tw:border tw:border-dashed tw:border-slate-300 tw:bg-white tw:p-4">
            <p class="tw:text-sm tw:leading-7 tw:text-slate-600">
              Long-form inputs benefit from enough padding around the field so the component does not feel cramped.
            </p>
          </div>
        </article>
      </div>
    </section>
  `,
})
export class TextareaPage {}
