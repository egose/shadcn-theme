import { Component } from '@angular/core';
import { HlmNativeSelectImports } from '@egose/shadcn-theme-ng/native-select';
import { HlmButton } from '@egose/shadcn-theme-ng/button';

@Component({
  selector: 'app-native-select-page',
  imports: [HlmNativeSelectImports, HlmButton],
  template: `
    <section class="tw:space-y-8">
      <div class="tw:max-w-3xl tw:space-y-3">
        <h3 class="tw:text-2xl tw:font-bold tw:text-slate-950">Native Select</h3>
        <p class="tw:text-sm tw:leading-7 tw:text-slate-600 sm:tw:text-base">
          Native selects are most useful in settings and quick forms where reliability matters more than custom search.
        </p>
      </div>

      <div class="tw:grid tw:gap-6 xl:tw:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
        <article class="tw:rounded-[28px] tw:border tw:border-slate-200 tw:bg-white tw:p-6 tw:shadow-sm">
          <div>
            <p class="tw:text-xs tw:font-semibold tw:uppercase tw:tracking-[0.2em] tw:text-slate-500">
              Project settings
            </p>
            <h4 class="tw:mt-2 tw:text-lg tw:font-semibold tw:text-slate-900">Default workspace preferences</h4>
          </div>

          <div class="tw:mt-5 tw:grid tw:gap-4 sm:tw:grid-cols-2">
            <label class="tw:grid tw:gap-2">
              <span class="tw:text-sm tw:font-medium tw:text-slate-700">Theme</span>
              <hlm-native-select>
                <option value="light">Light</option>
                <option value="system" selected>System</option>
                <option value="dark">Dark</option>
              </hlm-native-select>
            </label>

            <label class="tw:grid tw:gap-2">
              <span class="tw:text-sm tw:font-medium tw:text-slate-700">Review cadence</span>
              <hlm-native-select>
                <option value="daily">Daily</option>
                <option value="weekly" selected>Weekly</option>
                <option value="monthly">Monthly</option>
              </hlm-native-select>
            </label>
          </div>

          <div class="tw:mt-5 tw:flex tw:justify-end tw:gap-2">
            <button hlmButton variant="secondary" appearance="outline" type="button">Reset</button>
            <button hlmButton type="button">Save settings</button>
          </div>
        </article>

        <article class="tw:rounded-[28px] tw:border tw:border-slate-200 tw:bg-slate-50 tw:p-6">
          <div>
            <p class="tw:text-xs tw:font-semibold tw:uppercase tw:tracking-[0.2em] tw:text-slate-500">Quick example</p>
            <h4 class="tw:mt-2 tw:text-lg tw:font-semibold tw:text-slate-900">Simple one-field picker</h4>
          </div>

          <div class="tw:mt-5 tw:grid tw:gap-3">
            <hlm-native-select>
              <option value="" disabled>Select a fruit</option>
              <option value="apple" selected>Apple</option>
              <option value="banana">Banana</option>
              <option value="cherry">Cherry</option>
            </hlm-native-select>
          </div>

          <div class="tw:mt-5 tw:rounded-2xl tw:border tw:border-dashed tw:border-slate-300 tw:bg-white tw:p-4">
            <p class="tw:text-sm tw:leading-7 tw:text-slate-600">
              Showing both a standalone picker and a settings form makes it easier to evaluate spacing and label
              pairing.
            </p>
          </div>
        </article>
      </div>
    </section>
  `,
})
export class NativeSelectPage {}
