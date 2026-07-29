import { Component } from '@angular/core';
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
  imports: [HlmAlertDescription, HlmAlert, HlmAlertIcon, HlmAlertTitle, NgIcon, EgBasicAlert],
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
      <div class="tw:max-w-3xl tw:space-y-3">
        <h3 class="tw:text-2xl tw:font-bold tw:text-slate-950">Alert</h3>
        <p class="tw:text-sm tw:leading-7 tw:text-slate-600 sm:tw:text-base">
          Alerts are easier to review when the page highlights a few believable operational messages instead of showing
          every variant in one overwhelming wall.
        </p>
      </div>

      <div class="tw:grid tw:gap-6 xl:tw:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)]">
        <div class="tw:space-y-6">
          <article class="tw:rounded-[28px] tw:border tw:border-slate-200 tw:bg-white tw:p-6 tw:shadow-sm">
            <h4 class="tw:text-lg tw:font-semibold tw:text-slate-900">System messages</h4>
            <p class="tw:mt-2 tw:text-sm tw:leading-6 tw:text-slate-600">
              Curated examples show spacing, icon balance, and copy hierarchy much more clearly.
            </p>

            <div class="tw:mt-5 tw:grid tw:gap-4">
              @for (alert of featuredAlerts; track alert.title) {
                <div hlmAlert [variant]="alert.variant" [appearance]="alert.appearance">
                  <ng-icon hlm hlmAlertIcon [name]="getIconName(alert.variant)" />
                  <h4 hlmAlertTitle>{{ alert.title }}</h4>
                  <p hlmAlertDescription>{{ alert.description }}</p>
                </div>
              }
            </div>
          </article>

          <article class="tw:rounded-[28px] tw:border tw:border-slate-200 tw:bg-slate-50 tw:p-6">
            <h4 class="tw:text-lg tw:font-semibold tw:text-slate-900">Quick palette</h4>
            <div class="tw:mt-4 tw:grid tw:gap-3">
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
          </article>
        </div>

        <aside
          class="tw:space-y-4 tw:rounded-[28px] tw:border tw:border-slate-200 tw:bg-slate-950 tw:p-6 tw:text-white"
        >
          <div>
            <p class="tw:text-xs tw:font-semibold tw:uppercase tw:tracking-[0.2em] tw:text-slate-400">
              Companion component
            </p>
            <h4 class="tw:mt-2 tw:text-lg tw:font-semibold">Basic alerts</h4>
          </div>

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
        </aside>
      </div>
    </section>
  `,
})
export class AlertPage {
  variants: VariantType[] = ['success', 'warning', 'danger', 'info', 'accent', 'destructive'];

  featuredAlerts = [
    {
      title: 'Deployment ready for review',
      description: 'All example routes now compile and the visual shell has been normalized.',
      variant: 'success' as VariantType,
      appearance: 'solid' as const,
    },
    {
      title: 'A few demos still need another polish pass',
      description: 'Input and select-adjacent pages benefit from stronger context and less placeholder copy.',
      variant: 'warning' as VariantType,
      appearance: 'light' as const,
    },
    {
      title: 'Sidebar package has a separate compiler warning',
      description:
        'The current example build still reports a missing structural directive import in the sidebar project.',
      variant: 'danger' as VariantType,
      appearance: 'light' as const,
    },
  ];

  compactAlerts = [
    {
      title: 'Info update',
      description: 'The standard example now uses a stronger content shell.',
      variant: 'info' as VariantType,
      appearance: 'light' as const,
    },
    {
      title: 'Accent note',
      description: 'Newer package demos feel more intentional after the page-level pass.',
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
