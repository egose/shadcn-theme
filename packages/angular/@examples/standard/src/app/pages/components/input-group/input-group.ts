import { Component } from '@angular/core';
import { HlmInputGroupImports } from '@egose/shadcn-theme-ng/input-group';

@Component({
  selector: 'app-input-group-page',
  imports: [HlmInputGroupImports],
  template: `
    <section class="tw:space-y-8">
      <div class="tw:max-w-3xl tw:space-y-3">
        <h3 class="tw:text-2xl tw:font-bold tw:text-slate-950">Input Group</h3>
        <p class="tw:text-sm tw:leading-7 tw:text-slate-600 sm:tw:text-base">
          Input groups work best when the surrounding controls feel like one unit. These examples show prefixes, inline
          actions, and block add-ons in more realistic layouts.
        </p>
      </div>

      <div class="tw:grid tw:gap-6 xl:tw:grid-cols-2">
        <article class="tw:space-y-4 tw:rounded-3xl tw:border tw:border-slate-200 tw:bg-slate-50 tw:p-6">
          <div class="tw:space-y-1">
            <h4 class="tw:text-base tw:font-semibold tw:text-slate-900">Budget adjustment</h4>
            <p class="tw:text-sm tw:text-slate-500">Inline prefix and action button for compact financial forms.</p>
          </div>

          <div hlmInputGroup class="tw:flex tw:max-w-md tw:items-center tw:bg-white">
            <span hlmInputGroupText>$</span>
            <input hlmInputGroupInput placeholder="Monthly budget" type="number" value="249" />
            <button hlmInputGroupButton type="button">Apply</button>
          </div>

          <div class="tw:flex tw:flex-wrap tw:gap-2 tw:text-xs tw:text-slate-500">
            <span class="tw:rounded-full tw:bg-white tw:px-2.5 tw:py-1 tw:ring-1 tw:ring-slate-200"
              >Currency prefix</span
            >
            <span class="tw:rounded-full tw:bg-white tw:px-2.5 tw:py-1 tw:ring-1 tw:ring-slate-200">Single action</span>
          </div>
        </article>

        <article class="tw:space-y-4 tw:rounded-3xl tw:border tw:border-slate-200 tw:bg-slate-50 tw:p-6">
          <div class="tw:space-y-1">
            <h4 class="tw:text-base tw:font-semibold tw:text-slate-900">Public share link</h4>
            <p class="tw:text-sm tw:text-slate-500">Good for slugs, subdomains, and generated identifiers.</p>
          </div>

          <div hlmInputGroup class="tw:flex tw:max-w-xl tw:items-center tw:bg-white">
            <span hlmInputGroupText>https://egose.dev/</span>
            <input hlmInputGroupInput placeholder="campaign-spring" value="angular-standard" />
            <span hlmInputGroupText>.html</span>
          </div>

          <div class="tw:grid tw:gap-3 sm:tw:grid-cols-2">
            <div class="tw:rounded-2xl tw:border tw:border-slate-200 tw:bg-white tw:p-4">
              <p class="tw:text-xs tw:font-medium tw:text-slate-500">Validation</p>
              <p class="tw:mt-1 tw:text-sm tw:text-slate-700">Text stays aligned even with multiple add-ons.</p>
            </div>
            <div class="tw:rounded-2xl tw:border tw:border-slate-200 tw:bg-white tw:p-4">
              <p class="tw:text-xs tw:font-medium tw:text-slate-500">Typical use</p>
              <p class="tw:mt-1 tw:text-sm tw:text-slate-700">Campaign URLs, invite links, and app slugs.</p>
            </div>
          </div>
        </article>
      </div>

      <article class="tw:space-y-4 tw:rounded-3xl tw:border tw:border-slate-200 tw:bg-slate-950 tw:p-6 tw:text-white">
        <div class="tw:space-y-1">
          <h4 class="tw:text-base tw:font-semibold">Structured message composer</h4>
          <p class="tw:text-sm tw:text-slate-300">
            Block add-ons help label larger inputs without breaking the field shape.
          </p>
        </div>

        <div hlmInputGroup class="tw:min-h-36 tw:max-w-3xl tw:bg-slate-900 tw:text-white tw:border-slate-700">
          <div hlmInputGroupAddon align="block-start" class="tw:text-slate-300">Message to design-review</div>
          <textarea
            hlmInputGroupTextarea
            rows="4"
            class="tw:text-white tw:placeholder:text-slate-500"
            placeholder="Describe what feels off in the new UI packages..."
          >
The new input and empty-state examples need more realistic spacing and stronger visual anchors.</textarea
          >
          <div
            hlmInputGroupAddon
            align="block-end"
            class="tw:flex tw:items-center tw:justify-between tw:text-slate-400"
          >
            <span>Draft autosaved just now</span>
            <button hlmInputGroupButton type="button" class="tw:text-slate-100">Send</button>
          </div>
        </div>
      </article>
    </section>
  `,
})
export class InputGroupPage {}
