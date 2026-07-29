import { Component } from '@angular/core';
import {
  HlmCard,
  HlmCardAction,
  HlmCardHeader,
  HlmCardTitle,
  HlmCardDescription,
  HlmCardContent,
  HlmCardFooter,
} from '@egose/shadcn-theme-ng/card';
import { HlmButton } from '@egose/shadcn-theme-ng/button';

@Component({
  selector: 'app-card-page',
  imports: [
    HlmCard,
    HlmCardAction,
    HlmCardHeader,
    HlmCardTitle,
    HlmCardDescription,
    HlmCardContent,
    HlmCardFooter,
    HlmButton,
  ],
  template: `
    <section class="tw:space-y-8">
      <div class="tw:max-w-3xl tw:space-y-3">
        <h3 class="tw:text-2xl tw:font-bold tw:text-slate-950">Card</h3>
        <p class="tw:text-sm tw:leading-7 tw:text-slate-600 sm:tw:text-base">
          Cards are most useful when they carry hierarchy, utility actions, and meaningful content density. These
          examples show the same primitive in dashboard, review, and summary contexts.
        </p>
      </div>

      <div class="tw:grid tw:gap-6 xl:tw:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
        <div class="tw:grid tw:gap-6 lg:tw:grid-cols-2">
          <article hlmCard class="tw:border-slate-200 tw:bg-white tw:shadow-sm">
            <div hlmCardHeader>
              <button hlmCardAction hlmButton variant="secondary" appearance="outline" size="sm" type="button">
                Draft
              </button>
              <div hlmCardTitle>Release readiness</div>
              <div hlmCardDescription>Track the final review items before shipping the refreshed examples.</div>
            </div>

            <div hlmCardContent class="tw:space-y-4">
              <div class="tw:grid tw:grid-cols-3 tw:gap-3">
                <div class="tw:rounded-2xl tw:border tw:border-slate-200 tw:bg-slate-50 tw:p-4">
                  <p class="tw:text-xs tw:text-slate-500">Components</p>
                  <p class="tw:mt-2 tw:text-2xl tw:font-semibold tw:text-slate-950">68</p>
                </div>
                <div class="tw:rounded-2xl tw:border tw:border-slate-200 tw:bg-slate-50 tw:p-4">
                  <p class="tw:text-xs tw:text-slate-500">Reviewed</p>
                  <p class="tw:mt-2 tw:text-2xl tw:font-semibold tw:text-slate-950">52</p>
                </div>
                <div class="tw:rounded-2xl tw:border tw:border-slate-200 tw:bg-slate-50 tw:p-4">
                  <p class="tw:text-xs tw:text-slate-500">Blocked</p>
                  <p class="tw:mt-2 tw:text-2xl tw:font-semibold tw:text-slate-950">4</p>
                </div>
              </div>

              <div class="tw:rounded-2xl tw:border tw:border-dashed tw:border-slate-300 tw:bg-slate-50 tw:p-4">
                <p class="tw:text-sm tw:leading-7 tw:text-slate-600">
                  The card supports a quick status action in the header without collapsing the title and description.
                </p>
              </div>
            </div>

            <div hlmCardFooter class="tw:gap-2 tw:justify-between">
              <span class="tw:text-sm tw:text-slate-500">Last updated 12 minutes ago</span>
              <div class="tw:flex tw:gap-2">
                <button hlmButton variant="secondary" appearance="outline" type="button">Review</button>
                <button hlmButton variant="primary" type="button">Ship changes</button>
              </div>
            </div>
          </article>

          <article hlmCard class="tw:border-slate-200 tw:bg-slate-950 tw:text-white tw:shadow-sm">
            <div hlmCardHeader>
              <span
                hlmCardAction
                class="tw:rounded-full tw:bg-white/10 tw:px-3 tw:py-1 tw:text-xs tw:font-medium tw:text-slate-200"
              >
                Premium
              </span>
              <div hlmCardTitle class="tw:text-white">Design review subscription</div>
              <div hlmCardDescription class="tw:text-slate-300">
                A pricing-style card shows how the primitive handles denser copy and emphasis.
              </div>
            </div>

            <div hlmCardContent class="tw:space-y-4">
              <div>
                <p class="tw:text-4xl tw:font-semibold">$24</p>
                <p class="tw:mt-1 tw:text-sm tw:text-slate-400">per editor / month</p>
              </div>

              <div class="tw:space-y-2">
                @for (feature of premiumFeatures; track feature) {
                  <div
                    class="tw:flex tw:items-center tw:gap-3 tw:rounded-xl tw:bg-white/5 tw:px-3 tw:py-2 tw:text-sm tw:text-slate-200"
                  >
                    <span class="tw:h-2 tw:w-2 tw:rounded-full tw:bg-emerald-400"></span>
                    <span>{{ feature }}</span>
                  </div>
                }
              </div>
            </div>

            <div hlmCardFooter class="tw:gap-2 tw:flex-col sm:tw:flex-row sm:tw:justify-between">
              <button hlmButton variant="light" type="button">Start trial</button>
              <button hlmButton variant="secondary" appearance="outline" type="button">Compare plans</button>
            </div>
          </article>
        </div>

        <article hlmCard class="tw:border-slate-200 tw:bg-slate-50 tw:shadow-sm">
          <div hlmCardHeader>
            <div hlmCardTitle>Review summary</div>
            <div hlmCardDescription>Cards also work well as stacked summary panels beside a primary workflow.</div>
          </div>

          <div hlmCardContent class="tw:space-y-4">
            @for (summary of summaries; track summary.label) {
              <div class="tw:rounded-2xl tw:border tw:border-slate-200 tw:bg-white tw:p-4">
                <div class="tw:flex tw:items-start tw:justify-between tw:gap-4">
                  <div>
                    <p class="tw:text-sm tw:font-medium tw:text-slate-900">{{ summary.label }}</p>
                    <p class="tw:mt-1 tw:text-sm tw:leading-6 tw:text-slate-500">{{ summary.description }}</p>
                  </div>
                  <span class="tw:text-lg tw:font-semibold tw:text-slate-950">{{ summary.value }}</span>
                </div>
              </div>
            }
          </div>

          <div hlmCardFooter class="tw:justify-end">
            <button hlmButton variant="secondary" appearance="outline" type="button">Open report</button>
          </div>
        </article>
      </div>
    </section>
  `,
})
export class CardPage {
  readonly premiumFeatures = ['Unlimited review boards', 'Shared component audits', 'Release checklists'];

  readonly summaries = [
    {
      label: 'Examples refreshed',
      value: '18',
      description: 'Pages updated to show realistic spacing, actions, and hierarchy.',
    },
    {
      label: 'Open follow-ups',
      value: '4',
      description: 'A few demos still need another polish pass for edge-case states.',
    },
    {
      label: 'Team confidence',
      value: 'High',
      description: 'The cards now communicate package quality much more clearly in review.',
    },
  ];
}
