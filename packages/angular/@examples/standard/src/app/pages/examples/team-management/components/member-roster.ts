import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, inject, input, inputBinding, output, outputBinding } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { EgDataTable, type EgDataTableFeatures } from '@egose/shadcn-theme-ng/data-table';
import { createColumnHelper, flexRenderComponent } from '@tanstack/angular-table';
import { TEAM_PAGE_SIZE } from '../team-management-fixtures';
import type { TeamMember } from '../team-management-types';
import { MemberActionsMenu } from './member-actions';
import { MemberSummary } from './member-summary';

const helper = createColumnHelper<EgDataTableFeatures, TeamMember>();

/** One table instance owns selection in both layouts; the route owns the only pager. */
@Component({
  selector: 'app-member-roster',
  imports: [EgDataTable],
  template: `
    <eg-data-table
      data-testid="member-roster"
      [columns]="columns"
      [gridColumns]="columns"
      [layout]="narrow()?.matches ? 'grid' : 'table'"
      [showLayoutToggle]="false"
      [data]="members()"
      [getRowId]="getRowId"
      [enableSelection]="true"
      [hideFooter]="true"
      [defaultPageSize]="pageSize"
      (selectionChange)="selectionChange.emit($event)"
    />
  `,
  host: { class: 'tw:block tw:min-w-0' },
})
export class MemberRoster {
  readonly members = input.required<readonly TeamMember[]>();
  readonly disabled = input(false);
  readonly selectionChange = output<readonly TeamMember[]>();
  readonly viewDetails = output<TeamMember>();
  readonly changeRole = output<TeamMember>();
  readonly remove = output<TeamMember>();
  protected readonly narrow = toSignal(inject(BreakpointObserver).observe('(max-width: 767px)'));
  protected readonly pageSize = TEAM_PAGE_SIZE;
  protected readonly getRowId = (member: TeamMember): string => member.id;
  protected readonly columns = helper.columns([
    helper.accessor('name', {
      header: 'Member',
      cell: (info) =>
        flexRenderComponent(MemberSummary, {
          bindings: [inputBinding('member', () => this._currentMember(info.row.original))],
        }),
    }),
    helper.display({
      id: 'actions',
      header: 'Actions',
      enableSorting: false,
      cell: (info) =>
        flexRenderComponent(MemberActionsMenu, {
          bindings: [
            inputBinding('member', () => this._currentMember(info.row.original)),
            inputBinding('disabled', this.disabled),
            outputBinding<TeamMember>('viewDetails', (member) => this.viewDetails.emit(member)),
            outputBinding<TeamMember>('changeRole', (member) => this.changeRole.emit(member)),
            outputBinding<TeamMember>('remove', (member) => this.remove.emit(member)),
          ],
        }),
    }),
  ]);

  // FlexRender can retain the cell component while a stable row ID is refreshed.
  // Bind to the current input signal, not just the original cell-context object.
  private _currentMember(original: TeamMember): TeamMember {
    return this.members().find((member) => member.id === original.id) ?? original;
  }
}
