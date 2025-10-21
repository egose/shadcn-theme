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
  type AppearanceType,
} from '@egose/shadcn-theme-ng/alert';
import { EgBasicAlert } from '@egose/shadcn-theme-ng/basic-alert';
import { HlmIcon } from '@egose/shadcn-theme-ng/icon';

@Component({
  selector: 'spartan-alert-variants-showcase',
  standalone: true,
  imports: [HlmAlertDescription, HlmAlert, HlmAlertIcon, HlmAlertTitle, NgIcon, HlmIcon, EgBasicAlert],
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
    <h3 class="tw:text-2xl tw:font-bold tw:mb-2">Alert</h3>
    <div class="tw:flex tw:gap-2">
      <!-- Solid Appearance -->
      <div class="tw:space-y-6 tw:max-w-xl">
        <h3 class="tw:font-semibold tw:mb-2">Solid Appearance</h3>
        <div class="tw:grid tw:gap-1">
          @for (variant of variants; track variant) {
            <div hlmAlert [variant]="variant" appearance="solid">
              <ng-icon hlm hlmAlertIcon [name]="getIconName(variant)" />
              <h4 hlmAlertTitle class="tw:capitalize">{{ variant }} Alert Title</h4>
              <p hlmAlertDescription>This is a solid {{ variant }} alert with an icon, title and description.</p>
            </div>
          }
        </div>
      </div>

      <!-- Light Appearance -->
      <div class="tw:space-y-6 tw:max-w-xl">
        <h3 class="tw:font-semibold tw:mb-2">Light Appearance</h3>
        <div class="tw:grid tw:gap-1">
          @for (variant of variants; track variant) {
            <div hlmAlert [variant]="variant" appearance="light">
              <ng-icon hlm hlmAlertIcon [name]="getIconName(variant)" />
              <h4 hlmAlertTitle class="tw:capitalize">{{ variant }} Alert Title</h4>
              <p hlmAlertDescription>This is a light {{ variant }} alert with an icon, title and description.</p>
            </div>
          }
        </div>
      </div>

      <div class="tw:space-y-6 tw:max-w-xl">
        <h3 class="tw:font-semibold tw:mb-2">Basic Solid Appearance</h3>
        <div class="tw:grid tw:gap-1">
          @for (variant of variants; track variant) {
            <eg-basic-alert
              [variant]="variant"
              appearance="solid"
              [title]="'Basic ' + variant + ' Alert'"
              [description]="'This is a basic solid ' + variant + ' alert.'"
            />
          }
        </div>
      </div>

      <div class="tw:space-y-6 tw:max-w-xl">
        <h3 class="tw:font-semibold tw:mb-2">Basic Light Appearance</h3>
        <div class="tw:grid tw:gap-1">
          @for (variant of variants; track variant) {
            <eg-basic-alert
              [variant]="variant"
              appearance="light"
              [title]="'Basic ' + variant + ' Alert'"
              [description]="'This is a basic light ' + variant + ' alert.'"
            />
          }
        </div>
      </div>
    </div>
  `,
})
export class AlertPage {
  variants: VariantType[] = [
    'primary',
    'secondary',
    'success',
    'warning',
    'danger',
    'info',
    'light',
    'dark',
    'accent',
    'destructive',
    'muted',
    'link',
    'ghost',
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
