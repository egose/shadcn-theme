import { Component, signal } from '@angular/core';
import { DemoHeaderComponent } from '../../../shared/demo-header';
import { HlmItemImports } from '@egose/shadcn-theme-ng/item';
import { HlmButton } from '@egose/shadcn-theme-ng/button';

@Component({
  selector: 'app-item-page',
  imports: [DemoHeaderComponent, HlmItemImports, HlmButton],
  template: `
    <section class="tw:space-y-8">
      <app-demo-header
        title="Item"
        description="Item primitives work best in stacked lists with media, metadata, actions, and separators. This gives the layout enough structure to judge spacing and alignment."
      />

      <div class="tw:grid tw:gap-6 xl:tw:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
        <div
          hlmItemGroup
          class="tw:rounded-[28px] tw:border tw:border-slate-200 tw:bg-white tw:p-5 tw:shadow-sm sm:tw:p-6"
        >
          @for (task of tasks; track task.title; let last = $last) {
            <article hlmItem class="tw:rounded-3xl tw:border tw:border-slate-200 tw:bg-slate-50 tw:p-4 sm:tw:p-5">
              <div
                hlmItemMedia
                class="tw:h-11 tw:w-11 tw:rounded-2xl tw:bg-slate-900 tw:text-sm tw:font-semibold tw:text-white"
              >
                {{ task.initials }}
              </div>

              <div hlmItemContent class="tw:min-w-0">
                <div hlmItemHeader>
                  <p hlmItemTitle>{{ task.title }}</p>
                  <p hlmItemDescription>{{ task.description }}</p>
                </div>

                <div class="tw:mt-3 tw:flex tw:flex-wrap tw:gap-2">
                  <span
                    class="tw:rounded-full tw:bg-white tw:px-2.5 tw:py-1 tw:text-xs tw:font-medium tw:text-slate-600 tw:ring-1 tw:ring-slate-200"
                  >
                    {{ task.status }}
                  </span>
                  <span
                    class="tw:rounded-full tw:bg-white tw:px-2.5 tw:py-1 tw:text-xs tw:font-medium tw:text-slate-600 tw:ring-1 tw:ring-slate-200"
                  >
                    {{ task.owner }}
                  </span>
                </div>

                <div hlmItemFooter class="tw:mt-4">
                  <span class="tw:text-sm tw:text-slate-500">Updated {{ task.updated }}</span>
                  <div hlmItemActions>
                    <button
                      hlmButton
                      variant="secondary"
                      appearance="outline"
                      size="sm"
                      type="button"
                      (click)="note('Review started for: ' + task.title)"
                    >
                      Review
                    </button>
                    <button hlmButton size="sm" type="button" (click)="note('Opened: ' + task.title)">Open</button>
                  </div>
                </div>
              </div>
            </article>

            @if (!last) {
              <div hlmItemSeparator></div>
            }
          }
        </div>

        <aside class="tw:space-y-4 tw:rounded-[28px] tw:border tw:border-slate-200 tw:bg-slate-50 tw:p-6">
          <div>
            <p class="tw:text-xs tw:font-semibold tw:uppercase tw:tracking-[0.2em] tw:text-slate-500">What to check</p>
            <h3 class="tw:mt-2 tw:text-lg tw:font-semibold tw:text-slate-900">Row composition notes</h3>
          </div>

          <div class="tw:space-y-3">
            <div class="tw:rounded-2xl tw:border tw:border-slate-200 tw:bg-white tw:p-4">
              <p class="tw:text-sm tw:font-medium tw:text-slate-900">Media anchors the row</p>
              <p class="tw:mt-1 tw:text-sm tw:leading-6 tw:text-slate-600">
                A leading visual makes item spacing easier to inspect than plain text alone.
              </p>
            </div>
            <div class="tw:rounded-2xl tw:border tw:border-slate-200 tw:bg-white tw:p-4">
              <p class="tw:text-sm tw:font-medium tw:text-slate-900">Actions stay aligned</p>
              <p class="tw:mt-1 tw:text-sm tw:leading-6 tw:text-slate-600">
                Footer actions reveal how the item handles dense content with controls.
              </p>
            </div>
            <div class="tw:rounded-2xl tw:border tw:border-slate-200 tw:bg-white tw:p-4">
              <p class="tw:text-sm tw:font-medium tw:text-slate-900">Separators show rhythm</p>
              <p class="tw:mt-1 tw:text-sm tw:leading-6 tw:text-slate-600">
                Stacking several items makes the spacing system much easier to judge.
              </p>
            </div>
          </div>
        </aside>
      </div>

      @if (itemMessage()) {
        <p role="status" class="tw:text-sm tw:text-slate-600">{{ itemMessage() }}</p>
      }
    </section>
  `,
})
export class ItemPage {
  readonly itemMessage = signal<string | null>(null);

  note(message: string) {
    this.itemMessage.set(message);
  }

  readonly tasks = [
    {
      initials: 'IG',
      title: 'Wire up customer import',
      description: 'Map CSV columns to customer fields and validate the first batch.',
      status: 'In review',
      owner: 'J. Hahn',
      updated: '8 minutes ago',
    },
    {
      initials: 'SB',
      title: 'Review payout schedule',
      description: 'Confirm the next two payout dates with finance before lock.',
      status: 'Ready',
      owner: 'N. Chen',
      updated: '22 minutes ago',
    },
    {
      initials: 'EM',
      title: 'Draft renewal reminder email',
      description: 'Prepare the 30-day renewal notice for accounts on annual plans.',
      status: 'Done',
      owner: 'A. Patel',
      updated: '1 hour ago',
    },
  ];
}
