import { Component } from '@angular/core';
import { HlmProgress, HlmProgressIndicator } from '@egose/shadcn-theme-ng/progress';

@Component({
  selector: 'app-progress-page',
  imports: [HlmProgress, HlmProgressIndicator],
  template: `
    <section class="tw:space-y-8">
      <div class="tw:max-w-3xl tw:space-y-3">
        <h3 class="tw:text-2xl tw:font-bold tw:text-slate-950">Progress</h3>
        <p class="tw:text-sm tw:leading-7 tw:text-slate-600 sm:tw:text-base">
          Progress bars are easier to judge when they appear in groups with labels, numbers, and a clear sense of task
          state instead of a single anonymous value.
        </p>
      </div>

      <div class="tw:grid tw:gap-6 xl:tw:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
        <article class="tw:space-y-5 tw:rounded-[28px] tw:border tw:border-slate-200 tw:bg-white tw:p-6 tw:shadow-sm">
          <div>
            <p class="tw:text-xs tw:font-semibold tw:uppercase tw:tracking-[0.2em] tw:text-slate-500">
              Release checklist
            </p>
            <h4 class="tw:mt-2 tw:text-xl tw:font-semibold tw:text-slate-950">Standard example refresh</h4>
          </div>

          <div class="tw:space-y-5">
            @for (step of steps; track step.label) {
              <div class="tw:space-y-2">
                <div class="tw:flex tw:items-center tw:justify-between tw:gap-3">
                  <div>
                    <p class="tw:text-sm tw:font-medium tw:text-slate-900">{{ step.label }}</p>
                    <p class="tw:text-sm tw:text-slate-500">{{ step.description }}</p>
                  </div>
                  <span class="tw:text-sm tw:font-semibold tw:text-slate-900">{{ step.value }}%</span>
                </div>

                <hlm-progress [value]="step.value">
                  <hlm-progress-indicator />
                </hlm-progress>
              </div>
            }
          </div>
        </article>

        <article class="tw:space-y-4 tw:rounded-[28px] tw:border tw:border-slate-200 tw:bg-slate-50 tw:p-6">
          <div>
            <p class="tw:text-xs tw:font-semibold tw:uppercase tw:tracking-[0.2em] tw:text-slate-500">Snapshot</p>
            <h4 class="tw:mt-2 tw:text-lg tw:font-semibold tw:text-slate-900">Overall completion</h4>
          </div>

          <div class="tw:rounded-3xl tw:border tw:border-slate-200 tw:bg-white tw:p-5">
            <div class="tw:flex tw:items-end tw:justify-between">
              <div>
                <p class="tw:text-xs tw:text-slate-500">Current milestone</p>
                <p class="tw:mt-2 tw:text-4xl tw:font-semibold tw:text-slate-950">65%</p>
              </div>
              <span
                class="tw:rounded-full tw:bg-emerald-100 tw:px-3 tw:py-1 tw:text-xs tw:font-medium tw:text-emerald-700"
              >
                On track
              </span>
            </div>

            <hlm-progress [value]="65" class="tw:mt-5">
              <hlm-progress-indicator />
            </hlm-progress>

            <p class="tw:mt-4 tw:text-sm tw:leading-6 tw:text-slate-600">
              The surrounding copy and metrics make it much easier to tell whether the bar feels appropriately weighted.
            </p>
          </div>
        </article>
      </div>
    </section>
  `,
})
export class ProgressPage {
  readonly steps = [
    {
      label: 'Shell polish',
      description: 'Header, search, sidebar, and gallery framing are in place.',
      value: 100,
    },
    {
      label: 'Sparse demos',
      description: 'Upgrade weak pages with stronger product-like scenarios.',
      value: 72,
    },
    {
      label: 'Final QA',
      description: 'Run another visual pass for spacing and tone consistency.',
      value: 38,
    },
  ];
}
