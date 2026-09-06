import { Component, signal } from '@angular/core';
import { DemoHeaderComponent } from '../../../shared/demo-header';
import { HlmSidebarImports } from '@egose/shadcn-theme-ng/sidebar';

@Component({
  selector: 'app-sidebar-page',
  imports: [DemoHeaderComponent, HlmSidebarImports],
  template: `
    <section class="tw:space-y-8">
      <app-demo-header
        title="Sidebar"
        description="A collapsible app sidebar with grouped navigation, badges, search, and an inset content area."
      />

      <div class="tw:grid tw:gap-6 xl:tw:grid-cols-[18rem_minmax(0,1fr)]">
        <aside class="tw:space-y-4 tw:rounded-[28px] tw:border tw:border-slate-200 tw:bg-slate-50 tw:p-6">
          <div>
            <p class="tw:text-xs tw:font-semibold tw:uppercase tw:tracking-[0.2em] tw:text-slate-500">What to check</p>
            <h3 class="tw:mt-2 tw:text-lg tw:font-semibold tw:text-slate-900">Sidebar behavior notes</h3>
          </div>

          <div class="tw:space-y-3">
            <div class="tw:rounded-2xl tw:border tw:border-slate-200 tw:bg-white tw:p-4">
              <p class="tw:text-sm tw:font-medium tw:text-slate-900">Collapse trigger</p>
              <p class="tw:mt-1 tw:text-sm tw:leading-6 tw:text-slate-600">
                Use the trigger in the header row to collapse the sidebar to icons and expand it again.
              </p>
            </div>
            <div class="tw:rounded-2xl tw:border tw:border-slate-200 tw:bg-white tw:p-4">
              <p class="tw:text-sm tw:font-medium tw:text-slate-900">Groups and badges</p>
              <p class="tw:mt-1 tw:text-sm tw:leading-6 tw:text-slate-600">
                Group labels, counts, and nested items keep their alignment in both expanded and collapsed modes.
              </p>
            </div>
            <div class="tw:rounded-2xl tw:border tw:border-slate-200 tw:bg-white tw:p-4">
              <p class="tw:text-sm tw:font-medium tw:text-slate-900">Inset content</p>
              <p class="tw:mt-1 tw:text-sm tw:leading-6 tw:text-slate-600">
                The inset panel shows how the main content area resizes around the sidebar.
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
                <button hlmSidebarTrigger type="button" [srOnlyText]="'Collapse demo sidebar'"></button>
              </div>
              <input hlmSidebarInput placeholder="Search workspace" aria-label="Search workspace" />
            </div>

            <div hlmSidebarContent class="tw:gap-4 tw:p-3">
              <div hlmSidebarGroup class="tw:relative">
                <div hlmSidebarGroupLabel>Primary</div>
                <button
                  hlmSidebarGroupAction
                  type="button"
                  aria-label="Add item to the Primary group"
                  (click)="select('Add item to Primary')"
                >
                  +
                </button>
                <div hlmSidebarGroupContent>
                  <ul hlmSidebarMenu>
                    @for (item of primaryItems; track item.label) {
                      <li hlmSidebarMenuItem>
                        <button
                          hlmSidebarMenuButton
                          type="button"
                          [isActive]="selectedItem() === item.label"
                          (click)="select(item.label)"
                        >
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
                        <button
                          hlmSidebarMenuButton
                          type="button"
                          size="lg"
                          [isActive]="selectedItem() === team.label"
                          (click)="select(team.label)"
                        >
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
                        <button hlmSidebarMenuSubButton type="button" (click)="select(activity.title)">
                          <span>{{ activity.title }}</span>
                        </button>
                      </li>
                    }
                  </ul>
                </div>
              </div>
            </div>

            <div hlmSidebarFooter class="tw:border-t tw:border-sidebar-border/60 tw:p-4">
              <button
                hlmSidebarMenuButton
                type="button"
                variant="outline"
                size="lg"
                (click)="select('Upgrade workspace')"
              >
                <span>Upgrade workspace</span>
              </button>
            </div>
          </hlm-sidebar>

          <main hlmSidebarInset class="tw:flex tw:flex-1 tw:flex-col tw:bg-white">
            <div class="tw:flex tw:items-center tw:justify-between tw:border-b tw:border-slate-200 tw:px-6 tw:py-4">
              <div>
                <p class="tw:text-sm tw:font-semibold tw:text-slate-900">Release overview</p>
                <p class="tw:text-sm tw:text-slate-500">
                  The inset area shows how content and filters behave next to the sidebar.
                </p>
              </div>
              <button hlmSidebarTrigger type="button" [srOnlyText]="'Toggle demo sidebar'"></button>
            </div>

            <p role="status" class="tw:px-6 tw:pt-3 tw:text-sm tw:text-slate-500">
              {{ sidebarMessage() }}
            </p>

            <div class="tw:grid tw:flex-1 tw:gap-4 tw:p-6 lg:tw:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
              <section class="tw:space-y-4 tw:rounded-3xl tw:border tw:border-slate-200 tw:bg-slate-50 tw:p-5">
                <div class="tw:flex tw:items-center tw:justify-between">
                  <div>
                    <p class="tw:text-xs tw:font-semibold tw:uppercase tw:tracking-[0.2em] tw:text-slate-500">
                      Current sprint
                    </p>
                    <h4 class="tw:mt-1 tw:text-lg tw:font-semibold tw:text-slate-900">Mobile onboarding revamp</h4>
                  </div>
                  <span
                    class="tw:rounded-full tw:bg-emerald-100 tw:px-3 tw:py-1 tw:text-xs tw:font-medium tw:text-emerald-700"
                    >On track</span
                  >
                </div>

                <div class="tw:grid tw:gap-3 sm:tw:grid-cols-3">
                  <div class="tw:rounded-2xl tw:border tw:border-slate-200 tw:bg-white tw:p-4">
                    <p class="tw:text-xs tw:text-slate-500">Stories planned</p>
                    <p class="tw:mt-2 tw:text-2xl tw:font-semibold tw:text-slate-950">18</p>
                  </div>
                  <div class="tw:rounded-2xl tw:border tw:border-slate-200 tw:bg-white tw:p-4">
                    <p class="tw:text-xs tw:text-slate-500">In review</p>
                    <p class="tw:mt-2 tw:text-2xl tw:font-semibold tw:text-slate-950">4</p>
                  </div>
                  <div class="tw:rounded-2xl tw:border tw:border-slate-200 tw:bg-white tw:p-4">
                    <p class="tw:text-xs tw:text-slate-500">Done</p>
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
                <h4 class="tw:text-base tw:font-semibold tw:text-slate-900">Review queue</h4>
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
  readonly selectedItem = signal('Overview');
  readonly sidebarMessage = signal('Overview is selected in the demo sidebar.');

  select(label: string) {
    this.selectedItem.set(label);
    this.sidebarMessage.set(`${label} is selected in the demo sidebar.`);
  }

  readonly primaryItems = [
    { label: 'Overview', badge: '12' },
    { label: 'Components', badge: '8' },
    { label: 'Reviews', badge: '3' },
    { label: 'Releases', badge: '' },
  ];

  readonly teamItems = [
    { label: 'Design systems', initials: 'DS' },
    { label: 'Frontend core', initials: 'FC' },
    { label: 'Docs squad', initials: 'DQ' },
  ];

  readonly recentActivity = [
    { title: 'Quarterly planning doc shared' },
    { title: 'Pricing page updated' },
    { title: 'Support macros in review' },
  ];

  readonly reviewQueue = [
    {
      title: 'Checkout form defects',
      description: 'Card validation fails for AMEX numbers in Safari.',
      status: 'Active',
    },
    {
      title: 'Onboarding drop-off report',
      description: 'Weekly funnel numbers for the signup flow.',
      status: 'Queued',
    },
    {
      title: 'Invoice export request',
      description: 'Customer asked for a CSV export of all 2026 invoices.',
      status: 'Done',
    },
  ];
}
