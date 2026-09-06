import { Component } from '@angular/core';
import { DemoHeaderComponent } from '../../../shared/demo-header';
import { DemoSectionComponent } from '../../../shared/demo-section';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideCircleAlert,
  lucideCircleCheck,
  lucideInfo,
  lucideBatteryWarning,
  lucideBell,
  lucideStar,
  lucideThumbsUp,
  lucideZap,
  lucideLink,
  lucideGhost,
} from '@ng-icons/lucide';
import {
  HlmAlert,
  HlmAlertDescription,
  HlmAlertIcon,
  HlmAlertTitle,
  type VariantType,
} from '@egose/shadcn-theme-ng/alert';
import { EgBasicAlert } from '@egose/shadcn-theme-ng/basic-alert';

@Component({
  selector: 'spartan-alert-variants-showcase',
  standalone: true,
  imports: [
    DemoHeaderComponent,
    DemoSectionComponent,
    HlmAlertDescription,
    HlmAlert,
    HlmAlertIcon,
    HlmAlertTitle,
    NgIcon,
    EgBasicAlert,
  ],
  providers: [
    provideIcons({
      lucideCircleCheck,
      lucideInfo,
      lucideBatteryWarning,
      lucideCircleAlert,
      lucideBell,
      lucideStar,
      lucideThumbsUp,
      lucideZap,
      lucideLink,
      lucideGhost,
    }),
  ],
  template: `
    <section class="tw:space-y-8">
      <app-demo-header
        title="Alert"
        description="Inline status messages with icon, title, and description, shown across solid and light appearances."
      />

      <div class="tw:grid tw:gap-6 xl:tw:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)]">
        <div class="tw:space-y-6">
          <app-demo-section
            class="tw:rounded-[28px] tw:border tw:border-slate-200 tw:bg-white tw:p-6 tw:shadow-sm"
            title="System messages"
            description="Curated examples show spacing, icon balance, and copy hierarchy on a light surface."
          >
            <div class="tw:grid tw:gap-4">
              @for (alert of featuredAlerts; track alert.title) {
                <div hlmAlert [variant]="alert.variant" [appearance]="alert.appearance">
                  <ng-icon hlm hlmAlertIcon [name]="getIconName(alert.variant)" />
                  <h4 hlmAlertTitle>{{ alert.title }}</h4>
                  <p hlmAlertDescription>{{ alert.description }}</p>
                </div>
              }
            </div>
          </app-demo-section>

          <app-demo-section
            class="tw:rounded-[28px] tw:border tw:border-slate-200 tw:bg-slate-50 tw:p-6"
            title="Quick palette"
          >
            <div class="tw:grid tw:gap-3">
              @for (variant of variants; track variant) {
                <div class="tw:grid tw:gap-2 sm:tw:grid-cols-2">
                  <div hlmAlert [variant]="variant" appearance="solid">
                    <ng-icon hlm hlmAlertIcon [name]="getIconName(variant)" />
                    <h4 hlmAlertTitle class="tw:capitalize">{{ variant }}</h4>
                    <p hlmAlertDescription>Solid appearance</p>
                  </div>
                  <div hlmAlert [variant]="variant" appearance="light">
                    <ng-icon hlm hlmAlertIcon [name]="getIconName(variant)" />
                    <h4 hlmAlertTitle class="tw:capitalize">{{ variant }}</h4>
                    <p hlmAlertDescription>Light appearance</p>
                  </div>
                </div>
              }
            </div>
          </app-demo-section>
        </div>

        <app-demo-section
          class="tw:rounded-[28px] tw:border tw:border-slate-200 tw:bg-slate-950 tw:p-6 tw:text-white"
          title="Basic alerts"
          kicker="Companion component"
          tone="dark"
        >
          <div class="tw:grid tw:gap-3">
            @for (alert of compactAlerts; track alert.title) {
              <eg-basic-alert
                [variant]="alert.variant"
                [appearance]="alert.appearance"
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
export class AlertPage {
  variants: VariantType[] = ['success', 'warning', 'danger', 'info', 'accent', 'destructive'];

  featuredAlerts = [
    {
      title: 'Deployment ready for review',
      description: 'Release 2.4.0 passed all checks and is waiting for final approval.',
      variant: 'success' as VariantType,
      appearance: 'solid' as const,
    },
    {
      title: 'Usage is approaching the plan limit',
      description: 'This workspace has used 90% of its monthly event quota.',
      variant: 'warning' as VariantType,
      appearance: 'light' as const,
    },
    {
      title: 'Payment method could not be verified',
      description: 'The card on file was declined; update billing details to avoid an interruption.',
      variant: 'danger' as VariantType,
      appearance: 'light' as const,
    },
  ];

  compactAlerts = [
    {
      title: 'Trial started',
      description: 'The 14-day trial began today; add a payment method any time.',
      variant: 'info' as VariantType,
      appearance: 'light' as const,
    },
    {
      title: 'New workspace member',
      description: 'A collaborator accepted the invite and joined this workspace.',
      variant: 'accent' as VariantType,
      appearance: 'solid' as const,
    },
    {
      title: 'Destructive regression',
      description: 'Use this variant sparingly for truly blocking issues.',
      variant: 'destructive' as VariantType,
      appearance: 'light' as const,
    },
  ];

  getIconName(variant: string): string {
    switch (variant) {
      case 'success':
        return 'lucideCircleCheck';
      case 'info':
        return 'lucideInfo';
      case 'warning':
        return 'lucideBatteryWarning';
      case 'danger':
      case 'destructive':
        return 'lucideCircleAlert';
      case 'muted':
        return 'lucideBell';
      case 'accent':
        return 'lucideStar';
      case 'primary':
        return 'lucideThumbsUp';
      case 'secondary':
        return 'lucideZap';
      case 'link':
        return 'lucideLink';
      case 'ghost':
        return 'lucideGhost';
      case 'light':
      case 'dark':
      default:
        return 'lucideInfo';
    }
  }
}
