import { Component, signal } from '@angular/core';
import { DemoHeaderComponent } from '../../../shared/demo-header';
import { DemoSectionComponent } from '../../../shared/demo-section';
import { HlmInputGroupImports } from '@egose/shadcn-theme-ng/input-group';

@Component({
  selector: 'app-input-group-page',
  imports: [DemoHeaderComponent, DemoSectionComponent, HlmInputGroupImports],
  template: `
    <section class="tw:space-y-8">
      <app-demo-header
        title="Input Group"
        description="Inputs combined with text prefixes, suffixes, add-ons, and inline action buttons."
      />

      <div class="tw:grid tw:gap-6 xl:tw:grid-cols-2">
        <!-- min-w-0 lets each card shrink to its grid track: without it the joined
          prefix/input/suffix row forces its min-content width onto the track at 320px. -->
        <app-demo-section
          class="tw:min-w-0 tw:rounded-3xl tw:border tw:border-slate-200 tw:bg-slate-50 tw:p-6"
          title="Budget adjustment"
          description="Inline prefix and action button for compact financial forms."
        >
          <div hlmInputGroup class="tw:flex tw:max-w-md tw:items-center tw:bg-white">
            <span hlmInputGroupText>$</span>
            <input
              hlmInputGroupInput
              class="tw:min-w-0"
              placeholder="Monthly budget"
              aria-label="Monthly budget in dollars"
              type="number"
              value="249"
            />
            <button hlmInputGroupButton type="button" (click)="applyBudget()">Apply</button>
          </div>

          @if (budgetMessage()) {
            <p role="status" class="tw:mt-3 tw:text-sm tw:text-slate-600">{{ budgetMessage() }}</p>
          }

          <div class="tw:flex tw:flex-wrap tw:gap-2 tw:text-xs tw:text-slate-500">
            <span class="tw:rounded-full tw:bg-white tw:px-2.5 tw:py-1 tw:ring-1 tw:ring-slate-200"
              >Currency prefix</span
            >
            <span class="tw:rounded-full tw:bg-white tw:px-2.5 tw:py-1 tw:ring-1 tw:ring-slate-200">Single action</span>
          </div>
        </app-demo-section>

        <app-demo-section
          class="tw:min-w-0 tw:rounded-3xl tw:border tw:border-slate-200 tw:bg-slate-50 tw:p-6"
          title="Public share link"
          description="Prefix and suffix add-ons keep slugs, subdomains, and generated identifiers readable."
        >
          <div hlmInputGroup class="tw:flex tw:max-w-xl tw:items-center tw:bg-white">
            <span hlmInputGroupText>https://egose.dev/</span>
            <input
              hlmInputGroupInput
              class="tw:min-w-0"
              placeholder="campaign-spring"
              aria-label="Campaign slug"
              value="angular-standard"
            />
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
        </app-demo-section>
      </div>

      <app-demo-section
        class="tw:rounded-3xl tw:border tw:border-slate-200 tw:bg-slate-950 tw:p-6 tw:text-white"
        title="Structured message composer"
        description="Block add-ons label larger inputs without breaking the field shape."
        tone="dark"
      >
        <div hlmInputGroup class="tw:min-h-36 tw:max-w-3xl tw:bg-slate-900 tw:text-white tw:border-slate-700">
          <div hlmInputGroupAddon align="block-start" class="tw:text-slate-300">Message to #design-review</div>
          <textarea
            hlmInputGroupTextarea
            rows="4"
            aria-label="Message to the design-review channel"
            class="tw:text-white tw:placeholder:text-slate-500"
            placeholder="Describe the behavior you want to change..."
          >
Could we raise the contrast of the disabled state on the share dialog?</textarea
          >
          <div
            hlmInputGroupAddon
            align="block-end"
            class="tw:flex tw:items-center tw:justify-between tw:text-slate-400"
          >
            <span role="status">{{ composerMessage() }}</span>
            <button hlmInputGroupButton type="button" class="tw:text-slate-100" (click)="sendMessage()">Send</button>
          </div>
        </div>
      </app-demo-section>
    </section>
  `,
})
export class InputGroupPage {
  readonly budgetMessage = signal<string | null>(null);
  readonly composerMessage = signal('Draft autosaved just now');

  applyBudget() {
    this.budgetMessage.set('Monthly budget of $249 applied to the current workspace.');
  }

  sendMessage() {
    this.composerMessage.set('Message sent to #design-review just now.');
  }
}
