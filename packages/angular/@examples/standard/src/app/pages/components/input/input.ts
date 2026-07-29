import { Component } from '@angular/core';
import { HlmInput } from '@egose/shadcn-theme-ng/input';
import { HlmButton } from '@egose/shadcn-theme-ng/button';

@Component({
  selector: 'app-input-page',
  imports: [HlmInput, HlmButton],
  template: `
    <section class="tw:space-y-8">
      <div class="tw:max-w-3xl tw:space-y-3">
        <h3 class="tw:text-2xl tw:font-bold tw:text-slate-950">Input</h3>
        <p class="tw:text-sm tw:leading-7 tw:text-slate-600 sm:tw:text-base">
          Inputs look more trustworthy when they appear inside realistic account and filter forms instead of a bare list
          of field types.
        </p>
      </div>

      <div class="tw:grid tw:gap-6 xl:tw:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
        <article class="tw:rounded-[28px] tw:border tw:border-slate-200 tw:bg-white tw:p-6 tw:shadow-sm">
          <div>
            <p class="tw:text-xs tw:font-semibold tw:uppercase tw:tracking-[0.2em] tw:text-slate-500">Profile form</p>
            <h4 class="tw:mt-2 tw:text-lg tw:font-semibold tw:text-slate-900">Account details</h4>
          </div>

          <div class="tw:mt-5 tw:grid tw:gap-4 sm:tw:grid-cols-2">
            <label class="tw:grid tw:gap-2">
              <span class="tw:text-sm tw:font-medium tw:text-slate-700">First name</span>
              <input hlmInput placeholder="Jane" value="Jane" />
            </label>
            <label class="tw:grid tw:gap-2">
              <span class="tw:text-sm tw:font-medium tw:text-slate-700">Last name</span>
              <input hlmInput placeholder="Hahn" value="Hahn" />
            </label>
            <label class="tw:grid tw:gap-2 sm:tw:col-span-2">
              <span class="tw:text-sm tw:font-medium tw:text-slate-700">Email address</span>
              <input hlmInput type="email" placeholder="jane@egose.dev" value="jane@egose.dev" />
            </label>
            <label class="tw:grid tw:gap-2 sm:tw:col-span-2">
              <span class="tw:text-sm tw:font-medium tw:text-slate-700">Password</span>
              <input hlmInput type="password" value="password" />
            </label>
          </div>

          <div class="tw:mt-5 tw:flex tw:justify-end tw:gap-2">
            <button hlmButton variant="secondary" appearance="outline" type="button">Cancel</button>
            <button hlmButton type="button">Save changes</button>
          </div>
        </article>

        <article class="tw:rounded-[28px] tw:border tw:border-slate-200 tw:bg-slate-50 tw:p-6">
          <div>
            <p class="tw:text-xs tw:font-semibold tw:uppercase tw:tracking-[0.2em] tw:text-slate-500">Filters</p>
            <h4 class="tw:mt-2 tw:text-lg tw:font-semibold tw:text-slate-900">Search and disabled states</h4>
          </div>

          <div class="tw:mt-5 tw:grid tw:gap-4">
            <input hlmInput placeholder="Search by component name" value="alert" />
            <input hlmInput placeholder="Invite code" value="STD-2026-QA" />
            <input hlmInput placeholder="Disabled input" disabled value="Coming soon" />
          </div>

          <div class="tw:mt-5 tw:rounded-2xl tw:border tw:border-dashed tw:border-slate-300 tw:bg-white tw:p-4">
            <p class="tw:text-sm tw:leading-7 tw:text-slate-600">
              Seeing inputs in both full forms and compact filters makes spacing, placeholder tone, and disabled styling
              much easier to review.
            </p>
          </div>
        </article>
      </div>
    </section>
  `,
})
export class InputPage {}
