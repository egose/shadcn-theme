import { Component } from '@angular/core';
import { DemoHeaderComponent } from '../../../shared/demo-header';
import { DemoSectionComponent } from '../../../shared/demo-section';
import { EgBasicAlert } from '@egose/shadcn-theme-ng/basic-alert';

@Component({
  selector: 'app-basic-alert-page',
  imports: [DemoHeaderComponent, DemoSectionComponent, EgBasicAlert],
  template: `
    <section class="tw:space-y-8">
      <app-demo-header
        title="Basic Alert"
        description="A compact alert with title and description, suited to stacked notifications and short status messages."
      />

      <div class="tw:grid tw:gap-6 xl:tw:grid-cols-2">
        <app-demo-section
          class="tw:rounded-[28px] tw:border tw:border-slate-200 tw:bg-white tw:p-6 tw:shadow-sm"
          title="Light appearance"
        >
          <div class="tw:grid tw:gap-3">
            @for (alert of lightAlerts; track alert.title) {
              <eg-basic-alert [variant]="alert.variant" [title]="alert.title" [description]="alert.description" />
            }
          </div>
        </app-demo-section>

        <app-demo-section
          class="tw:rounded-[28px] tw:border tw:border-slate-200 tw:bg-slate-950 tw:p-6 tw:text-white tw:shadow-sm"
          title="Solid appearance"
          tone="dark"
        >
          <div class="tw:grid tw:gap-3">
            @for (alert of solidAlerts; track alert.title) {
              <eg-basic-alert
                [variant]="alert.variant"
                appearance="solid"
                [title]="alert.title"
                [description]="alert.description"
              />
            }
          </div>
        </app-demo-section>
      </div>
    </section>
  `,
})
export class BasicAlertPage {
  readonly lightAlerts = [
    {
      variant: 'info',
      title: 'Backup completed',
      description: 'The nightly workspace backup finished at 02:00 UTC.',
    },
    {
      variant: 'success',
      title: 'Invite accepted',
      description: 'A new member joined the workspace from your invite link.',
    },
    {
      variant: 'warning',
      title: 'Trial ending soon',
      description: 'The workspace trial ends in 3 days; add a payment method to continue.',
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
