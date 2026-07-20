import { Component } from '@angular/core';
import { HlmAvatar, HlmAvatarFallback, HlmAvatarGroup } from '@egose/shadcn-theme-ng/avatar';

@Component({
  selector: 'app-avatar-page',
  imports: [HlmAvatar, HlmAvatarFallback, HlmAvatarGroup],
  template: `
    <h3 class="tw:text-2xl tw:font-bold tw:mb-2">Avatar</h3>
    <p class="tw:text-gray-500 tw:mb-4">User profile images.</p>
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
    </div>
  `,
})
export class AvatarPage {}
