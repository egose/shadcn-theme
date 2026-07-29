import { Component } from '@angular/core';
import { HlmButton, AppearanceType, VariantType, SizeType } from '@egose/shadcn-theme-ng/button';
import { NgIcon } from '@ng-icons/core';
import { tablerBrandAngular } from '@ng-icons/tabler-icons';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [HlmButton, NgIcon],
  template: `
    <section class="tw:space-y-8">
      <div class="tw:max-w-3xl tw:space-y-3">
        <h3 class="tw:text-2xl tw:font-bold tw:text-slate-950">Button</h3>
        <p class="tw:text-sm tw:leading-7 tw:text-slate-600 sm:tw:text-base">
          Buttons are one of the most visible primitives, so this page now leads with realistic action groups and keeps
          the full variant matrix as a secondary QA tool.
        </p>
      </div>

      <ng-template #iconTemplate>
        <ng-icon [svg]="icon" size="20px" />
      </ng-template>

      <div class="tw:grid tw:gap-6 xl:tw:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
        <div class="tw:grid tw:gap-6 lg:tw:grid-cols-2">
          <article class="tw:rounded-[28px] tw:border tw:border-slate-200 tw:bg-white tw:p-6 tw:shadow-sm">
            <div>
              <p class="tw:text-xs tw:font-semibold tw:uppercase tw:tracking-[0.2em] tw:text-slate-500">
                Primary actions
              </p>
              <h4 class="tw:mt-2 tw:text-lg tw:font-semibold tw:text-slate-900">Release controls</h4>
            </div>

            <div class="tw:mt-5 tw:flex tw:flex-wrap tw:gap-3">
              <button hlmButton variant="primary" [icon]="iconTemplate" type="button">Ship update</button>
              <button hlmButton variant="secondary" appearance="outline" type="button">Preview</button>
              <button hlmButton variant="muted" appearance="outline-filled" type="button">Save draft</button>
            </div>

            <div class="tw:mt-5 tw:flex tw:flex-wrap tw:gap-3">
              <button hlmButton variant="warning" appearance="outline" type="button">Request review</button>
              <button hlmButton variant="danger" appearance="outline-filled" type="button">Archive</button>
            </div>
          </article>

          <article
            class="tw:rounded-[28px] tw:border tw:border-slate-200 tw:bg-slate-950 tw:p-6 tw:text-white tw:shadow-sm"
          >
            <div>
              <p class="tw:text-xs tw:font-semibold tw:uppercase tw:tracking-[0.2em] tw:text-slate-400">States</p>
              <h4 class="tw:mt-2 tw:text-lg tw:font-semibold">Loading, icon, and compact sizes</h4>
            </div>

            <div class="tw:mt-5 tw:flex tw:flex-wrap tw:gap-3">
              <button hlmButton variant="light" [loading]="true" type="button">Publishing</button>
              <button hlmButton variant="accent" [icon]="iconTemplate" iconPosition="right" type="button">
                Continue
              </button>
              <button hlmButton variant="secondary" appearance="outline" size="compact-default" type="button">
                Compact
              </button>
            </div>

            <div class="tw:mt-5 tw:flex tw:flex-wrap tw:gap-3">
              <a hlmButton variant="link" appearance="solid">Documentation</a>
              <button hlmButton variant="dark" [disabled]="true" type="button">Disabled</button>
            </div>
          </article>
        </div>

        <aside class="tw:rounded-[28px] tw:border tw:border-slate-200 tw:bg-slate-50 tw:p-6">
          <h4 class="tw:text-lg tw:font-semibold tw:text-slate-900">Variant QA matrix</h4>
          <p class="tw:mt-2 tw:text-sm tw:leading-6 tw:text-slate-600">
            Keep the exhaustive checks, but don’t let them define the whole page.
          </p>

          @for (section of sections; track section.title) {
            <div class="tw:mt-5 tw:space-y-3">
              <h5 class="tw:text-sm tw:font-medium tw:text-slate-700">{{ section.title }}</h5>
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
                    type="button"
                  >
                    {{ v }}
                  </button>
                }
              </div>
            </div>
          }
        </aside>
      </div>
    </section>
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
