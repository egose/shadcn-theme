import { Component } from '@angular/core';
import { HlmButton, AppearanceType, VariantType, SizeType } from '@egose/shadcn-theme-ng/button';
import { NgIcon } from '@ng-icons/core';
import { tablerBrandAngular } from '@ng-icons/tabler-icons';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [HlmButton, NgIcon],
  template: `
    <div class="tw:space-y-8 tw:p-6">
      <h1 class="tw:text-2xl tw:font-bold">Button Showcase</h1>

      <ng-template #iconTemplate>
        <ng-icon [svg]="icon" />
      </ng-template>

      @for (section of sections; track section.title) {
        <div class="tw:font-semibold tw:mt-4">
          <h3>{{ section.title }}</h3>
          <div class="tw:flex tw:flex-wrap tw:gap-2">
            @for (v of variants; track v) {
              <button
                hlmButton
                [variant]="v"
                [appearance]="section.appearance ?? 'solid'"
                [size]="section.size ?? 'default'"
                [disabled]="section.disabled || false"
                [loading]="section.loading || false"
                [icon]="section.icon ? iconTemplate : null"
                [iconPosition]="section.iconPosition || 'left'"
              >
                {{ v }}
              </button>
            }
          </div>
        </div>
      }
    </div>
  `,
})
export class ButtonPage {
  icon = tablerBrandAngular;

  // Strongly typed variants
  variants: VariantType[] = [
    'primary',
    'secondary',
    'success',
    'warning',
    'danger',
    'info',
    'light',
    'dark',
    'link',
    'destructive',
    'accent',
    'muted',
  ];

  sections: {
    title: string;
    appearance?: AppearanceType;
    size?: SizeType;
    disabled?: boolean;
    loading?: boolean;
    icon?: boolean;
    iconPosition?: 'left' | 'right';
  }[] = [
    { title: 'Basic' },
    { title: 'Basic - disabled', disabled: true },
    { title: 'Basic - loading', loading: true },
    { title: 'Basic - disabled - loading', disabled: true, loading: true },
    { title: 'Basic - xs', size: 'xs' },
    { title: 'Basic - xs - loading', size: 'xs', loading: true },
    { title: 'Basic - sm', size: 'sm' },
    { title: 'Basic - lg', size: 'lg' },
    { title: 'Basic - compact', size: 'compact-default' },

    { title: 'Outline', appearance: 'outline' },
    { title: 'Outline - disabled', appearance: 'outline', disabled: true },
    { title: 'Outline - loading', appearance: 'outline', loading: true },
    { title: 'Outline - disabled - loading', appearance: 'outline', disabled: true, loading: true },
    { title: 'Outline - compact', appearance: 'outline', size: 'compact-default' },

    { title: 'Outline filled', appearance: 'outline-filled' },
    { title: 'Outline filled - disabled', appearance: 'outline-filled', disabled: true },
    { title: 'Outline filled - loading', appearance: 'outline-filled', loading: true },
    { title: 'Outline filled - disabled - loading', appearance: 'outline-filled', disabled: true, loading: true },
    { title: 'Outline filled - compact', appearance: 'outline-filled', size: 'compact-default' },

    { title: 'Icon (left)', icon: true, iconPosition: 'left' },
    { title: 'Icon (right)', icon: true, iconPosition: 'right' },
  ];
}
