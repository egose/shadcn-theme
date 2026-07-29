import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-components',
  imports: [RouterOutlet],
  template: `
    <section class="tw:mx-auto tw:w-full tw:max-w-7xl tw:space-y-6">
      <div class="tw:rounded-[28px] tw:border tw:border-slate-200 tw:bg-white tw:p-6 tw:shadow-sm sm:tw:p-8">
        <div class="tw:flex tw:flex-col tw:gap-6 lg:tw:flex-row lg:tw:items-end lg:tw:justify-between">
          <div class="tw:max-w-3xl tw:space-y-3">
            <p class="tw:text-xs tw:font-semibold tw:uppercase tw:tracking-[0.24em] tw:text-slate-500">
              Angular Standard Example
            </p>
            <h1 class="tw:text-3xl tw:font-semibold tw:tracking-tight tw:text-slate-950 sm:tw:text-4xl">
              Component gallery with real page spacing
            </h1>
            <p class="tw:text-sm tw:leading-7 tw:text-slate-600 sm:tw:text-base">
              Each route renders a packaged @egose/shadcn-theme-ng component inside a polished shell so new additions are
              easier to judge in context.
            </p>
          </div>

          <div class="tw:grid tw:gap-3 sm:tw:grid-cols-2">
            <div class="tw:rounded-2xl tw:border tw:border-slate-200 tw:bg-slate-50 tw:px-4 tw:py-3">
              <p class="tw:text-xs tw:font-medium tw:text-slate-500">Navigation</p>
              <p class="tw:mt-1 tw:text-sm tw:text-slate-700">Browse categories from the top bar or search directly.</p>
            </div>
            <div class="tw:rounded-2xl tw:border tw:border-slate-200 tw:bg-slate-50 tw:px-4 tw:py-3">
              <p class="tw:text-xs tw:font-medium tw:text-slate-500">Focus</p>
              <p class="tw:mt-1 tw:text-sm tw:text-slate-700">Pages now render full-width instead of floating in the middle.</p>
            </div>
          </div>
        </div>
      </div>

      <div class="tw:rounded-[28px] tw:border tw:border-slate-200 tw:bg-white tw:p-5 tw:shadow-sm sm:tw:p-8">
        <router-outlet />
      </div>
    </section>
  `,
})
export class ComponentsLayout {}
