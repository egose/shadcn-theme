import { Component } from '@angular/core';
import { DemoHeaderComponent } from '../../../shared/demo-header';
import { HlmAvatar, HlmAvatarFallback, HlmAvatarGroup } from '@egose/shadcn-theme-ng/avatar';

@Component({
  selector: 'app-avatar-page',
  imports: [DemoHeaderComponent, HlmAvatar, HlmAvatarFallback, HlmAvatarGroup],
  template: `
    <app-demo-header title="Avatar" description="User profile images." />
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
