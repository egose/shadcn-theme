import { Component } from '@angular/core';
import { HlmEmptyImports } from '@egose/shadcn-theme-ng/empty';
import { HlmButton } from '@egose/shadcn-theme-ng/button';

@Component({
  selector: 'app-empty-page',
  imports: [HlmEmptyImports, HlmButton],
  template: `
    <section class="tw:space-y-8">
      <div class="tw:max-w-3xl tw:space-y-3">
        <h3 class="tw:text-2xl tw:font-bold tw:text-slate-950">Empty</h3>
        <p class="tw:text-sm tw:leading-7 tw:text-slate-600 sm:tw:text-base">
          Empty states look best when they explain what happened and suggest the next move. Showing a few real contexts
          makes the component feel much more solid than a single centered icon.
        </p>
      </div>

      <div class="tw:grid tw:gap-6 lg:tw:grid-cols-2 xl:tw:grid-cols-3">
        <article class="tw:rounded-3xl tw:border tw:border-slate-200 tw:bg-slate-50 tw:p-4">
          <div hlmEmpty class="tw:min-h-[320px] tw:border-slate-200 tw:bg-white">
            <div hlmEmptyHeader>
              <div hlmEmptyMedia variant="icon">🔎</div>
              <h4 hlmEmptyTitle>No matching invoices</h4>
              <p hlmEmptyDescription>The current filters hide every result in this workspace.</p>
            </div>
            <div hlmEmptyContent>
              <button hlmButton variant="secondary" appearance="outline" type="button">Clear filters</button>
            </div>
          </div>
        </article>

        <article class="tw:rounded-3xl tw:border tw:border-slate-200 tw:bg-slate-50 tw:p-4">
          <div hlmEmpty class="tw:min-h-[320px] tw:border-slate-200 tw:bg-white">
            <div hlmEmptyHeader>
              <div hlmEmptyMedia variant="icon">👥</div>
              <h4 hlmEmptyTitle>Your team is empty</h4>
              <p hlmEmptyDescription>Invite collaborators to start sharing reviews, approvals, and releases.</p>
            </div>
            <div hlmEmptyContent class="tw:items-center">
              <div class="tw:flex tw:flex-wrap tw:justify-center tw:gap-2">
                <button hlmButton type="button">Invite teammates</button>
                <button hlmButton variant="secondary" appearance="outline" type="button">Copy invite link</button>
              </div>
            </div>
          </div>
        </article>

        <article
          class="tw:rounded-3xl tw:border tw:border-slate-200 tw:bg-slate-950 tw:p-4 lg:tw:col-span-2 xl:tw:col-span-1"
        >
          <div hlmEmpty class="tw:min-h-[320px] tw:border-slate-700 tw:bg-slate-900 tw:text-white">
            <div hlmEmptyHeader>
              <div hlmEmptyMedia variant="icon" class="tw:bg-slate-800 tw:text-slate-100">🛒</div>
              <h4 hlmEmptyTitle class="tw:text-white">Nothing in your cart</h4>
              <p hlmEmptyDescription class="tw:text-slate-300">
                Save components to compare pricing, variants, and implementation details before checkout.
              </p>
            </div>
            <div hlmEmptyContent>
              <button hlmButton variant="light" type="button">Browse components</button>
            </div>
          </div>
        </article>
      </div>
    </section>
  `,
})
export class EmptyPage {}
