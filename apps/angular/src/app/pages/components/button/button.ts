import { Component } from '@angular/core';
import { EgButton, AppearanceType, VariantType, SizeType } from '@egose/shadcn-theme-ng/button';
import { NgIcon } from '@ng-icons/core';
import { tablerBrandAngular } from '@ng-icons/tabler-icons';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [EgButton, NgIcon],
  template: `
    <h1 class="font-bold text-2xl mt-4 mb-5">Button</h1>

    <ng-template #iconTemplate>
      <ng-icon [svg]="icon" />
    </ng-template>

    @for (section of sections; track section.title) {
      <div class="font-semibold mt-4">
        <h3>{{ section.title }}</h3>
        <div class="flex flex-wrap gap-2">
          @for (v of variants; track v) {
            <button
              egBtn
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
    { title: 'Basic - compact', size: 'compact-default' },

    { title: 'Outline', appearance: 'outline' },
    { title: 'Outline - disabled', appearance: 'outline', disabled: true },
    { title: 'Outline - loading', appearance: 'outline', loading: true },
    { title: 'Outline - disabled - loading', appearance: 'outline', disabled: true, loading: true },
    { title: 'Outline - compact', appearance: 'outline', size: 'compact-default' },

    { title: 'Outline filled', appearance: 'outlineFilled' },
    { title: 'Outline filled - disabled', appearance: 'outlineFilled', disabled: true },
    { title: 'Outline filled - loading', appearance: 'outlineFilled', loading: true },
    { title: 'Outline filled - disabled - loading', appearance: 'outlineFilled', disabled: true, loading: true },
    { title: 'Outline filled - compact', appearance: 'outlineFilled', size: 'compact-default' },

    { title: 'Icon (left)', icon: true, iconPosition: 'left' },
    { title: 'Icon (right)', icon: true, iconPosition: 'right' },
  ];
}
