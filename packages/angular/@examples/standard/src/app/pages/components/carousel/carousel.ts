import { Component } from '@angular/core';
import { DemoHeaderComponent } from '../../../shared/demo-header';
import { DemoSectionComponent } from '../../../shared/demo-section';
import { HlmCarouselImports } from '@egose/shadcn-theme-ng/carousel';

@Component({
  selector: 'app-carousel-page',
  imports: [DemoHeaderComponent, DemoSectionComponent, HlmCarouselImports],
  template: `
    <section class="tw:space-y-8">
      <app-demo-header
        title="Carousel"
        description="Horizontally scrollable card track with previous/next controls and a live slide counter."
      />

      <div class="tw:grid tw:gap-6 xl:tw:grid-cols-[minmax(0,1fr)_20rem]">
        <article
          class="tw:rounded-[28px] tw:border tw:border-slate-800 tw:bg-slate-950 tw:p-6 tw:text-white tw:shadow-sm"
        >
          <div class="tw:mb-6">
            <p class="tw:text-xs tw:font-semibold tw:uppercase tw:tracking-[0.24em] tw:text-slate-400">Featured</p>
            <h3 class="tw:mt-2 tw:text-xl tw:font-semibold">Support playbook highlights</h3>
            <p class="tw:mt-2 tw:max-w-xl tw:text-sm tw:leading-6 tw:text-slate-300">
              Featured guides for the support team, with reading time and publication status.
            </p>
          </div>

          <hlm-carousel class="tw:block tw:w-full">
            <!-- The slide display must live inside hlm-carousel: it injects the carousel instance. -->
            <div class="tw:mb-4 tw:flex tw:justify-end">
              <hlm-carousel-slide-display [slideClass]="'tw:text-sm tw:font-medium tw:text-slate-300'" />
            </div>
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
                        <h4 class="tw:text-xl tw:font-semibold tw:tracking-tight">{{ slide.title }}</h4>
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

        <app-demo-section
          class="tw:rounded-[28px] tw:border tw:border-slate-200 tw:bg-slate-50 tw:p-6"
          kicker="Evaluation notes"
          title="What to check"
        >
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
        </app-demo-section>
      </div>
    </section>
  `,
})
export class CarouselPage {
  readonly slides = [
    {
      kicker: 'Billing',
      title: 'Resolve a failed renewal payment',
      description: 'Steps for retrying a declined card, updating details, and confirming that service is restored.',
      duration: '4 min read',
      status: 'In review',
      category: 'Payments',
    },
    {
      kicker: 'Accounts',
      title: 'Recover access for a locked-out member',
      description: 'How to verify identity, reset credentials, and re-enable two-factor authentication safely.',
      duration: '6 min read',
      status: 'Ready',
      category: 'Accounts',
    },
    {
      kicker: 'Triage',
      title: 'Escalate a ticket to engineering',
      description: 'When and how to hand a conversation over to engineering, including the detail reviewers expect.',
      duration: '3 min read',
      status: 'Scheduled',
      category: 'Workflow',
    },
    {
      kicker: 'Satisfaction',
      title: 'Follow up after a resolved conversation',
      description: 'Timing, tone, and the survey link to include when closing a support thread.',
      duration: '5 min read',
      status: 'Published',
      category: 'Customer care',
    },
  ];
}
