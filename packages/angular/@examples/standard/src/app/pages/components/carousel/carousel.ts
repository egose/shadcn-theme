import { Component } from '@angular/core';
import { HlmCarouselImports } from '@egose/shadcn-theme-ng/carousel';

@Component({
  selector: 'app-carousel-page',
  imports: [HlmCarouselImports],
  template: `
    <section class="tw:space-y-8">
      <div class="tw:max-w-3xl tw:space-y-3">
        <h3 class="tw:text-2xl tw:font-bold tw:text-slate-950">Carousel</h3>
        <p class="tw:text-sm tw:leading-7 tw:text-slate-600 sm:tw:text-base">
          A carousel needs surrounding content to feel intentional. This version shows slide progress, supporting copy,
          and cards with enough visual weight to judge spacing and motion.
        </p>
      </div>

      <div class="tw:grid tw:gap-6 xl:tw:grid-cols-[minmax(0,1fr)_20rem]">
        <article
          class="tw:rounded-[28px] tw:border tw:border-slate-800 tw:bg-slate-950 tw:p-6 tw:text-white tw:shadow-sm"
        >
          <div class="tw:mb-6 tw:flex tw:flex-col tw:gap-4 sm:tw:flex-row sm:tw:items-end sm:tw:justify-between">
            <div>
              <p class="tw:text-xs tw:font-semibold tw:uppercase tw:tracking-[0.24em] tw:text-slate-400">Featured</p>
              <h4 class="tw:mt-2 tw:text-xl tw:font-semibold">Release story highlights</h4>
              <p class="tw:mt-2 tw:max-w-xl tw:text-sm tw:leading-6 tw:text-slate-300">
                The carousel keeps large content blocks readable while still letting users scan multiple cards quickly.
              </p>
            </div>

            <hlm-carousel-slide-display [slideClass]="'tw:text-sm tw:font-medium tw:text-slate-300'" />
          </div>

          <hlm-carousel class="tw:block tw:w-full">
            <div hlmCarouselContent class="tw:-ml-2">
              @for (slide of slides; track slide.title) {
                <div hlmCarouselItem class="tw:basis-full tw:pl-2 lg:tw:basis-1/2">
                  <article
                    class="tw:flex tw:h-full tw:min-h-72 tw:flex-col tw:justify-between tw:rounded-[24px] tw:border tw:border-white/10 tw:bg-white/5 tw:p-5"
                  >
                    <div class="tw:space-y-4">
                      <div
                        class="tw:flex tw:items-center tw:justify-between tw:text-xs tw:uppercase tw:tracking-[0.2em] tw:text-slate-400"
                      >
                        <span>{{ slide.kicker }}</span>
                        <span>{{ slide.duration }}</span>
                      </div>

                      <div class="tw:space-y-3">
                        <h5 class="tw:text-xl tw:font-semibold tw:tracking-tight">{{ slide.title }}</h5>
                        <p class="tw:text-sm tw:leading-6 tw:text-slate-300">{{ slide.description }}</p>
                      </div>
                    </div>

                    <div class="tw:mt-8 tw:flex tw:items-end tw:justify-between tw:gap-4">
                      <div>
                        <p class="tw:text-xs tw:text-slate-400">Status</p>
                        <p class="tw:mt-1 tw:text-sm tw:font-medium tw:text-slate-100">{{ slide.status }}</p>
                      </div>
                      <span
                        class="tw:rounded-full tw:bg-white/10 tw:px-3 tw:py-1 tw:text-xs tw:font-medium tw:text-slate-200"
                      >
                        {{ slide.category }}
                      </span>
                    </div>
                  </article>
                </div>
              }
            </div>

            <div class="tw:mt-6 tw:flex tw:items-center tw:justify-between tw:gap-3">
              <p class="tw:text-sm tw:text-slate-400">
                Works well for dashboards, marketing rails, and featured content.
              </p>
              <div class="tw:flex tw:gap-2">
                <button hlmCarouselPrevious type="button">Previous</button>
                <button hlmCarouselNext type="button">Next</button>
              </div>
            </div>
          </hlm-carousel>
        </article>

        <aside class="tw:space-y-4 tw:rounded-[28px] tw:border tw:border-slate-200 tw:bg-slate-50 tw:p-6">
          <div>
            <p class="tw:text-xs tw:font-semibold tw:uppercase tw:tracking-[0.2em] tw:text-slate-500">
              Why this demo works better
            </p>
            <h4 class="tw:mt-2 tw:text-lg tw:font-semibold tw:text-slate-900">The component has context now</h4>
          </div>

          <div class="tw:space-y-3">
            <div class="tw:rounded-2xl tw:border tw:border-slate-200 tw:bg-white tw:p-4">
              <p class="tw:text-sm tw:font-medium tw:text-slate-900">Readable slide width</p>
              <p class="tw:mt-1 tw:text-sm tw:leading-6 tw:text-slate-600">
                Cards are large enough to show real copy instead of placeholder numbers.
              </p>
            </div>
            <div class="tw:rounded-2xl tw:border tw:border-slate-200 tw:bg-white tw:p-4">
              <p class="tw:text-sm tw:font-medium tw:text-slate-900">Visible controls</p>
              <p class="tw:mt-1 tw:text-sm tw:leading-6 tw:text-slate-600">
                Previous and next actions sit next to helpful support text instead of floating alone.
              </p>
            </div>
            <div class="tw:rounded-2xl tw:border tw:border-slate-200 tw:bg-white tw:p-4">
              <p class="tw:text-sm tw:font-medium tw:text-slate-900">Progress feedback</p>
              <p class="tw:mt-1 tw:text-sm tw:leading-6 tw:text-slate-600">
                The built-in slide display makes the state of the carousel obvious.
              </p>
            </div>
          </div>
        </aside>
      </div>
    </section>
  `,
})
export class CarouselPage {
  readonly slides = [
    {
      kicker: 'Design system',
      title: 'Refine the standard examples before release',
      description:
        'Audit spacing, hierarchy, and realistic content so newly added components feel intentional instead of experimental.',
      duration: '4 min read',
      status: 'In review',
      category: 'UI quality',
    },
    {
      kicker: 'Forms',
      title: 'Document empty and loading states with stronger examples',
      description:
        'Show states that users actually hit in production, including empty results, onboarding prompts, and follow-up actions.',
      duration: '6 min read',
      status: 'Ready',
      category: 'Patterns',
    },
    {
      kicker: 'Navigation',
      title: 'Revisit sidebar density across mobile and desktop',
      description:
        'Use badges, grouped sections, and inset content to make the component read like a real dashboard shell.',
      duration: '3 min read',
      status: 'Scheduled',
      category: 'Layout',
    },
    {
      kicker: 'Feedback',
      title: 'Make carousels easier to evaluate at a glance',
      description:
        'Include slide counters and stronger card surfaces so reviewers can judge the interaction without guessing intent.',
      duration: '5 min read',
      status: 'Published',
      category: 'Interaction',
    },
  ];
}
