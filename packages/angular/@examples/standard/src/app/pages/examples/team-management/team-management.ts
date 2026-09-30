import { Component, DestroyRef, ElementRef, computed, effect, inject, signal, untracked } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { defaultIfEmpty, firstValueFrom, take } from 'rxjs';
import { HlmButton } from '@egose/shadcn-theme-ng/button';
import { EgBasicAlert } from '@egose/shadcn-theme-ng/basic-alert';
import { EgConfirmationDialog } from '@egose/shadcn-theme-ng/confirmation-dialog';
import { HlmDialogService } from '@egose/shadcn-theme-ng/dialog';
import { HlmEmptyImports } from '@egose/shadcn-theme-ng/empty';
import { HlmInputGroupImports } from '@egose/shadcn-theme-ng/input-group';
import { HlmNativeSelectImports } from '@egose/shadcn-theme-ng/native-select';
import { HlmPaginationImports } from '@egose/shadcn-theme-ng/pagination';
import { HlmSkeleton } from '@egose/shadcn-theme-ng/skeleton';
import { DemoHeaderComponent } from '../../../shared/demo-header';
import { EXAMPLE_READ_ONLY_MESSAGE, type ExampleViewState } from '../../../shared/real-examples/example-view-state';
import { ExampleStateToolbarComponent } from '../../../shared/real-examples/example-state-toolbar';
import { simulateExampleLoad } from '../../../shared/real-examples/async-simulator';
import {
  EXAMPLE_MEMBERS,
  INVITED_MEMBER_JOINED_AT_ISO,
  MEMBER_ROLES,
  ROLE_FILTERS,
  STATUS_FILTERS,
  TEAM_PAGE_SIZE,
  filterMembers,
  isMemberRole,
  normalizeMemberEmail,
  slugifyMemberId,
} from './team-management-fixtures';
import type {
  BulkRoleRequest,
  InviteMemberContext,
  InviteMemberResult,
  MemberOperation,
  MemberOutcome,
  MemberRole,
  RoleChangeContext,
  RoleChangeResult,
  RoleFilter,
  StatusFilter,
  TeamMember,
} from './team-management-types';
import { InviteMemberDialog } from './components/invite-member-dialog';
import { ChangeRoleDialog } from './components/change-role-dialog';
import { MemberRoster } from './components/member-roster';

@Component({
  selector: 'app-team-management-example',
  imports: [
    DemoHeaderComponent,
    ExampleStateToolbarComponent,
    HlmButton,
    EgBasicAlert,
    HlmEmptyImports,
    HlmInputGroupImports,
    HlmNativeSelectImports,
    HlmPaginationImports,
    HlmSkeleton,
    MemberRoster,
    ReactiveFormsModule,
  ],
  templateUrl: './team-management.html',
})
export class TeamManagementExamplePage {
  private readonly _fb = inject(FormBuilder);
  private readonly _dialogs = inject(HlmDialogService);
  private readonly _destroyRef = inject(DestroyRef);
  private readonly _host = inject<ElementRef<HTMLElement>>(ElementRef);
  private _alive = true;
  private _session = 0;
  private _closeDialog: (() => void) | null = null;
  private _lastRemoved: { member: TeamMember; index: number } | null = null;
  private readonly _bulkRequest = signal<BulkRoleRequest | null>(null);

  protected readonly viewState = signal<ExampleViewState>('loaded');
  protected readonly readOnly = signal(false);
  protected readonly simulateFailure = signal(false);
  private _observedState: ExampleViewState = 'loaded';
  private _observedReadOnly = false;
  protected readonly members = signal<readonly TeamMember[]>(EXAMPLE_MEMBERS);
  protected readonly outcome = signal<MemberOutcome | null>(null);
  protected readonly details = signal<TeamMember | null>(null);
  protected readonly loadError = signal<string | null>(null);
  protected readonly operation = signal<MemberOperation | null>(null);
  protected readonly bulkError = signal<string | null>(null);
  protected readonly sessionNotice = signal<string | null>(null);
  protected readonly bulkRole = new FormControl<MemberRole>('Viewer', { nonNullable: true });
  protected readonly rosterVersion = signal(0);
  protected readonly rosterSessions = computed(() => [{ id: this.rosterVersion() }]);
  protected readonly canRetryBulk = computed(() => this._bulkRequest() !== null && !this.mutationDisabled());
  protected readonly page = signal(1);
  private readonly _selectedIds = signal<readonly string[]>([]);
  protected readonly filterForm = this._fb.nonNullable.group({
    search: '',
    status: this._fb.nonNullable.control<StatusFilter>('All'),
    role: this._fb.nonNullable.control<RoleFilter>('All'),
  });
  private readonly _rawFilters = toSignal(this.filterForm.valueChanges, {
    initialValue: this.filterForm.getRawValue(),
  });
  private readonly _filters = computed(() => ({
    search: this._rawFilters().search ?? '',
    status: this._rawFilters().status ?? 'All',
    role: this._rawFilters().role ?? 'All',
  }));
  protected readonly loadingSlots = [0, 1, 2];
  protected readonly statusOptions = STATUS_FILTERS;
  protected readonly roleOptions = ROLE_FILTERS;
  protected readonly assignableRoles = MEMBER_ROLES;
  protected readonly READ_ONLY_MESSAGE = EXAMPLE_READ_ONLY_MESSAGE;
  protected readonly mutationDisabled = computed(
    () => this.readOnly() || this.viewState() !== 'loaded' || this.operation() !== null,
  );
  protected readonly filteredMembers = computed(() => {
    const filters = this._filters();
    return filterMembers(this.members(), filters.search, filters.status, filters.role);
  });
  protected readonly hasSearch = computed(() => this._filters().search.trim() !== '');
  protected readonly hasActiveFilters = computed(() => {
    const filters = this._filters();
    return filters.search.trim() !== '' || filters.status !== 'All' || filters.role !== 'All';
  });
  protected readonly pageCount = computed(() => Math.max(1, Math.ceil(this.filteredMembers().length / TEAM_PAGE_SIZE)));
  protected readonly safePage = computed(() => Math.min(Math.max(this.page(), 1), this.pageCount()));
  protected readonly pageNumbers = computed(() => Array.from({ length: this.pageCount() }, (_, index) => index + 1));
  protected readonly visibleMembers = computed(() =>
    this.filteredMembers().slice((this.safePage() - 1) * TEAM_PAGE_SIZE, this.safePage() * TEAM_PAGE_SIZE),
  );
  protected readonly selectedMembers = computed(() =>
    this.visibleMembers().filter((member) => this._selectedIds().includes(member.id)),
  );
  protected readonly rangeSummary = computed(() => {
    const total = this.filteredMembers().length;
    if (!total) return 'Showing 0 members.';
    return `Showing ${(this.safePage() - 1) * TEAM_PAGE_SIZE + 1}–${Math.min(this.safePage() * TEAM_PAGE_SIZE, total)} of ${total} members · Page ${this.safePage()} of ${this.pageCount()}.`;
  });

  constructor() {
    effect(() => {
      this.viewState();
      this.readOnly();
      untracked(() => this._syncSession());
    });
    this.filterForm.valueChanges.pipe(takeUntilDestroyed()).subscribe(() => {
      this._cancelBulk();
      this.page.set(1);
    });
    this.bulkRole.valueChanges.pipe(takeUntilDestroyed()).subscribe(() => this._cancelBulk());
    this._destroyRef.onDestroy(() => {
      this._alive = false;
      this._invalidate();
    });
  }

  protected setViewState(state: ExampleViewState): void {
    this.viewState.set(state);
    this._syncSession();
  }
  protected setReadOnly(value: boolean): void {
    this.readOnly.set(value);
    this._syncSession();
  }

  /** Every entry and settlement synchronizes permission/preview boundaries, even before effects run. */
  private _syncSession(): void {
    if (this._observedState === this.viewState() && this._observedReadOnly === this.readOnly()) return;
    const permissionChanged = this._observedReadOnly !== this.readOnly();
    const wasPending = this.operation() !== null || this._observedState === 'loading';
    this._observedState = this.viewState();
    this._observedReadOnly = this.readOnly();
    this._invalidate();
    if (wasPending)
      this.sessionNotice.set(
        'Pending work was cancelled by a permission or preview change. Start the action again to retry.',
      );
    if (permissionChanged && this.viewState() === 'loading') {
      this.viewState.set('loaded');
      this._observedState = 'loaded';
    }
  }

  private _invalidate(): void {
    this._session++;
    const close = this._closeDialog;
    this._closeDialog = null;
    this.operation.set(null);
    this._lastRemoved = null;
    this._bulkRequest.set(null);
    this.bulkError.set(null);
    this.outcome.set(null);
    this.details.set(null);
    this._clearSelection();
    close?.();
  }

  private _clearSelection(): void {
    this._selectedIds.set([]);
    this.rosterVersion.update((value) => value + 1);
  }
  private _canStart(): boolean {
    this._syncSession();
    return this._alive && !this.mutationDisabled();
  }
  private _current(token: number): boolean {
    this._syncSession();
    return this._alive && token === this._session;
  }
  private _canCommit(token: number): boolean {
    return this._current(token) && !this.readOnly() && this.viewState() === 'loaded';
  }
  private _memberCurrent(member: TeamMember): boolean {
    return this.members().find((row) => row.id === member.id) === member;
  }
  private _emailExists(email: string): boolean {
    return this.members().some((member) => normalizeMemberEmail(member.email) === normalizeMemberEmail(email));
  }
  private _begin(operation: MemberOperation): number {
    this.sessionNotice.set(null);
    this.operation.set(operation);
    return ++this._session;
  }
  private _record(message: string): void {
    this._lastRemoved = null;
    this.details.set(null);
    this.outcome.set({ message, canUndo: false });
  }

  private _focusAfterRender(testId: string): void {
    const token = this._session;
    setTimeout(() => {
      if (this._current(token))
        this._host.nativeElement.querySelector<HTMLElement>(`[data-testid="${testId}"]`)?.focus();
    });
  }

  /** Open the public confirmation component directly so this session owns its close handle. */
  private async _confirm(context: { title: string; description: string }): Promise<boolean> {
    const ref = this._dialogs.open<boolean>(EgConfirmationDialog, {
      context,
      contentClass: 'tw:w-full tw:max-w-[425px] tw:break-words',
    });
    const close = () => ref.close(false);
    this._closeDialog = close;
    try {
      return (
        (await firstValueFrom(
          ref.closed$.pipe(take(1), takeUntilDestroyed(this._destroyRef), defaultIfEmpty(false)),
        )) ?? false
      );
    } finally {
      if (this._closeDialog === close) this._closeDialog = null;
    }
  }

  protected clearSearch(): void {
    this.filterForm.controls.search.setValue('');
  }
  protected clearFilters(): void {
    this.filterForm.setValue({ search: '', status: 'All', role: 'All' });
  }
  protected goToPage(page: number): void {
    this._cancelBulk();
    this.page.set(Math.min(Math.max(page, 1), this.pageCount()));
  }

  protected inviteMember(): void {
    if (!this._canStart()) return;
    const token = this._begin('invite');
    const ref = this._dialogs.open<InviteMemberResult | null>(InviteMemberDialog, {
      context: { emailExists: (email) => this._emailExists(email) } satisfies InviteMemberContext,
      contentClass: 'tw:w-full tw:max-w-[425px]',
    });
    this._closeDialog = () => ref.close(null);
    ref.closed$.pipe(take(1), takeUntilDestroyed(this._destroyRef)).subscribe((result) => {
      if (!this._canCommit(token)) return;
      this.operation.set(null);
      this._closeDialog = null;
      if (!result) {
        this._focusAfterRender('invite-member');
        return;
      }
      const name = result.name.trim();
      const email = normalizeMemberEmail(result.email);
      if (
        name.length < 2 ||
        !email ||
        Validators.email(new FormControl(email)) ||
        !isMemberRole(result.role) ||
        this._emailExists(email)
      )
        return;
      const taken = new Set(this.members().map((member) => member.id));
      const base = slugifyMemberId(name);
      let id = base;
      let suffix = 2;
      while (taken.has(id)) id = `${base}-${suffix++}`;
      const member: TeamMember = {
        id,
        name,
        email,
        role: result.role,
        status: 'Invited',
        joinedAtIso: INVITED_MEMBER_JOINED_AT_ISO,
      };
      this.members.update((list) => [...list, member]);
      const filters = this._filters();
      if (filterMembers([member], filters.search, filters.status, filters.role).length) this.page.set(this.pageCount());
      this._record(`${member.name} invited as ${member.role}. They now appear with Invited status. No email was sent.`);
      this._focusAfterRender('member-outcome');
    });
  }

  protected openRoleDialog(member: TeamMember): void {
    if (!this._canStart() || !this._memberCurrent(member)) return;
    const token = this._begin('role');
    const ref = this._dialogs.open<RoleChangeResult | null>(ChangeRoleDialog, {
      context: { memberName: member.name, currentRole: member.role } satisfies RoleChangeContext,
      contentClass: 'tw:w-full tw:max-w-[425px]',
    });
    this._closeDialog = () => ref.close(null);
    ref.closed$.pipe(take(1), takeUntilDestroyed(this._destroyRef)).subscribe((result) => {
      if (!this._canCommit(token)) return;
      this.operation.set(null);
      this._closeDialog = null;
      this._focusAfterRender(`menu-table-${member.id}`);
      if (!result || !isMemberRole(result.role) || result.role === member.role || !this._memberCurrent(member)) return;
      this.members.update((list) => list.map((row) => (row.id === member.id ? { ...row, role: result.role } : row)));
      this.page.set(this.safePage());
      this._record(`${member.name} is now ${result.role}.`);
      this._focusAfterRender('member-outcome');
    });
  }

  protected showDetails(member: TeamMember): void {
    const current = this.members().find((row) => row.id === member.id);
    if (this._alive && current) this.details.set(current);
  }

  protected async requestRemove(member: TeamMember): Promise<void> {
    if (!this._canStart() || !this._memberCurrent(member)) return;
    const token = this._begin('remove');
    const confirmed = await this._confirm({
      title: `Remove ${member.name}?`,
      description:
        'This removes the member only from this local preview. Undo is single-use until the next successful mutation, permission/preview change, reset, reload, or leaving this page. No real access changes.',
    });
    if (!this._canCommit(token)) return;
    this.operation.set(null);
    this._focusAfterRender(`menu-table-${member.id}`);
    if (!confirmed || !this._memberCurrent(member)) return;
    const list = this.members();
    this._lastRemoved = { member, index: list.indexOf(member) };
    this.members.set(list.filter((row) => row.id !== member.id));
    this.page.set(this.safePage());
    this.details.set(null);
    this.outcome.set({
      message: `${member.name} removed. Undo restores this local member once, until the next successful mutation or session change. No real access changed.`,
      canUndo: true,
    });
    this._focusAfterRender('member-outcome');
  }

  protected undoRemove(): void {
    if (!this._canStart()) return;
    const removed = this._lastRemoved;
    if (
      !removed ||
      this.members().some((member) => member.id === removed.member.id) ||
      this._emailExists(removed.member.email)
    )
      return;
    this.members.update((list) => {
      const next = [...list];
      next.splice(Math.min(removed.index, next.length), 0, removed.member);
      return next;
    });
    this._record(`${removed.member.name} restored with ${removed.member.role} access in this local preview only.`);
    this._focusAfterRender('member-outcome');
  }

  protected selectMembers(members: readonly TeamMember[]): void {
    const ids = members
      .filter((member) => this.visibleMembers().some((row) => row.id === member.id))
      .map((member) => member.id);
    const previous = this._selectedIds();
    if (ids.length !== previous.length || ids.some((id) => !previous.includes(id))) this._cancelBulk();
    this._selectedIds.set(ids);
  }

  private _cancelBulk(): void {
    if (this.operation() === 'bulk-confirm' || this.operation() === 'bulk-save') {
      this._session++;
      this.operation.set(null);
      const close = this._closeDialog;
      this._closeDialog = null;
      close?.();
      this.bulkError.set(
        'Bulk change cancelled because its selection, page, filters, or role changed. Select members and confirm again.',
      );
    } else {
      this.bulkError.set(null);
    }
    this._bulkRequest.set(null);
  }

  private _bulkCurrent(request: BulkRoleRequest): boolean {
    const selected = this.selectedMembers();
    return (
      request.members.length > 0 &&
      request.members.length <= TEAM_PAGE_SIZE &&
      isMemberRole(request.role) &&
      request.role === this.bulkRole.value &&
      selected.length === request.members.length &&
      request.members.every((member) => this._memberCurrent(member) && selected.some((row) => row.id === member.id))
    );
  }

  protected async changeSelectedRoles(): Promise<void> {
    if (!this._canStart()) return;
    const request: BulkRoleRequest = { members: [...this.selectedMembers()], role: this.bulkRole.value };
    if (!this._bulkCurrent(request)) return;
    const token = this._begin('bulk-confirm');
    this.bulkError.set(null);
    const confirmed = await this._confirm({
      title: `Change ${request.members.length} selected members to ${request.role}?`,
      description: `Only these member IDs will change: ${request.members.map((member) => `${member.name} (${member.id})`).join(', ')}. This is a local preview.`,
    });
    if (!this._canCommit(token)) return;
    this.operation.set(null);
    if (!confirmed) {
      this._focusAfterRender('bulk-change');
      return;
    }
    if (!this._bulkCurrent(request)) {
      this.bulkError.set('The selected members changed. Select members and confirm again.');
      return;
    }
    this._bulkRequest.set(request);
    await this._saveBulk(request);
  }

  protected async retryBulk(): Promise<void> {
    const request = this._bulkRequest();
    if (!this._canStart() || !request) return;
    if (!this._bulkCurrent(request)) {
      this._bulkRequest.set(null);
      this.bulkError.set('The selected members changed. Select members and confirm again.');
      return;
    }
    await this._saveBulk(request);
  }

  private async _saveBulk(request: BulkRoleRequest): Promise<void> {
    const token = this._begin('bulk-save');
    this.bulkError.set(null);
    try {
      await simulateExampleLoad(null, {
        shouldFail: this.simulateFailure(),
        errorMessage: 'Bulk role change failed. No members changed.',
      });
      if (!this._canCommit(token)) return;
      if (!this._bulkCurrent(request)) {
        this._bulkRequest.set(null);
        this.bulkError.set('The selected members changed. Select members and confirm again.');
        return;
      }
      const ids = new Set(request.members.map((member) => member.id));
      this.members.update((list) =>
        list.map((member) => (ids.has(member.id) ? { ...member, role: request.role } : member)),
      );
      this._bulkRequest.set(null);
      this._record(`${ids.size} selected members now have ${request.role} roles in this local preview.`);
      this.page.set(this.safePage());
      this._clearSelection();
      this._focusAfterRender('member-outcome');
    } catch (error) {
      if (this._canCommit(token)) {
        if (!this._bulkCurrent(request)) {
          this._bulkRequest.set(null);
          this.bulkError.set('The selected members changed. Select members and confirm again.');
        } else {
          this.bulkError.set(error instanceof Error ? error.message : 'Bulk role change failed. No members changed.');
        }
      }
    } finally {
      if (this._current(token)) this.operation.set(null);
    }
  }

  protected resetFixtures(): void {
    if (!this._alive) return;
    this._invalidate();
    this.members.set(EXAMPLE_MEMBERS);
    this.clearFilters();
    this.page.set(1);
    this.loadError.set(null);
    this.setViewState('loaded');
    this.sessionNotice.set('Local changes were discarded and fixtures restored.');
  }

  protected async reload(): Promise<void> {
    if (!this._alive) return;
    this._invalidate();
    this.setViewState('loading');
    this.loadError.set(null);
    this.sessionNotice.set(null);
    const token = this._session;
    try {
      const members = await simulateExampleLoad(EXAMPLE_MEMBERS, { shouldFail: this.simulateFailure() });
      if (!this._current(token)) return;
      this.members.set(members);
      this.clearFilters();
      this.page.set(1);
      this.setViewState('loaded');
      this.sessionNotice.set('Local changes were discarded and fixtures reloaded.');
    } catch (error) {
      if (!this._current(token)) return;
      this.loadError.set(error instanceof Error ? error.message : 'Members failed to load.');
      this.setViewState('error');
      this.sessionNotice.set(null);
    }
  }
}
