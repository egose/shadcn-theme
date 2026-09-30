import { DatePipe } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { HlmAvatar, HlmAvatarFallback } from '@egose/shadcn-theme-ng/avatar';
import { HlmBadge, type BadgeVariantType } from '@egose/shadcn-theme-ng/badge';
import { memberInitials } from '../team-management-fixtures';
import type { TeamMember } from '../team-management-types';

@Component({
  selector: 'app-member-summary',
  imports: [DatePipe, HlmAvatar, HlmAvatarFallback, HlmBadge],
  template: `
    <div
      [attr.data-testid]="'member-row-' + member().id"
      class="tw:min-w-0 tw:whitespace-normal tw:break-words tw:pr-6"
    >
      <div class="tw:flex tw:min-w-0 tw:items-center tw:gap-3">
        <hlm-avatar aria-hidden="true" class="tw:shrink-0"
          ><span hlmAvatarFallback>{{ initials() }}</span></hlm-avatar
        >
        <div class="tw:min-w-0">
          <h3 class="tw:text-sm tw:font-semibold">{{ member().name }}</h3>
          <p class="tw:break-all tw:text-xs tw:text-slate-500">{{ member().email }}</p>
        </div>
      </div>
      <p class="tw:mt-3 tw:flex tw:flex-wrap tw:items-center tw:gap-2 tw:text-xs tw:text-slate-600">
        <span>{{ member().role }} · joined {{ member().joinedAtIso | date: 'mediumDate' : 'UTC' : 'en-US' }}</span>
        <span hlmBadge [variant]="variant()">{{ member().status }}</span>
      </p>
    </div>
  `,
  host: { class: 'tw:block tw:min-w-0' },
})
export class MemberSummary {
  readonly member = input.required<TeamMember>();
  protected readonly initials = computed(() => memberInitials(this.member().name));
  protected readonly variant = computed<BadgeVariantType>(
    () => (({ Active: 'success', Invited: 'warning', Suspended: 'destructive' }) as const)[this.member().status],
  );
}
