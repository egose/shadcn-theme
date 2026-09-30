import { Component, input, output } from '@angular/core';
import { HlmButton } from '@egose/shadcn-theme-ng/button';
import { HlmDropdownMenuImports } from '@egose/shadcn-theme-ng/dropdown-menu';
import type { TeamMember } from '../team-management-types';

@Component({
  selector: 'app-member-actions',
  imports: [HlmButton, HlmDropdownMenuImports],
  template: `
    <button
      hlmButton
      variant="secondary"
      appearance="outline"
      size="sm"
      type="button"
      [hlmDropdownMenuTrigger]="menu"
      [attr.aria-label]="'Member actions for ' + member().name"
      [attr.data-testid]="'menu-table-' + member().id"
    >
      Actions
    </button>
    <ng-template #menu>
      <div hlmDropdownMenu>
        <div hlmDropdownMenuLabel>{{ member().name }}</div>
        <div hlmDropdownMenuSeparator></div>
        <button hlmDropdownMenuItem type="button" (click)="viewDetails.emit(member())">View details</button>
        <button hlmDropdownMenuItem type="button" [disabled]="disabled()" (click)="changeRole.emit(member())">
          Change role
        </button>
        <button hlmDropdownMenuItem type="button" [disabled]="disabled()" (click)="remove.emit(member())">
          Remove
        </button>
      </div>
    </ng-template>
  `,
})
export class MemberActionsMenu {
  readonly member = input.required<TeamMember>();
  readonly disabled = input(false);
  readonly viewDetails = output<TeamMember>();
  readonly changeRole = output<TeamMember>();
  readonly remove = output<TeamMember>();
}
