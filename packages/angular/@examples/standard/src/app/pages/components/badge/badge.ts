import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HlmBadge, BadgeVariantType, BadgeSizeType, BadgeAppearanceType } from '@egose/shadcn-theme-ng/badge';

@Component({
  selector: 'app-badge-sample',
  standalone: true,
  imports: [CommonModule, HlmBadge],
  template: `
    <section class="tw:space-y-8">
      <div class="tw:max-w-3xl tw:space-y-3">
        <h3 class="tw:text-2xl tw:font-bold tw:text-slate-950">Badge</h3>
        <p class="tw:text-sm tw:leading-7 tw:text-slate-600 sm:tw:text-base">
          Badges feel more useful when they annotate cards, queues, and health states. This page keeps a compact variant
          matrix but leads with realistic product surfaces.
        </p>
      </div>

      <div class="tw:grid tw:gap-6 xl:tw:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
        <div class="tw:grid tw:gap-6 lg:tw:grid-cols-2">
          <article class="tw:rounded-[28px] tw:border tw:border-slate-200 tw:bg-white tw:p-6 tw:shadow-sm">
            <div class="tw:flex tw:items-start tw:justify-between tw:gap-4">
              <div>
                <p class="tw:text-sm tw:font-medium tw:text-slate-900">Release board</p>
                <p class="tw:mt-1 tw:text-sm tw:text-slate-500">
                  Badges work best when they summarize status at a glance.
                </p>
              </div>
              <span hlmBadge variant="success">Stable</span>
            </div>

            <div class="tw:mt-6 tw:grid tw:gap-3">
              @for (item of boardStatuses; track item.label) {
                <div
                  class="tw:flex tw:items-center tw:justify-between tw:rounded-2xl tw:border tw:border-slate-200 tw:bg-slate-50 tw:p-4"
                >
                  <span class="tw:text-sm tw:font-medium tw:text-slate-800">{{ item.label }}</span>
                  <span hlmBadge [variant]="item.variant" [appearance]="item.appearance">{{ item.badge }}</span>
                </div>
              }
            </div>
          </article>

          <article
            class="tw:rounded-[28px] tw:border tw:border-slate-200 tw:bg-slate-950 tw:p-6 tw:text-white tw:shadow-sm"
          >
            <div class="tw:flex tw:items-start tw:justify-between tw:gap-4">
              <div>
                <p class="tw:text-sm tw:font-medium tw:text-slate-100">Issue queue</p>
                <p class="tw:mt-1 tw:text-sm tw:text-slate-300">
                  On darker surfaces, outline-filled badges help keep contrast balanced.
                </p>
              </div>
              <span hlmBadge variant="warning" appearance="outline-filled">Needs review</span>
            </div>

            <div class="tw:mt-6 tw:flex tw:flex-wrap tw:gap-2">
              @for (tag of issueTags; track tag.label) {
                <span hlmBadge [variant]="tag.variant" appearance="outline-filled">{{ tag.label }}</span>
              }
            </div>
          </article>
        </div>

        <aside class="tw:rounded-[28px] tw:border tw:border-slate-200 tw:bg-slate-50 tw:p-6">
          <h4 class="tw:text-lg tw:font-semibold tw:text-slate-900">Variant matrix</h4>
          <p class="tw:mt-2 tw:text-sm tw:leading-6 tw:text-slate-600">
            A smaller matrix is still useful for quick visual QA.
          </p>

          @for (appearance of appearances; track appearance) {
            <div class="tw:mt-5 tw:space-y-3">
              <h5 class="tw:text-sm tw:font-medium tw:capitalize tw:text-slate-700">{{ appearance }}</h5>
              @for (size of sizes; track size) {
                <div class="tw:space-y-2">
                  <p class="tw:text-xs tw:uppercase tw:tracking-[0.16em] tw:text-slate-500">{{ size }}</p>
                  <div class="tw:flex tw:flex-wrap tw:gap-2">
                    @for (variant of variants; track variant) {
                      <span hlmBadge [variant]="variant" [size]="size" [appearance]="appearance">{{ variant }}</span>
                    }
                  </div>
                </div>
              }
            </div>
          }
        </aside>
      </div>
    </section>
  `,
})
export class Badgeage {
  variants: BadgeVariantType[] = [
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

  sizes: BadgeSizeType[] = ['sm', 'default', 'lg'];

  appearances: BadgeAppearanceType[] = ['solid', 'outline', 'outline-filled'];

  boardStatuses = [
    {
      label: 'Button page',
      badge: 'Approved',
      variant: 'success' as BadgeVariantType,
      appearance: 'solid' as BadgeAppearanceType,
    },
    {
      label: 'Sidebar page',
      badge: 'Updated',
      variant: 'primary' as BadgeVariantType,
      appearance: 'outline' as BadgeAppearanceType,
    },
    {
      label: 'Empty states',
      badge: 'In review',
      variant: 'warning' as BadgeVariantType,
      appearance: 'outline-filled' as BadgeAppearanceType,
    },
    {
      label: 'Alert variants',
      badge: 'Blocked',
      variant: 'danger' as BadgeVariantType,
      appearance: 'solid' as BadgeAppearanceType,
    },
  ];

  issueTags = [
    { label: 'Spacing', variant: 'accent' as BadgeVariantType },
    { label: 'Hierarchy', variant: 'info' as BadgeVariantType },
    { label: 'Accessibility', variant: 'secondary' as BadgeVariantType },
    { label: 'Regression', variant: 'destructive' as BadgeVariantType },
  ];
}
