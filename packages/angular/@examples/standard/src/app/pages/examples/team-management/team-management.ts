import { DatePipe } from '@angular/common';
import { Component, computed, inject, input, output, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { BrnDialogRef, injectBrnDialogContext } from '@spartan-ng/brain/dialog';
import { HlmAvatar, HlmAvatarFallback } from '@egose/shadcn-theme-ng/avatar';
import { HlmBadge, type BadgeVariantType } from '@egose/shadcn-theme-ng/badge';
import { EgBasicAlert } from '@egose/shadcn-theme-ng/basic-alert';
import { HlmButton } from '@egose/shadcn-theme-ng/button';
import { EgConfirmationDialogService } from '@egose/shadcn-theme-ng/confirmation-dialog';
import {
  HlmDialogDescription,
  HlmDialogFooter,
  HlmDialogHeader,
  HlmDialogService,
  HlmDialogTitle,
} from '@egose/shadcn-theme-ng/dialog';
import { HlmDropdownMenuImports } from '@egose/shadcn-theme-ng/dropdown-menu';
import { HlmEmptyImports } from '@egose/shadcn-theme-ng/empty';
import { HlmInput } from '@egose/shadcn-theme-ng/input';
import { HlmInputGroupImports } from '@egose/shadcn-theme-ng/input-group';
import { HlmLabel } from '@egose/shadcn-theme-ng/label';
import { HlmNativeSelectImports } from '@egose/shadcn-theme-ng/native-select';
import { HlmPaginationImports } from '@egose/shadcn-theme-ng/pagination';
import { HlmSkeleton } from '@egose/shadcn-theme-ng/skeleton';
import {
  HlmCaption,
  HlmTable,
  HlmTableContainer,
  HlmTBody,
  HlmTd,
  HlmTh,
  HlmTHead,
  HlmTr,
} from '@egose/shadcn-theme-ng/table';
import { DemoHeaderComponent } from '../../../shared/demo-header';
import { EXAMPLE_READ_ONLY_MESSAGE, ExampleViewState } from '../../../shared/real-examples/example-view-state';
import { ExampleStateToolbarComponent } from '../../../shared/real-examples/example-state-toolbar';
import { simulateExampleLoad } from '../../../shared/real-examples/async-simulator';
import {
  EXAMPLE_MEMBERS,
  INVITED_MEMBER_JOINED_AT_ISO,
  MEMBER_ROLES,
  MemberRole,
  ROLE_FILTERS,
  RoleFilter,
  STATUS_FILTERS,
  StatusFilter,
  TEAM_PAGE_SIZE,
  TeamMember,
  filterMembers,
  memberInitials,
  slugifyMemberId,
} from './team-management-fixtures';

export interface InviteMemberResult {
  readonly name: string;
  readonly email: string;
  readonly role: MemberRole;
}

export interface RoleChangeContext {
  readonly memberName: string;
  readonly currentRole: MemberRole;
}

export interface RoleChangeResult {
  readonly role: MemberRole;
}

interface MemberOutcome {
  readonly message: string;
  readonly canUndo: boolean;
}

/**
 * Invite-member dialog. Carries its own typed form so name, email, and role
 * are validated before the page records a visible outcome. Inviting only
 * previews the roster change; no backend is involved.
 */
@Component({
  imports: [
    ReactiveFormsModule,
    HlmButton,
    HlmDialogDescription,
    HlmDialogFooter,
    HlmDialogHeader,
    HlmDialogTitle,
    HlmInput,
    HlmLabel,
    HlmNativeSelectImports,
  ],
  template: `
    <form [formGroup]="form" (ngSubmit)="submit()" novalidate class="tw:contents">
      <hlm-dialog-header>
        <h3 hlmDialogTitle>Invite teammate</h3>
        <p hlmDialogDescription>
          Send a workspace invitation. The new member joins with Invited status and the chosen role.
        </p>
      </hlm-dialog-header>

      <div class="tw:grid tw:gap-3 tw:py-4">
        <div class="tw:grid tw:gap-2">
          <label hlmLabel for="invite-name">Full name</label>
          <input hlmInput id="invite-name" data-testid="invite-name" formControlName="name" autocomplete="name" />
          @if (nameError(); as error) {
            <p data-testid="invite-name-error" class="tw:text-sm tw:text-red-600">{{ error }}</p>
          }
        </div>
        <div class="tw:grid tw:gap-2">
          <label hlmLabel for="invite-email">Work email</label>
          <input
            hlmInput
            id="invite-email"
            data-testid="invite-email"
            type="email"
            formControlName="email"
            autocomplete="email"
          />
          @if (emailError(); as error) {
            <p data-testid="invite-email-error" class="tw:text-sm tw:text-red-600">{{ error }}</p>
          }
        </div>
        <div class="tw:grid tw:gap-2">
          <label hlmLabel for="invite-role">Role</label>
          <hlm-native-select selectId="invite-role" formControlName="role" data-testid="invite-role">
            @for (role of roleOptions; track role) {
              <option [value]="role">{{ role }}</option>
            }
          </hlm-native-select>
        </div>
      </div>

      <hlm-dialog-footer>
        <button hlmButton type="button" variant="secondary" appearance="outline" (click)="cancel()">Cancel</button>
        <button hlmButton type="submit" variant="primary" data-testid="invite-submit">Send invite</button>
      </hlm-dialog-footer>
    </form>
  `,
  host: { class: 'tw:flex tw:flex-col tw:gap-2' },
})
export class InviteMemberDialog {
  private readonly _dialogRef = inject<BrnDialogRef<InviteMemberResult | null>>(BrnDialogRef);
  private readonly _fb = inject(FormBuilder);

  protected readonly roleOptions = MEMBER_ROLES;
  protected readonly form = this._fb.nonNullable.group({
    name: this._fb.nonNullable.control('', {
      validators: [Validators.required, Validators.minLength(2)],
    }),
    email: this._fb.nonNullable.control('', {
      validators: [Validators.required, Validators.email],
    }),
    role: this._fb.nonNullable.control<MemberRole>('Member', {
      validators: [Validators.required],
    }),
  });

  protected nameError(): string | null {
    const control = this.form.controls.name;
    if (!control.touched || control.valid) return null;
    if (control.hasError('required')) return 'Enter the teammate’s full name';
    if (control.hasError('minlength')) return 'Use at least 2 characters for the name';
    return 'Enter a valid name';
  }

  protected emailError(): string | null {
    const control = this.form.controls.email;
    if (!control.touched || control.valid) return null;
    if (control.hasError('required')) return 'Enter a work email address';
    if (control.hasError('email')) return 'Enter a valid email like sam@example.com';
    return 'Enter a valid email address';
  }

  protected cancel(): void {
    this._dialogRef.close(null);
  }

  protected submit(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;
    const value = this.form.getRawValue();
    this._dialogRef.close({ name: value.name.trim(), email: value.email.trim(), role: value.role });
  }
}

/**
 * Role-change dialog. Opens from the row actions menu with the member's
 * current role preselected; saving records one visible outcome on the page.
 */
@Component({
  imports: [
    ReactiveFormsModule,
    HlmButton,
    HlmDialogDescription,
    HlmDialogFooter,
    HlmDialogHeader,
    HlmDialogTitle,
    HlmLabel,
    HlmNativeSelectImports,
  ],
  template: `
    <form [formGroup]="form" (ngSubmit)="submit()" novalidate class="tw:contents">
      <hlm-dialog-header>
        <h3 hlmDialogTitle>Change role for {{ context.memberName }}</h3>
        <p hlmDialogDescription>Current role: {{ context.currentRole }}. Saving updates the roster immediately.</p>
      </hlm-dialog-header>

      <div class="tw:grid tw:gap-2 tw:py-4">
        <label hlmLabel for="role-select">New role</label>
        <hlm-native-select selectId="role-select" formControlName="role" data-testid="role-select">
          @for (role of roleOptions; track role) {
            <option [value]="role">{{ role }}</option>
          }
        </hlm-native-select>
      </div>

      <hlm-dialog-footer>
        <button hlmButton type="button" variant="secondary" appearance="outline" (click)="cancel()">Cancel</button>
        <button hlmButton type="submit" variant="primary" data-testid="role-submit">Save role</button>
      </hlm-dialog-footer>
    </form>
  `,
  host: { class: 'tw:flex tw:flex-col tw:gap-2' },
})
export class ChangeRoleDialog {
  private readonly _dialogRef = inject<BrnDialogRef<RoleChangeResult | null>>(BrnDialogRef);
  protected readonly context = injectBrnDialogContext<RoleChangeContext>();
  private readonly _fb = inject(FormBuilder);

  protected readonly roleOptions = MEMBER_ROLES;
  protected readonly form = this._fb.nonNullable.group({
    role: this._fb.nonNullable.control<MemberRole>(this.context.currentRole, {
      validators: [Validators.required],
    }),
  });

  protected cancel(): void {
    this._dialogRef.close(null);
  }

  protected submit(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;
    this._dialogRef.close({ role: this.form.getRawValue().role });
  }
}

/**
 * Row actions menu shared by the desktop table and the narrow-screen cards.
 * Mutation items stay disabled in read-only previews; the page also guards
 * each handler so alternate paths cannot invoke mutations either.
 */
@Component({
  selector: 'app-member-actions',
  imports: [HlmButton, HlmDropdownMenuImports],
  template: `
    <div hlmDropdownMenu>
      <button
        hlmButton
        variant="secondary"
        appearance="outline"
        size="sm"
        type="button"
        [hlmDropdownMenuTrigger]="menu"
        [disabled]="readOnly()"
        [title]="readOnly() ? readOnlyMessage : 'Member actions for ' + member().name"
        [attr.aria-label]="'Member actions for ' + member().name"
        [attr.data-testid]="testId()"
      >
        Actions
      </button>
      <ng-template #menu>
        <div hlmDropdownMenu>
          <div hlmDropdownMenuLabel>{{ member().name }}</div>
          <div hlmDropdownMenuSeparator></div>
          <button hlmDropdownMenuItem type="button" (click)="viewDetails.emit(member())">View details</button>
          <button hlmDropdownMenuItem type="button" [disabled]="readOnly()" (click)="changeRole.emit(member())">
            Change role
          </button>
          <button hlmDropdownMenuItem type="button" [disabled]="readOnly()" (click)="remove.emit(member())">
            Remove
          </button>
        </div>
      </ng-template>
    </div>
  `,
})
export class MemberActionsMenu {
  readonly member = input.required<TeamMember>();
  readonly readOnly = input(false);
  readonly testPrefix = input('member-menu');
  readonly viewDetails = output<TeamMember>();
  readonly changeRole = output<TeamMember>();
  readonly remove = output<TeamMember>();

  protected readonly readOnlyMessage = EXAMPLE_READ_ONLY_MESSAGE;
  protected readonly testId = computed(() => `${this.testPrefix()}-${this.member().id}`);
}

/**
 * Customer/team-member management product flow.
 *
 * Responsive roster composed from package primitives only: table, input
 * group, native selects, badges, avatars, dropdown menus, dialogs,
 * pagination, skeletons, empty states, an alert, and the confirmation
 * service. Search, status/role filtering, and pagination are deterministic;
 * changing filters resets to the first page, removal clamps a page made
 * invalid, destructive removal requires explicit confirmation with a visible
 * undo outcome, and narrow screens get stacked cards instead of a squeezed
 * table. Loading, empty, error, and loaded previews run through the shared
 * catalog tooling without a backend.
 */
@Component({
  selector: 'app-team-management-example',
  imports: [
    DatePipe,
    DemoHeaderComponent,
    ExampleStateToolbarComponent,
    HlmAvatar,
    HlmAvatarFallback,
    HlmBadge,
    HlmButton,
    EgBasicAlert,
    HlmCaption,
    HlmTable,
    HlmTableContainer,
    HlmTBody,
    HlmTd,
    HlmTh,
    HlmTHead,
    HlmTr,
    HlmDropdownMenuImports,
    HlmEmptyImports,
    HlmInputGroupImports,
    HlmNativeSelectImports,
    HlmPaginationImports,
    HlmSkeleton,
    MemberActionsMenu,
    ReactiveFormsModule,
  ],
  template: `
    <section class="tw:min-w-0 tw:space-y-6">
      <app-demo-header
        title="Team Management"
        description="Search, filter, page, invite, change roles, and remove workspace members. The catalog toolbar switches this preview between loading, empty, error, and loaded views without a backend."
      />

      <app-example-state-toolbar
        [(viewState)]="viewState"
        [(readOnly)]="readOnly"
        [(simulateFailure)]="simulateFailure"
      />

      @switch (viewState()) {
        @case ('loading') {
          <div role="status" aria-label="Loading members" data-testid="members-loading" class="tw:space-y-3">
            @for (slot of loadingSlots; track slot) {
              <div class="tw:flex tw:items-center tw:gap-3 tw:rounded-2xl tw:border tw:border-slate-200 tw:p-4">
                <hlm-skeleton class="tw:h-10 tw:w-10 tw:rounded-full" />
                <div class="tw:flex tw:min-w-0 tw:flex-1 tw:flex-col tw:gap-2">
                  <hlm-skeleton class="tw:h-4 tw:w-full tw:max-w-48" />
                  <hlm-skeleton class="tw:h-4 tw:w-full tw:max-w-64" />
                </div>
              </div>
            }
          </div>
        }
        @case ('empty') {
          <div hlmEmpty data-testid="empty-preview" class="tw:border-slate-200 tw:bg-white">
            <div hlmEmptyHeader>
              <div hlmEmptyMedia variant="icon">👥</div>
              <h3 hlmEmptyTitle>No members yet</h3>
              <p hlmEmptyDescription>Invite teammates to start sharing this workspace.</p>
            </div>
            <div hlmEmptyContent>
              <button hlmButton type="button" (click)="viewState.set('loaded')">Show fixtures</button>
            </div>
          </div>
        }
        @case ('error') {
          <div role="alert" data-testid="members-error" class="tw:grid tw:gap-3">
            <eg-basic-alert
              variant="danger"
              title="Members failed to load"
              [description]="loadError() ?? 'Members failed to load.'"
            />
            <div>
              <button hlmButton type="button" data-testid="retry-load" (click)="reload()">Retry</button>
            </div>
          </div>
        }
        @default {
          <div class="tw:flex tw:min-w-0 tw:flex-col tw:gap-3 lg:tw:flex-row lg:tw:items-end">
            <form [formGroup]="filterForm" class="tw:contents">
              <div class="tw:grid tw:min-w-0 tw:flex-1 tw:gap-3 sm:tw:grid-cols-3">
                <div class="tw:grid tw:min-w-0 tw:gap-2">
                  <label class="tw:text-sm tw:font-medium tw:text-slate-700" for="member-search">Search</label>
                  <div hlmInputGroup class="tw:flex tw:min-w-0 tw:items-center tw:bg-white">
                    <span hlmInputGroupText aria-hidden="true">⌕</span>
                    <input
                      hlmInputGroupInput
                      id="member-search"
                      data-testid="member-search"
                      class="tw:min-w-0"
                      formControlName="search"
                      placeholder="Name or email"
                      autocomplete="off"
                    />
                    @if (hasSearch()) {
                      <button hlmInputGroupButton type="button" data-testid="clear-search" (click)="clearSearch()">
                        Clear
                      </button>
                    }
                  </div>
                </div>
                <div class="tw:grid tw:min-w-0 tw:gap-2">
                  <label class="tw:text-sm tw:font-medium tw:text-slate-700" for="status-filter">Status</label>
                  <hlm-native-select selectId="status-filter" formControlName="status" data-testid="status-filter">
                    @for (status of statusOptions; track status) {
                      <option [value]="status">{{ status === 'All' ? 'All statuses' : status }}</option>
                    }
                  </hlm-native-select>
                </div>
                <div class="tw:grid tw:min-w-0 tw:gap-2">
                  <label class="tw:text-sm tw:font-medium tw:text-slate-700" for="role-filter">Role</label>
                  <hlm-native-select selectId="role-filter" formControlName="role" data-testid="role-filter">
                    @for (role of roleOptions; track role) {
                      <option [value]="role">{{ role === 'All' ? 'All roles' : role }}</option>
                    }
                  </hlm-native-select>
                </div>
              </div>
            </form>
            <div class="tw:flex tw:shrink-0 tw:flex-wrap tw:gap-2">
              <button
                hlmButton
                type="button"
                data-testid="invite-member"
                [disabled]="readOnly()"
                [title]="readOnly() ? READ_ONLY_MESSAGE : 'Invite a teammate to this workspace'"
                (click)="inviteMember()"
              >
                Invite teammate
              </button>
            </div>
          </div>

          <p role="status" data-testid="member-count" class="tw:text-sm tw:text-slate-600">
            {{ rangeSummary() }}
          </p>

          @if (filteredMembers().length === 0) {
            @if (hasActiveFilters()) {
              <div hlmEmpty data-testid="no-results" class="tw:border-slate-200 tw:bg-white">
                <div hlmEmptyHeader>
                  <div hlmEmptyMedia variant="icon">🔎</div>
                  <h3 hlmEmptyTitle>No members match these filters</h3>
                  <p hlmEmptyDescription>
                    No workspace member matches the current search and filters. Try a different name, email, status, or
                    role.
                  </p>
                </div>
                <div hlmEmptyContent>
                  <button
                    hlmButton
                    variant="secondary"
                    appearance="outline"
                    type="button"
                    data-testid="clear-filters"
                    (click)="clearFilters()"
                  >
                    Clear search and filters
                  </button>
                </div>
              </div>
            } @else {
              <div hlmEmpty data-testid="empty-members" class="tw:border-slate-200 tw:bg-white">
                <div hlmEmptyHeader>
                  <div hlmEmptyMedia variant="icon">👥</div>
                  <h3 hlmEmptyTitle>Workspace member list is empty</h3>
                  <p hlmEmptyDescription>
                    Every member was removed and no fixtures are loaded. Invite someone new or restore the deterministic
                    fixtures.
                  </p>
                </div>
                <div hlmEmptyContent class="tw:items-center">
                  <div class="tw:flex tw:flex-wrap tw:justify-center tw:gap-2">
                    <button
                      hlmButton
                      type="button"
                      data-testid="invite-empty"
                      [disabled]="readOnly()"
                      (click)="inviteMember()"
                    >
                      Invite teammate
                    </button>
                    <button
                      hlmButton
                      variant="secondary"
                      appearance="outline"
                      type="button"
                      data-testid="restore-fixtures"
                      (click)="reload()"
                    >
                      Restore fixtures
                    </button>
                  </div>
                </div>
              </div>
            }
          } @else {
            <!-- Desktop table; narrow screens get the stacked cards below instead. -->
            <div
              hlmTableContainer
              data-testid="member-table-wrap"
              class="tw:hidden tw:max-w-full tw:overflow-x-auto md:tw:block"
            >
              <table hlmTable data-testid="member-table">
                <caption hlmCaption>
                  Workspace members with role, status, join date, and row actions.
                </caption>
                <thead hlmTHead>
                  <tr hlmTr>
                    <th hlmTh scope="col">Member</th>
                    <th hlmTh scope="col">Role</th>
                    <th hlmTh scope="col">Status</th>
                    <th hlmTh scope="col">Joined</th>
                    <th hlmTh scope="col"><span class="tw:sr-only">Actions</span></th>
                  </tr>
                </thead>
                <tbody hlmTBody>
                  @for (member of visibleMembers(); track member.id) {
                    <tr hlmTr [attr.data-testid]="'member-row-' + member.id">
                      <td hlmTd>
                        <span class="tw:flex tw:min-w-0 tw:items-center tw:gap-3">
                          <hlm-avatar aria-hidden="true">
                            <span hlmAvatarFallback>{{ initials(member) }}</span>
                          </hlm-avatar>
                          <span class="tw:min-w-0">
                            <span class="tw:block tw:truncate tw:font-medium tw:text-slate-900">
                              {{ member.name }}
                            </span>
                            <span class="tw:block tw:truncate tw:text-xs tw:text-slate-500">
                              {{ member.email }}
                            </span>
                          </span>
                        </span>
                      </td>
                      <td hlmTd>{{ member.role }}</td>
                      <td hlmTd>
                        <span hlmBadge [variant]="statusVariant(member.status)">{{ member.status }}</span>
                      </td>
                      <td hlmTd>{{ member.joinedAtIso | date: 'mediumDate' : 'UTC' : 'en-US' }}</td>
                      <td hlmTd>
                        <app-member-actions
                          [member]="member"
                          [readOnly]="readOnly()"
                          testPrefix="menu-table"
                          (viewDetails)="showDetails($event)"
                          (changeRole)="openRoleDialog($event)"
                          (remove)="requestRemove($event)"
                        />
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>

            <!-- Narrow-screen alternative to the data table: stacked member cards. -->
            <ul
              aria-label="Workspace members"
              data-testid="member-cards"
              class="tw:grid tw:min-w-0 tw:gap-3 md:tw:hidden"
            >
              @for (member of visibleMembers(); track member.id) {
                <li
                  [attr.data-testid]="'member-card-' + member.id"
                  class="tw:min-w-0 tw:rounded-2xl tw:border tw:border-slate-200 tw:bg-white tw:p-4"
                >
                  <div class="tw:flex tw:min-w-0 tw:items-center tw:gap-3">
                    <hlm-avatar aria-hidden="true">
                      <span hlmAvatarFallback>{{ initials(member) }}</span>
                    </hlm-avatar>
                    <div class="tw:min-w-0 tw:flex-1">
                      <h3 class="tw:truncate tw:text-sm tw:font-semibold tw:text-slate-900">{{ member.name }}</h3>
                      <p class="tw:truncate tw:text-xs tw:text-slate-500">{{ member.email }}</p>
                    </div>
                  </div>
                  <p
                    class="tw:mt-3 tw:flex tw:min-w-0 tw:flex-wrap tw:items-center tw:gap-2 tw:text-xs tw:text-slate-500"
                  >
                    <span class="tw:break-words">{{ member.role }} · joined</span>
                    <span class="tw:break-words">
                      {{ member.joinedAtIso | date: 'mediumDate' : 'UTC' : 'en-US' }}
                    </span>
                    <span hlmBadge [variant]="statusVariant(member.status)">{{ member.status }}</span>
                  </p>
                  <div class="tw:mt-3 tw:flex tw:flex-wrap tw:gap-2">
                    <app-member-actions
                      [member]="member"
                      [readOnly]="readOnly()"
                      testPrefix="menu-card"
                      (viewDetails)="showDetails($event)"
                      (changeRole)="openRoleDialog($event)"
                      (remove)="requestRemove($event)"
                    />
                  </div>
                </li>
              }
            </ul>

            <nav hlmPagination aria-label="Member pages" data-testid="member-pagination">
              <ul hlmPaginationContent class="tw:flex-wrap">
                <li>
                  <button
                    hlmPaginationPrevious
                    type="button"
                    data-testid="members-previous"
                    (click)="goToPage(safePage() - 1)"
                    [disabled]="safePage() === 1"
                  >
                    Previous
                  </button>
                </li>
                @for (pageNumber of pageNumbers(); track pageNumber) {
                  <li hlmPaginationItem>
                    <button
                      hlmPaginationLink
                      type="button"
                      [isActive]="safePage() === pageNumber"
                      [attr.data-testid]="'members-page-' + pageNumber"
                      (click)="goToPage(pageNumber)"
                    >
                      {{ pageNumber }}
                    </button>
                  </li>
                }
                <li>
                  <button
                    hlmPaginationNext
                    type="button"
                    data-testid="members-next"
                    (click)="goToPage(safePage() + 1)"
                    [disabled]="safePage() === pageCount()"
                  >
                    Next
                  </button>
                </li>
              </ul>
            </nav>
          }

          @if (outcome(); as result) {
            <div
              role="status"
              data-testid="member-outcome"
              class="tw:grid tw:gap-2 tw:rounded-2xl tw:border tw:border-emerald-200 tw:bg-emerald-50 tw:p-4 tw:text-sm tw:text-emerald-900"
            >
              <p class="tw:min-w-0 tw:break-words">{{ result.message }}</p>
              @if (result.canUndo) {
                <div>
                  <button
                    hlmButton
                    variant="secondary"
                    appearance="outline"
                    size="sm"
                    type="button"
                    data-testid="undo-remove"
                    (click)="undoRemove()"
                  >
                    Undo removal
                  </button>
                </div>
              }
            </div>
          }
          @if (readOnly()) {
            <p class="tw:text-xs tw:text-slate-500">{{ READ_ONLY_MESSAGE }}</p>
          }
        }
      }

      <div class="tw:flex tw:flex-wrap tw:gap-2">
        <button hlmButton variant="secondary" type="button" (click)="reload()">Simulate reload</button>
      </div>
    </section>
  `,
})
export class TeamManagementExamplePage {
  private readonly _fb = inject(FormBuilder);
  private readonly _dialogs = inject(HlmDialogService);
  private readonly _confirm = inject(EgConfirmationDialogService);

  protected readonly viewState = signal<ExampleViewState>('loaded');
  protected readonly readOnly = signal(false);
  protected readonly simulateFailure = signal(false);
  protected readonly members = signal<readonly TeamMember[]>(EXAMPLE_MEMBERS);
  protected readonly outcome = signal<MemberOutcome | null>(null);
  protected readonly loadError = signal<string | null>(null);
  protected readonly page = signal(1);
  private _lastRemoved: { member: TeamMember; index: number } | null = null;

  protected readonly filterForm = this._fb.nonNullable.group({
    search: this._fb.nonNullable.control(''),
    status: this._fb.nonNullable.control<StatusFilter>('All'),
    role: this._fb.nonNullable.control<RoleFilter>('All'),
  });
  private readonly _rawFilters = toSignal(this.filterForm.valueChanges, {
    initialValue: this.filterForm.getRawValue(),
  });
  private readonly _filters = computed(() => ({
    search: this._rawFilters().search ?? '',
    status: this._rawFilters().status ?? ('All' as StatusFilter),
    role: this._rawFilters().role ?? ('All' as RoleFilter),
  }));

  constructor() {
    // Filters invalidate the current page: always restart from the first page.
    this.filterForm.valueChanges.subscribe(() => {
      this.page.set(1);
    });
  }

  protected readonly loadingSlots = [0, 1, 2];
  protected readonly statusOptions = STATUS_FILTERS;
  protected readonly roleOptions = ROLE_FILTERS;
  protected readonly READ_ONLY_MESSAGE = EXAMPLE_READ_ONLY_MESSAGE;

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

  protected readonly visibleMembers = computed(() => {
    const start = (this.safePage() - 1) * TEAM_PAGE_SIZE;
    return this.filteredMembers().slice(start, start + TEAM_PAGE_SIZE);
  });

  protected readonly rangeSummary = computed(() => {
    const total = this.filteredMembers().length;
    if (total === 0) return 'Showing 0 members.';
    const start = (this.safePage() - 1) * TEAM_PAGE_SIZE + 1;
    const end = Math.min(start + TEAM_PAGE_SIZE - 1, total);
    return `Showing ${start}–${end} of ${total} members · Page ${this.safePage()} of ${this.pageCount()}.`;
  });

  protected initials(member: TeamMember): string {
    return memberInitials(member.name);
  }

  protected statusVariant(status: TeamMember['status']): BadgeVariantType {
    switch (status) {
      case 'Active':
        return 'success';
      case 'Invited':
        return 'warning';
      case 'Suspended':
        return 'destructive';
    }
  }

  protected clearSearch(): void {
    this.filterForm.controls.search.setValue('');
  }

  protected clearFilters(): void {
    this.filterForm.setValue({ search: '', status: 'All', role: 'All' });
  }

  protected goToPage(page: number): void {
    this.page.set(Math.min(Math.max(page, 1), this.pageCount()));
  }

  protected inviteMember(): void {
    if (this.readOnly()) {
      return;
    }
    const dialogRef = this._dialogs.open<InviteMemberResult | null>(InviteMemberDialog, {
      contentClass: 'tw:w-full tw:max-w-[425px]',
    });
    dialogRef.closed$.subscribe((result) => {
      if (result == null) {
        return;
      }
      const taken = new Set(this.members().map((member) => member.id));
      const base = slugifyMemberId(result.name);
      let id = base;
      let suffix = 2;
      while (taken.has(id)) {
        id = `${base}-${suffix}`;
        suffix += 1;
      }
      const member: TeamMember = {
        id,
        name: result.name,
        email: result.email,
        role: result.role,
        status: 'Invited',
        joinedAtIso: INVITED_MEMBER_JOINED_AT_ISO,
      };
      this.members.update((list) => [...list, member]);
      this._lastRemoved = null;
      const filters = this._filters();
      if (filterMembers([member], filters.search, filters.status, filters.role).length === 1) {
        this.page.set(this.pageCount());
      }
      this.outcome.set({
        message: `${member.name} invited as ${member.role}. They now appear with Invited status.`,
        canUndo: false,
      });
    });
  }

  protected openRoleDialog(member: TeamMember): void {
    if (this.readOnly()) {
      return;
    }
    const dialogRef = this._dialogs.open<RoleChangeResult | null>(ChangeRoleDialog, {
      context: { memberName: member.name, currentRole: member.role } satisfies RoleChangeContext,
      contentClass: 'tw:w-full tw:max-w-[425px]',
    });
    dialogRef.closed$.subscribe((result) => {
      if (result == null || result.role === member.role) {
        return;
      }
      this.members.update((list) =>
        list.map((candidate) => (candidate.id === member.id ? { ...candidate, role: result.role } : candidate)),
      );
      this._lastRemoved = null;
      this.outcome.set({ message: `${member.name} is now ${result.role}.`, canUndo: false });
    });
  }

  protected showDetails(member: TeamMember): void {
    this._lastRemoved = null;
    this.outcome.set({
      message:
        `${member.name} · ${member.email} · ${member.role} · ${member.status} · ` + `joined ${member.joinedAtIso}.`,
      canUndo: false,
    });
  }

  protected async requestRemove(member: TeamMember): Promise<void> {
    if (this.readOnly()) {
      return;
    }
    const confirmed = await this._confirm.showConfirmationDialog({
      title: `Remove ${member.name}?`,
      description: `${member.name} loses workspace access immediately. Undo restores access within 30 days.`,
    });
    if (!confirmed) {
      return;
    }
    const list = this.members();
    const index = list.findIndex((candidate) => candidate.id === member.id);
    if (index === -1) {
      return;
    }
    this._lastRemoved = { member: list[index], index };
    this.members.set(list.filter((candidate) => candidate.id !== member.id));
    // Removal can invalidate the current page: clamp back into range.
    this.page.set(Math.min(this.page(), this.pageCount()));
    this.outcome.set({
      message: `${member.name} removed. Undo restores access within 30 days.`,
      canUndo: true,
    });
  }

  protected undoRemove(): void {
    const removed = this._lastRemoved;
    if (!removed) {
      return;
    }
    this._lastRemoved = null;
    this.members.update((list) => {
      const next = [...list];
      next.splice(Math.min(removed.index, next.length), 0, removed.member);
      return next;
    });
    this.outcome.set({
      message: `${removed.member.name} restored with ${removed.member.role} access.`,
      canUndo: false,
    });
  }

  protected async reload(): Promise<void> {
    this.viewState.set('loading');
    this.loadError.set(null);
    try {
      const members = await simulateExampleLoad(EXAMPLE_MEMBERS, { shouldFail: this.simulateFailure() });
      this.members.set(members);
      this.outcome.set(null);
      this._lastRemoved = null;
      this.page.set(1);
      this.viewState.set('loaded');
    } catch (error) {
      this.loadError.set(error instanceof Error ? error.message : 'Members failed to load.');
      this.viewState.set('error');
    }
  }
}
