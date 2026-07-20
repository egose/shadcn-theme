import { Component } from '@angular/core';
import { HlmSkeleton } from '@egose/shadcn-theme-ng/skeleton';

@Component({
  selector: 'app-skeleton-page',
  imports: [HlmSkeleton],
  template: `
    <h3 class="tw:text-2xl tw:font-bold tw:mb-2">Skeleton</h3>
    <p class="tw:text-gray-500 tw:mb-4">A placeholder for loading content.</p>
    <div class="tw:flex tw:items-center tw:gap-4">
      <hlm-skeleton class="tw:h-12 tw:w-12 tw:rounded-full" />
      <div class="tw:flex tw:flex-col tw:gap-2">
        <hlm-skeleton class="tw:h-4 tw:w-[250px]" />
        <hlm-skeleton class="tw:h-4 tw:w-[200px]" />
      </div>
    </div>
  `,
})
export class SkeletonPage {}
