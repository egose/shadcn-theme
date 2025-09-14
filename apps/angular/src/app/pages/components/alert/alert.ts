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
import { HlmIcon } from '@egose/shadcn-theme-ng/icon';

@Component({
  selector: 'spartan-alert-variants-showcase',
  standalone: true,
  imports: [HlmAlertDescription, HlmAlert, HlmAlertIcon, HlmAlertTitle, NgIcon, HlmIcon],
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
    <div class="tw:grid tw:w-full tw:max-w-xl tw:gap-1">
      @for (variant of variants; track variant) {
        <div hlmAlert [variant]="variant">
          <ng-icon hlm hlmAlertIcon [name]="getIconName(variant)" />
          <h4 hlmAlertTitle class="tw:capitalize">{{ variant }} Alert Title</h4>
          <p hlmAlertDescription>This is a sample {{ variant }} alert with an icon, title and description.</p>
        </div>
      }
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

  // Map each variant to an icon
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
