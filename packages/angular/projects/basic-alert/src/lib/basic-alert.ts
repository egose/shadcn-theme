import { Component, input } from '@angular/core';
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
  HlmAlertIcon,
  HlmAlertTitle,
  HlmAlertDescription,
  type VariantType,
  type AppearanceType,
} from '@egose/shadcn-theme-ng/alert';
import { HlmIcon } from '@egose/shadcn-theme-ng/icon';

@Component({
  selector: 'eg-basic-alert',
  standalone: true,
  imports: [HlmAlert, HlmAlertIcon, HlmAlertTitle, HlmAlertDescription, NgIcon, HlmIcon],
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
    <div hlmAlert [variant]="variant()" [appearance]="appearance()" class="">
      <ng-icon hlm hlmAlertIcon [name]="getIconName(variant())" />
      <h4 hlmAlertTitle class="tw:capitalize">{{ title() }}</h4>
      <p hlmAlertDescription>{{ description() }}</p>
    </div>
  `,
})
export class EgBasicAlert {
  variant = input<VariantType>('info');
  appearance = input<AppearanceType>('solid');
  title = input<string>('');
  description = input<string>('');

  getIconName(variant: VariantType): string {
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
