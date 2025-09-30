import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HlmBadge, BadgeVariantType, BadgeSizeType, BadgeAppearanceType } from '@egose/shadcn-theme-ng/badge';

@Component({
  selector: 'app-badge-sample',
  standalone: true,
  imports: [CommonModule, HlmBadge],
  template: `
    <div class="">
      <h3 class="tw:text-2xl tw:font-bold">Badge</h3>

      <!-- Loop through appearances -->
      @for (appearance of appearances; track appearance) {
        <div class="tw:space-y-4 tw:mt-4">
          <h2 class="tw:text-xl tw:font-semibold">Appearance: {{ appearance }}</h2>

          <!-- Loop through sizes -->
          @for (size of sizes; track size) {
            <div>
              <h3 class="tw:font-medium tw:mb-1">Size: {{ size }}</h3>
              <div class="tw:flex tw:flex-wrap tw:gap-2">
                <!-- Loop through variants -->
                @for (variant of variants; track variant) {
                  <span hlmBadge [variant]="variant" [size]="size" [appearance]="appearance">
                    {{ variant }}
                  </span>
                }
              </div>
            </div>
          }
        </div>
      }
    </div>
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
}
