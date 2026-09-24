import { Component } from '@angular/core';
import { DemoHeaderComponent } from '../../../shared/demo-header';
import { DemoSectionComponent } from '../../../shared/demo-section';
import {
  HlmAvatar,
  HlmAvatarBadge,
  HlmAvatarFallback,
  HlmAvatarGroup,
  HlmAvatarGroupCount,
  HlmAvatarImage,
} from '@egose/shadcn-theme-ng/avatar';

@Component({
  selector: 'app-avatar-page',
  imports: [
    DemoHeaderComponent,
    DemoSectionComponent,
    HlmAvatar,
    HlmAvatarFallback,
    HlmAvatarGroup,
    HlmAvatarGroupCount,
    HlmAvatarImage,
    HlmAvatarBadge,
  ],
  template: `
    <app-demo-header title="Avatar" description="User profile images with fallback, sizes, and groups." />

    <div class="tw:grid tw:gap-6 md:tw:grid-cols-2">
      <app-demo-section kicker="Fallback" title="Initials" description="Fallback initials when no image loads.">
        <div class="tw:flex tw:items-center tw:gap-3">
          <hlm-avatar>
            <span hlmAvatarFallback>AB</span>
          </hlm-avatar>
          <hlm-avatar>
            <span hlmAvatarFallback>CD</span>
          </hlm-avatar>
        </div>
      </app-demo-section>

      <app-demo-section kicker="Image" title="With photo" description="Remote image with initials fallback.">
        <hlm-avatar>
          <img hlmAvatarImage src="https://github.com/shadcn.png" alt="shadcn" />
          <span hlmAvatarFallback>CN</span>
        </hlm-avatar>
      </app-demo-section>

      <app-demo-section kicker="Size" title="Small / default / large" description="Density options.">
        <div class="tw:flex tw:items-center tw:gap-3">
          <hlm-avatar size="sm">
            <span hlmAvatarFallback>SM</span>
          </hlm-avatar>
          <hlm-avatar size="default">
            <span hlmAvatarFallback>MD</span>
          </hlm-avatar>
          <hlm-avatar size="lg">
            <span hlmAvatarFallback>LG</span>
          </hlm-avatar>
        </div>
      </app-demo-section>

      <app-demo-section kicker="Status" title="With badge" description="Presence indicator.">
        <hlm-avatar>
          <span hlmAvatarFallback>AB</span>
          <span hlmAvatarBadge class="tw:bg-emerald-500"></span>
        </hlm-avatar>
      </app-demo-section>

      <app-demo-section kicker="Group" title="Stacked with count" description="Overlapping group plus overflow count.">
        <div hlmAvatarGroup class="tw:gap-2">
          <hlm-avatar>
            <span hlmAvatarFallback>AB</span>
          </hlm-avatar>
          <hlm-avatar>
            <span hlmAvatarFallback>CD</span>
          </hlm-avatar>
          <hlm-avatar>
            <span hlmAvatarFallback>EF</span>
          </hlm-avatar>
          <span hlmAvatarGroupCount>+5</span>
        </div>
      </app-demo-section>
    </div>
  `,
})
export class AvatarPage {}
