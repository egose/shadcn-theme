import { Component } from '@angular/core';
import { EgBasicAlert } from '@egose/shadcn-theme-ng/basic-alert';

@Component({
  selector: 'app-basic-alert-page',
  imports: [EgBasicAlert],
  template: `
    <section class="tw:space-y-8">
      <div class="tw:max-w-3xl tw:space-y-3">
        <h3 class="tw:text-2xl tw:font-bold tw:text-slate-950">Basic Alert</h3>
        <p class="tw:text-sm tw:leading-7 tw:text-slate-600 sm:tw:text-base">
          The simpler alert component works well for stacked notifications, inbox states, and short workflow guidance.
        </p>
      </div>

      <div class="tw:grid tw:gap-6 xl:tw:grid-cols-2">
        <article class="tw:rounded-[28px] tw:border tw:border-slate-200 tw:bg-white tw:p-6 tw:shadow-sm">
          <h4 class="tw:text-lg tw:font-semibold tw:text-slate-900">Light appearance</h4>
          <div class="tw:mt-4 tw:grid tw:gap-3">
            @for (alert of lightAlerts; track alert.title) {
              <eg-basic-alert [variant]="alert.variant" [title]="alert.title" [description]="alert.description" />
            }
          </div>
        </article>

        <article
          class="tw:rounded-[28px] tw:border tw:border-slate-200 tw:bg-slate-950 tw:p-6 tw:text-white tw:shadow-sm"
        >
          <h4 class="tw:text-lg tw:font-semibold">Solid appearance</h4>
          <div class="tw:mt-4 tw:grid tw:gap-3">
            @for (alert of solidAlerts; track alert.title) {
              <eg-basic-alert
                [variant]="alert.variant"
                appearance="solid"
                [title]="alert.title"
                [description]="alert.description"
              />
            }
          </div>
        </article>
      </div>
    </section>
  `,
})
export class BasicAlertPage {
  readonly lightAlerts = [
    {
      variant: 'info',
      title: 'Examples synced',
      description: 'The current workspace includes the latest standard-demo updates.',
    },
    {
      variant: 'success',
      title: 'Build passed',
      description: 'The Angular standard example compiled successfully after the latest changes.',
    },
    {
      variant: 'warning',
      title: 'Visual QA pending',
      description: 'A few route pages still deserve one more pass for consistency.',
    },
  ] as const;

  readonly solidAlerts = [
    {
      variant: 'danger',
      title: 'Blocking issue',
      description: 'Reserve solid destructive alerts for problems that stop a user from continuing.',
    },
    {
      variant: 'accent',
      title: 'New package added',
      description: 'Solid accent styling is useful for callouts that need stronger emphasis.',
    },
    {
      variant: 'secondary',
      title: 'Queued review',
      description: 'Secondary alerts can support lower-priority notices without overpowering the page.',
    },
  ] as const;
}
