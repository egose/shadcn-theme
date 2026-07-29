import { Component } from '@angular/core';
import { BrnSelectImports } from '@spartan-ng/brain/select';
import { HlmSelectImports } from '@egose/shadcn-theme-ng/select';

@Component({
  selector: 'app-select-page',
  imports: [BrnSelectImports, HlmSelectImports],
  template: `
    <section class="tw:space-y-8">
      <div class="tw:max-w-3xl tw:space-y-3">
        <h3 class="tw:text-2xl tw:font-bold tw:text-slate-950">Select</h3>
        <p class="tw:text-sm tw:leading-7 tw:text-slate-600 sm:tw:text-base">
          Selects are more useful to evaluate when paired with labels and grouped into simple settings or filtering
          flows.
        </p>
      </div>

      <div class="tw:grid tw:gap-6 xl:tw:grid-cols-2">
        <article class="tw:rounded-[28px] tw:border tw:border-slate-200 tw:bg-white tw:p-6 tw:shadow-sm">
          <div>
            <p class="tw:text-xs tw:font-semibold tw:uppercase tw:tracking-[0.2em] tw:text-slate-500">Settings</p>
            <h4 class="tw:mt-2 tw:text-lg tw:font-semibold tw:text-slate-900">Workspace preferences</h4>
          </div>

          <div class="tw:mt-5 tw:grid tw:gap-4 sm:tw:grid-cols-2">
            <label class="tw:grid tw:gap-2">
              <span class="tw:text-sm tw:font-medium tw:text-slate-700">Priority</span>
              <div hlmSelect class="tw:inline-flex">
                <hlm-select-trigger class="tw:w-full">
                  <hlm-select-value placeholder="Choose priority" />
                </hlm-select-trigger>
                <hlm-select-content>
                  <hlm-select-item value="low">Low</hlm-select-item>
                  <hlm-select-item value="medium">Medium</hlm-select-item>
                  <hlm-select-item value="high">High</hlm-select-item>
                </hlm-select-content>
              </div>
            </label>

            <label class="tw:grid tw:gap-2">
              <span class="tw:text-sm tw:font-medium tw:text-slate-700">Owner</span>
              <div hlmSelect class="tw:inline-flex">
                <hlm-select-trigger class="tw:w-full">
                  <hlm-select-value placeholder="Assign owner" />
                </hlm-select-trigger>
                <hlm-select-content>
                  <hlm-select-item value="jahn">J. Hahn</hlm-select-item>
                  <hlm-select-item value="chen">N. Chen</hlm-select-item>
                  <hlm-select-item value="patel">A. Patel</hlm-select-item>
                </hlm-select-content>
              </div>
            </label>
          </div>
        </article>

        <article class="tw:rounded-[28px] tw:border tw:border-slate-200 tw:bg-slate-50 tw:p-6">
          <div>
            <p class="tw:text-xs tw:font-semibold tw:uppercase tw:tracking-[0.2em] tw:text-slate-500">Simple example</p>
            <h4 class="tw:mt-2 tw:text-lg tw:font-semibold tw:text-slate-900">Basic option list</h4>
          </div>

          <div class="tw:mt-5 tw:w-[280px]">
            <div hlmSelect class="tw:inline-flex">
              <hlm-select-trigger class="tw:w-full">
                <hlm-select-value placeholder="Select a fruit" />
              </hlm-select-trigger>
              <hlm-select-content>
                <hlm-select-item value="apple">Apple</hlm-select-item>
                <hlm-select-item value="banana">Banana</hlm-select-item>
                <hlm-select-item value="cherry">Cherry</hlm-select-item>
              </hlm-select-content>
            </div>
          </div>
        </article>
      </div>
    </section>
  `,
})
export class SelectPage {}
