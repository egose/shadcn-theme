import { Component } from '@angular/core';
import { DemoHeaderComponent } from '../../../shared/demo-header';
import { HlmProgress, HlmProgressIndicator } from '@egose/shadcn-theme-ng/progress';

@Component({
  selector: 'app-progress-page',
  imports: [DemoHeaderComponent, HlmProgress, HlmProgressIndicator],
  template: `
    <section class="tw:space-y-8">
      <app-demo-header
        title="Progress"
        description="Determinate progress indicators with labelled values, grouped into a checklist and a summary card."
      />

      <div class="tw:grid tw:gap-6 xl:tw:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
        <article class="tw:space-y-5 tw:rounded-[28px] tw:border tw:border-slate-200 tw:bg-white tw:p-6 tw:shadow-sm">
          <div>
            <p class="tw:text-xs tw:font-semibold tw:uppercase tw:tracking-[0.2em] tw:text-slate-500">
              Setup checklist
            </p>
            <h3 class="tw:mt-2 tw:text-xl tw:font-semibold tw:text-slate-950">Workspace setup checklist</h3>
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
            <h3 class="tw:mt-2 tw:text-lg tw:font-semibold tw:text-slate-900">Overall completion</h3>
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
              The summary bar aggregates the checklist values into one percentage.
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
      label: 'Connect data source',
      description: 'Attach a warehouse or database connection.',
      value: 100,
    },
    {
      label: 'Invite the team',
      description: 'At least three members have joined the workspace.',
      value: 72,
    },
    {
      label: 'Configure alerts',
      description: 'Enable anomaly alerts for key metrics.',
      value: 38,
    },
  ];
}
