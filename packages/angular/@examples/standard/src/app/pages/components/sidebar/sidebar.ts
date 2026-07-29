import { Component } from '@angular/core';
import { HlmSidebarImports } from '@egose/shadcn-theme-ng/sidebar';

@Component({
  selector: 'app-sidebar-page',
  imports: [HlmSidebarImports],
  template: `
    <section class="tw:space-y-8">
      <div class="tw:max-w-3xl tw:space-y-3">
        <h3 class="tw:text-2xl tw:font-bold tw:text-slate-950">Sidebar</h3>
        <p class="tw:text-sm tw:leading-7 tw:text-slate-600 sm:tw:text-base">
          The sidebar package is much easier to evaluate when it lives inside a believable app shell with grouped links,
          badges, search, and an inset content area.
        </p>
      </div>

      <div class="tw:grid tw:gap-6 xl:tw:grid-cols-[18rem_minmax(0,1fr)]">
        <aside class="tw:space-y-4 tw:rounded-[28px] tw:border tw:border-slate-200 tw:bg-slate-50 tw:p-6">
          <div>
            <p class="tw:text-xs tw:font-semibold tw:uppercase tw:tracking-[0.2em] tw:text-slate-500">Showcase notes</p>
            <h4 class="tw:mt-2 tw:text-lg tw:font-semibold tw:text-slate-900">Why the old demo felt off</h4>
          </div>

          <div class="tw:space-y-3">
            <div class="tw:rounded-2xl tw:border tw:border-slate-200 tw:bg-white tw:p-4">
              <p class="tw:text-sm tw:font-medium tw:text-slate-900">Too little structure</p>
              <p class="tw:mt-1 tw:text-sm tw:leading-6 tw:text-slate-600">
                Two buttons inside a bare column did not communicate the component system.
              </p>
            </div>
            <div class="tw:rounded-2xl tw:border tw:border-slate-200 tw:bg-white tw:p-4">
              <p class="tw:text-sm tw:font-medium tw:text-slate-900">No grouped navigation</p>
              <p class="tw:mt-1 tw:text-sm tw:leading-6 tw:text-slate-600">
                Badges, sections, and nested items make the spacing rules much easier to inspect.
              </p>
            </div>
            <div class="tw:rounded-2xl tw:border tw:border-slate-200 tw:bg-white tw:p-4">
              <p class="tw:text-sm tw:font-medium tw:text-slate-900">Missing inset context</p>
              <p class="tw:mt-1 tw:text-sm tw:leading-6 tw:text-slate-600">
                The content area should show how the sidebar behaves inside a dashboard layout.
              </p>
            </div>
          </div>
        </aside>

        <div
          hlmSidebarWrapper
          class="tw:relative tw:flex tw:min-h-[620px] tw:w-full tw:overflow-hidden tw:rounded-[28px] tw:border tw:border-slate-200 tw:bg-slate-100 tw:shadow-sm"
        >
          <hlm-sidebar variant="inset" collapsible="icon">
            <div hlmSidebarHeader class="tw:gap-4 tw:border-b tw:border-sidebar-border/60 tw:p-4">
              <div class="tw:flex tw:items-center tw:justify-between tw:gap-3">
                <div>
                  <p class="tw:text-sm tw:font-semibold">Egose Studio</p>
                  <p class="tw:text-xs tw:text-sidebar-foreground/70">Quality review workspace</p>
                </div>
                <button hlmSidebarTrigger type="button"></button>
              </div>
              <input hlmSidebarInput placeholder="Search workspace" />
            </div>

            <div hlmSidebarContent class="tw:gap-4 tw:p-3">
              <div hlmSidebarGroup class="tw:relative">
                <div hlmSidebarGroupLabel>Primary</div>
                <button hlmSidebarGroupAction type="button">+</button>
                <div hlmSidebarGroupContent>
                  <ul hlmSidebarMenu>
                    @for (item of primaryItems; track item.label) {
                      <li hlmSidebarMenuItem>
                        <button hlmSidebarMenuButton type="button" [isActive]="item.active">
                          <span>{{ item.label }}</span>
                        </button>
                        @if (item.badge) {
                          <span hlmSidebarMenuBadge>{{ item.badge }}</span>
                        }
                      </li>
                    }
                  </ul>
                </div>
              </div>

              <div hlmSidebarSeparator></div>

              <div hlmSidebarGroup>
                <div hlmSidebarGroupLabel>Teams</div>
                <div hlmSidebarGroupContent>
                  <ul hlmSidebarMenu>
                    @for (team of teamItems; track team.label) {
                      <li hlmSidebarMenuItem>
                        <button hlmSidebarMenuButton type="button" size="lg">
                          <span
                            class="tw:flex tw:h-8 tw:w-8 tw:items-center tw:justify-center tw:rounded-xl tw:bg-sidebar-accent tw:text-xs tw:font-semibold"
                          >
                            {{ team.initials }}
                          </span>
                          <span>{{ team.label }}</span>
                        </button>
                      </li>
                    }
                  </ul>
                </div>
              </div>

              <div hlmSidebarSeparator></div>

              <div hlmSidebarGroup>
                <div hlmSidebarGroupLabel>Recent activity</div>
                <div hlmSidebarGroupContent>
                  <ul hlmSidebarMenuSub>
                    @for (activity of recentActivity; track activity.title) {
                      <li hlmSidebarMenuSubItem>
                        <button hlmSidebarMenuSubButton type="button">
                          <span>{{ activity.title }}</span>
                        </button>
                      </li>
                    }
                  </ul>
                </div>
              </div>
            </div>

            <div hlmSidebarFooter class="tw:border-t tw:border-sidebar-border/60 tw:p-4">
              <button hlmSidebarMenuButton type="button" variant="outline" size="lg">
                <span>Upgrade workspace</span>
              </button>
            </div>
          </hlm-sidebar>

          <main hlmSidebarInset class="tw:flex tw:flex-1 tw:flex-col tw:bg-white">
            <div class="tw:flex tw:items-center tw:justify-between tw:border-b tw:border-slate-200 tw:px-6 tw:py-4">
              <div>
                <p class="tw:text-sm tw:font-semibold tw:text-slate-900">Release overview</p>
                <p class="tw:text-sm tw:text-slate-500">
                  A realistic inset area makes the sidebar proportions easier to judge.
                </p>
              </div>
              <button hlmSidebarTrigger type="button"></button>
            </div>

            <div class="tw:grid tw:flex-1 tw:gap-4 tw:p-6 lg:tw:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
              <section class="tw:space-y-4 tw:rounded-3xl tw:border tw:border-slate-200 tw:bg-slate-50 tw:p-5">
                <div class="tw:flex tw:items-center tw:justify-between">
                  <div>
                    <p class="tw:text-xs tw:font-semibold tw:uppercase tw:tracking-[0.2em] tw:text-slate-500">
                      Current sprint
                    </p>
                    <h5 class="tw:mt-1 tw:text-lg tw:font-semibold tw:text-slate-900">Standard examples refresh</h5>
                  </div>
                  <span
                    class="tw:rounded-full tw:bg-emerald-100 tw:px-3 tw:py-1 tw:text-xs tw:font-medium tw:text-emerald-700"
                    >On track</span
                  >
                </div>

                <div class="tw:grid tw:gap-3 sm:tw:grid-cols-3">
                  <div class="tw:rounded-2xl tw:border tw:border-slate-200 tw:bg-white tw:p-4">
                    <p class="tw:text-xs tw:text-slate-500">Pages reviewed</p>
                    <p class="tw:mt-2 tw:text-2xl tw:font-semibold tw:text-slate-950">18</p>
                  </div>
                  <div class="tw:rounded-2xl tw:border tw:border-slate-200 tw:bg-white tw:p-4">
                    <p class="tw:text-xs tw:text-slate-500">Needs polish</p>
                    <p class="tw:mt-2 tw:text-2xl tw:font-semibold tw:text-slate-950">4</p>
                  </div>
                  <div class="tw:rounded-2xl tw:border tw:border-slate-200 tw:bg-white tw:p-4">
                    <p class="tw:text-xs tw:text-slate-500">Ready to ship</p>
                    <p class="tw:mt-2 tw:text-2xl tw:font-semibold tw:text-slate-950">12</p>
                  </div>
                </div>

                <div class="tw:rounded-2xl tw:border tw:border-dashed tw:border-slate-300 tw:bg-white tw:p-4">
                  <p class="tw:text-sm tw:leading-7 tw:text-slate-600">
                    Collapse the sidebar with the trigger to verify how badges, section labels, and the inset area
                    respond.
                  </p>
                </div>
              </section>

              <section class="tw:space-y-3 tw:rounded-3xl tw:border tw:border-slate-200 tw:bg-slate-50 tw:p-5">
                <h5 class="tw:text-base tw:font-semibold tw:text-slate-900">Review queue</h5>
                @for (review of reviewQueue; track review.title) {
                  <div class="tw:rounded-2xl tw:border tw:border-slate-200 tw:bg-white tw:p-4">
                    <div class="tw:flex tw:items-start tw:justify-between tw:gap-4">
                      <div>
                        <p class="tw:text-sm tw:font-medium tw:text-slate-900">{{ review.title }}</p>
                        <p class="tw:mt-1 tw:text-sm tw:leading-6 tw:text-slate-500">{{ review.description }}</p>
                      </div>
                      <span
                        class="tw:rounded-full tw:bg-slate-100 tw:px-2.5 tw:py-1 tw:text-xs tw:font-medium tw:text-slate-600"
                      >
                        {{ review.status }}
                      </span>
                    </div>
                  </div>
                }
              </section>
            </div>
          </main>
        </div>
      </div>
    </section>
  `,
})
export class SidebarPage {
  readonly primaryItems = [
    { label: 'Overview', active: true, badge: '12' },
    { label: 'Components', active: false, badge: '8' },
    { label: 'Reviews', active: false, badge: '3' },
    { label: 'Releases', active: false, badge: '' },
  ];

  readonly teamItems = [
    { label: 'Design systems', initials: 'DS' },
    { label: 'Frontend core', initials: 'FC' },
    { label: 'Docs squad', initials: 'DQ' },
  ];

  readonly recentActivity = [
    { title: 'Button variants refreshed' },
    { title: 'Carousel spacing updated' },
    { title: 'Empty states under review' },
  ];

  readonly reviewQueue = [
    {
      title: 'Input group examples',
      description: 'Replace isolated controls with pricing, URL, and composer scenarios.',
      status: 'Active',
    },
    {
      title: 'Sidebar density audit',
      description: 'Check label truncation and badge alignment in collapsed mode.',
      status: 'Queued',
    },
    {
      title: 'Empty state hierarchy',
      description: 'Ensure headings, descriptions, and CTAs read well across light and dark surfaces.',
      status: 'Done',
    },
  ];
}
