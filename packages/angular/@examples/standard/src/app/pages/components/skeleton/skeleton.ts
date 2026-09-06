import { Component } from '@angular/core';
import { DemoHeaderComponent } from '../../../shared/demo-header';
import { HlmSkeleton } from '@egose/shadcn-theme-ng/skeleton';

@Component({
  selector: 'app-skeleton-page',
  imports: [DemoHeaderComponent, HlmSkeleton],
  template: `
    <section class="tw:space-y-8">
      <app-demo-header
        title="Skeleton"
        description="Placeholder blocks that mirror a loading screen: profile header, metric cards, chart, and activity list."
      />

      <div class="tw:grid tw:gap-6 xl:tw:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
        <article class="tw:space-y-6 tw:rounded-[28px] tw:border tw:border-slate-200 tw:bg-white tw:p-6 tw:shadow-sm">
          <div class="tw:flex tw:items-center tw:gap-4">
            <hlm-skeleton class="tw:h-14 tw:w-14 tw:rounded-full" />
            <div class="tw:flex tw:flex-1 tw:flex-col tw:gap-2">
              <hlm-skeleton class="tw:h-4 tw:w-full tw:max-w-40" />
              <hlm-skeleton class="tw:h-4 tw:w-full tw:max-w-64" />
            </div>
          </div>

          <div class="tw:grid tw:gap-4 lg:tw:grid-cols-3">
            @for (width of ['tw:w-20', 'tw:w-24', 'tw:w-16']; track width) {
              <div class="tw:rounded-2xl tw:border tw:border-slate-200 tw:bg-slate-50 tw:p-4">
                <hlm-skeleton class="tw:h-3 tw:w-16" />
                <hlm-skeleton class="tw:mt-4 tw:h-8" [class]="width" />
              </div>
            }
          </div>

          <div class="tw:rounded-3xl tw:border tw:border-slate-200 tw:bg-slate-50 tw:p-5">
            <div class="tw:flex tw:items-end tw:gap-3 tw:h-44">
              <hlm-skeleton class="tw:h-20 tw:flex-1 tw:rounded-2xl" />
              <hlm-skeleton class="tw:h-32 tw:flex-1 tw:rounded-2xl" />
              <hlm-skeleton class="tw:h-24 tw:flex-1 tw:rounded-2xl" />
              <hlm-skeleton class="tw:h-40 tw:flex-1 tw:rounded-2xl" />
              <hlm-skeleton class="tw:h-28 tw:flex-1 tw:rounded-2xl" />
            </div>
          </div>
        </article>

        <article class="tw:space-y-4 tw:rounded-[28px] tw:border tw:border-slate-200 tw:bg-slate-50 tw:p-6">
          <div>
            <p class="tw:text-xs tw:font-semibold tw:uppercase tw:tracking-[0.2em] tw:text-slate-500">Loading feed</p>
            <h3 class="tw:mt-2 tw:text-lg tw:font-semibold tw:text-slate-900">Activity list placeholder</h3>
          </div>

          @for (item of [1, 2, 3, 4]; track item) {
            <div
              class="tw:flex tw:items-start tw:gap-4 tw:rounded-2xl tw:border tw:border-slate-200 tw:bg-white tw:p-4"
            >
              <hlm-skeleton class="tw:h-10 tw:w-10 tw:rounded-full" />
              <div class="tw:flex tw:flex-1 tw:flex-col tw:gap-2">
                <hlm-skeleton class="tw:h-4 tw:w-full tw:max-w-32" />
                <hlm-skeleton class="tw:h-4 tw:w-full" />
                <hlm-skeleton class="tw:h-4 tw:w-2/3" />
              </div>
            </div>
          }
        </article>
      </div>
    </section>
  `,
})
export class SkeletonPage {}
