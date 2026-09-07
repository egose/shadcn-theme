import { Component, computed, effect, inject, input, output, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BrnDialogRef, injectBrnDialogContext } from '@spartan-ng/brain/dialog';
import { EgBasicAlert } from '@egose/shadcn-theme-ng/basic-alert';
import { HlmButton } from '@egose/shadcn-theme-ng/button';
import { HlmCheckbox } from '@egose/shadcn-theme-ng/checkbox';
import { EgConfirmationDialogService } from '@egose/shadcn-theme-ng/confirmation-dialog';
import {
  HlmDialogDescription,
  HlmDialogFooter,
  HlmDialogHeader,
  HlmDialogService,
  HlmDialogTitle,
} from '@egose/shadcn-theme-ng/dialog';
import { HlmInput } from '@egose/shadcn-theme-ng/input';
import { HlmLabel } from '@egose/shadcn-theme-ng/label';
import { HlmNativeSelectImports } from '@egose/shadcn-theme-ng/native-select';
import { DemoHeaderComponent } from '../../../shared/demo-header';
import { EXAMPLE_READ_ONLY_MESSAGE, ExampleViewState } from '../../../shared/real-examples/example-view-state';
import { ExampleStateToolbarComponent } from '../../../shared/real-examples/example-state-toolbar';
import { simulateExampleLoad } from '../../../shared/real-examples/async-simulator';
import {
  EXAMPLE_SETTINGS,
  NotificationFormValue,
  ProfileFormValue,
  SETTINGS_PLANS,
  SETTINGS_SAVED_AT_ISO,
  SETTINGS_SECTIONS,
  SETTINGS_SLUG_PATTERN,
  SETTINGS_TIMEZONES,
  SettingsSnapshot,
  WorkspaceFormValue,
} from './settings-fixtures';

export type SettingsSaveState = 'idle' | 'pending' | 'success' | 'failure';

export type ProfileSettingsForm = FormGroup<{
  displayName: FormControl<string>;
  email: FormControl<string>;
  timezone: FormControl<string>;
}>;

export type WorkspaceSettingsForm = FormGroup<{
  workspaceName: FormControl<string>;
  slug: FormControl<string>;
  planId: FormControl<string>;
}>;

export type NotificationSettingsForm = FormGroup<{
  weeklyDigest: FormControl<boolean>;
  mentionAlerts: FormControl<boolean>;
}>;

interface SettingsRawValue {
  readonly profile: ProfileFormValue;
  readonly workspace: WorkspaceFormValue;
  readonly notifications: NotificationFormValue;
}

/**
 * Reusable local section framing for the settings flow.
 *
 * Only projects a titled section shell — every package control stays visible
 * at the section call site, so this never abstracts package composition away.
 */
@Component({
  selector: 'app-settings-section',
  imports: [],
  template: `
    <section
      [attr.id]="sectionId()"
      [attr.aria-labelledby]="headingId()"
      [attr.data-testid]="'settings-section-' + sectionId()"
      class="tw:min-w-0 tw:rounded-2xl tw:border tw:border-slate-200 tw:bg-white tw:p-5"
    >
      <h3 [attr.id]="headingId()" tabindex="-1" class="tw:text-base tw:font-semibold tw:text-slate-900">
        {{ title() }}
      </h3>
      @if (description()) {
        <p class="tw:mt-1 tw:text-sm tw:text-slate-600">{{ description() }}</p>
      }
      <div class="tw:mt-4 tw:grid tw:min-w-0 tw:gap-4">
        <ng-content />
      </div>
    </section>
  `,
})
export class SettingsSectionComponent {
  readonly sectionId = input.required<string>();
  readonly title = input.required<string>();
  readonly description = input('');
  protected readonly headingId = computed(() => `${this.sectionId()}-title`);
}

/**
 * Profile section. Edits the form group owned by the page; validation copy
 * lives next to each package control it describes.
 */
@Component({
  selector: 'app-profile-settings-section',
  imports: [ReactiveFormsModule, HlmInput, HlmLabel, HlmNativeSelectImports, SettingsSectionComponent],
  template: `
    <app-settings-section
      sectionId="settings-profile"
      title="Profile"
      description="How your name and contact details appear across the workspace."
    >
      <div [formGroup]="form()" class="tw:grid tw:min-w-0 tw:gap-4">
        <div class="tw:grid tw:min-w-0 tw:gap-2">
          <label hlmLabel for="profile-display-name">Display name</label>
          <input
            hlmInput
            id="profile-display-name"
            data-testid="profile-display-name"
            formControlName="displayName"
            autocomplete="name"
            [attr.aria-invalid]="displayNameError() !== null"
            [attr.aria-describedby]="displayNameError() !== null ? 'profile-display-name-error' : null"
          />
          @if (displayNameError(); as error) {
            <p
              id="profile-display-name-error"
              data-testid="profile-display-name-error"
              class="tw:text-sm tw:text-red-600"
            >
              {{ error }}
            </p>
          }
        </div>
        <div class="tw:grid tw:min-w-0 tw:gap-2">
          <label hlmLabel for="profile-email">Email</label>
          <input
            hlmInput
            id="profile-email"
            data-testid="profile-email"
            type="email"
            formControlName="email"
            autocomplete="email"
            [attr.aria-invalid]="emailError() !== null"
            [attr.aria-describedby]="emailError() !== null ? 'profile-email-error' : null"
          />
          @if (emailError(); as error) {
            <p id="profile-email-error" data-testid="profile-email-error" class="tw:text-sm tw:text-red-600">
              {{ error }}
            </p>
          }
        </div>
        <div class="tw:grid tw:min-w-0 tw:gap-2">
          <label hlmLabel for="profile-timezone">Timezone</label>
          <hlm-native-select selectId="profile-timezone" formControlName="timezone" data-testid="profile-timezone">
            @for (timezone of timezones; track timezone) {
              <option [value]="timezone">{{ timezone }}</option>
            }
          </hlm-native-select>
        </div>
      </div>
    </app-settings-section>
  `,
})
export class ProfileSettingsSectionComponent {
  readonly form = input.required<ProfileSettingsForm>();
  protected readonly timezones = SETTINGS_TIMEZONES;

  protected displayNameError(): string | null {
    const control = this.form().controls.displayName;
    if (!control.touched || control.valid) return null;
    if (control.hasError('required')) return 'Enter a display name';
    if (control.hasError('minlength')) return 'Use at least 2 characters for the display name';
    return 'Enter a valid display name';
  }

  protected emailError(): string | null {
    const control = this.form().controls.email;
    if (!control.touched || control.valid) return null;
    if (control.hasError('required')) return 'Enter an email address';
    if (control.hasError('email')) return 'Enter a valid email like sam@example.com';
    return 'Enter a valid email address';
  }
}

/**
 * Workspace section. Edits the form group owned by the page.
 */
@Component({
  selector: 'app-workspace-settings-section',
  imports: [ReactiveFormsModule, HlmInput, HlmLabel, HlmNativeSelectImports, SettingsSectionComponent],
  template: `
    <app-settings-section
      sectionId="settings-workspace"
      title="Workspace"
      description="The shared name, URL slug, and plan for this workspace."
    >
      <div [formGroup]="form()" class="tw:grid tw:min-w-0 tw:gap-4">
        <div class="tw:grid tw:min-w-0 tw:gap-2">
          <label hlmLabel for="workspace-name">Workspace name</label>
          <input
            hlmInput
            id="workspace-name"
            data-testid="workspace-name"
            formControlName="workspaceName"
            autocomplete="organization"
            [attr.aria-invalid]="workspaceNameError() !== null"
            [attr.aria-describedby]="workspaceNameError() !== null ? 'workspace-name-error' : null"
          />
          @if (workspaceNameError(); as error) {
            <p id="workspace-name-error" data-testid="workspace-name-error" class="tw:text-sm tw:text-red-600">
              {{ error }}
            </p>
          }
        </div>
        <div class="tw:grid tw:min-w-0 tw:gap-2">
          <label hlmLabel for="workspace-slug">Workspace slug</label>
          <input
            hlmInput
            id="workspace-slug"
            data-testid="workspace-slug"
            formControlName="slug"
            autocomplete="off"
            aria-describedby="workspace-slug-hint"
            [attr.aria-invalid]="slugError() !== null"
          />
          <p id="workspace-slug-hint" class="tw:text-xs tw:text-slate-500">
            Lowercase letters, numbers, and hyphens. Used in workspace URLs.
          </p>
          @if (slugError(); as error) {
            <p id="workspace-slug-error" data-testid="workspace-slug-error" class="tw:text-sm tw:text-red-600">
              {{ error }}
            </p>
          }
        </div>
        <div class="tw:grid tw:min-w-0 tw:gap-2">
          <label hlmLabel for="workspace-plan">Plan</label>
          <hlm-native-select selectId="workspace-plan" formControlName="planId" data-testid="workspace-plan">
            @for (plan of plans; track plan.id) {
              <option [value]="plan.id">{{ plan.name }}</option>
            }
          </hlm-native-select>
        </div>
      </div>
    </app-settings-section>
  `,
})
export class WorkspaceSettingsSectionComponent {
  readonly form = input.required<WorkspaceSettingsForm>();
  protected readonly plans = SETTINGS_PLANS;

  protected workspaceNameError(): string | null {
    const control = this.form().controls.workspaceName;
    if (!control.touched || control.valid) return null;
    if (control.hasError('required')) return 'Enter a workspace name';
    if (control.hasError('minlength')) return 'Use at least 2 characters for the workspace name';
    return 'Enter a valid workspace name';
  }

  protected slugError(): string | null {
    const control = this.form().controls.slug;
    if (!control.touched || control.valid) return null;
    if (control.hasError('required')) return 'Enter a workspace slug';
    if (control.hasError('pattern')) return 'Use lowercase letters, numbers, and hyphens only';
    return 'Enter a valid workspace slug';
  }
}

/**
 * Notifications section. Edits the form group owned by the page.
 */
@Component({
  selector: 'app-notification-settings-section',
  imports: [ReactiveFormsModule, HlmCheckbox, SettingsSectionComponent],
  template: `
    <app-settings-section
      sectionId="settings-notifications"
      title="Notifications"
      description="Choose which workspace emails land in your inbox."
    >
      <div [formGroup]="form()" class="tw:grid tw:min-w-0 tw:gap-3">
        <label
          for="notify-weekly-digest"
          class="tw:flex tw:min-w-0 tw:cursor-pointer tw:items-start tw:gap-3 tw:rounded-xl tw:border tw:border-slate-200 tw:p-4"
        >
          <hlm-checkbox id="notify-weekly-digest" formControlName="weeklyDigest" />
          <span class="tw:min-w-0">
            <span class="tw:block tw:text-sm tw:font-medium tw:text-slate-900">Weekly digest</span>
            <span class="tw:block tw:text-xs tw:text-slate-500">
              One summary email every Monday morning with workspace highlights.
            </span>
          </span>
        </label>
        <label
          for="notify-mention-alerts"
          class="tw:flex tw:min-w-0 tw:cursor-pointer tw:items-start tw:gap-3 tw:rounded-xl tw:border tw:border-slate-200 tw:p-4"
        >
          <hlm-checkbox id="notify-mention-alerts" formControlName="mentionAlerts" />
          <span class="tw:min-w-0">
            <span class="tw:block tw:text-sm tw:font-medium tw:text-slate-900">Mention alerts</span>
            <span class="tw:block tw:text-xs tw:text-slate-500">
              An immediate email whenever a teammate mentions you.
            </span>
          </span>
        </label>
      </div>
    </app-settings-section>
  `,
})
export class NotificationSettingsSectionComponent {
  readonly form = input.required<NotificationSettingsForm>();
}

export interface DeleteWorkspaceContext {
  readonly expectedSlug: string;
}

/**
 * Typed-confirmation dialog for workspace deletion. The destructive submit
 * stays disabled until the typed slug matches exactly, so rejecting (Cancel
 * or a mismatched value) preserves every setting.
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
  ],
  template: `
    <form [formGroup]="form" (ngSubmit)="confirm()" novalidate class="tw:contents">
      <hlm-dialog-header>
        <h3 hlmDialogTitle>Delete {{ context.expectedSlug }}?</h3>
        <p hlmDialogDescription>
          This permanently deletes the workspace and its settings in this preview. Type
          <strong>{{ context.expectedSlug }}</strong> below to confirm.
        </p>
      </hlm-dialog-header>

      <div class="tw:grid tw:gap-2 tw:py-4">
        <label hlmLabel for="delete-confirm">Workspace slug</label>
        <input
          hlmInput
          id="delete-confirm"
          data-testid="delete-confirm-input"
          formControlName="confirmation"
          autocomplete="off"
        />
      </div>

      <hlm-dialog-footer>
        <button hlmButton type="button" variant="secondary" appearance="outline" (click)="cancel()">Cancel</button>
        <button hlmButton type="submit" variant="danger" data-testid="delete-confirm-submit" [disabled]="!matches()">
          Delete workspace
        </button>
      </hlm-dialog-footer>
    </form>
  `,
  host: { class: 'tw:flex tw:flex-col tw:gap-2' },
})
export class DeleteWorkspaceDialog {
  private readonly _dialogRef = inject<BrnDialogRef<string | null>>(BrnDialogRef);
  protected readonly context = injectBrnDialogContext<DeleteWorkspaceContext>();
  private readonly _fb = inject(FormBuilder);

  protected readonly form = this._fb.nonNullable.group({
    confirmation: this._fb.nonNullable.control(''),
  });

  protected matches(): boolean {
    return this.form.controls.confirmation.value.trim() === this.context.expectedSlug;
  }

  protected cancel(): void {
    this._dialogRef.close(null);
  }

  protected confirm(): void {
    if (!this.matches()) return;
    this._dialogRef.close(this.form.controls.confirmation.value.trim());
  }
}

/**
 * Danger-zone section. Visually and semantically separate from everyday
 * settings; every action is emitted to the page, which requires explicit or
 * typed confirmation before recording a visible outcome.
 */
@Component({
  selector: 'app-danger-zone-section',
  imports: [HlmButton, SettingsSectionComponent],
  template: `
    <app-settings-section
      sectionId="settings-danger-zone"
      title="Danger zone"
      description="Irreversible workspace actions live here, apart from everyday settings. Each one asks for confirmation first."
    >
      <div
        role="region"
        aria-label="Destructive workspace actions"
        data-testid="danger-zone"
        class="tw:grid tw:min-w-0 tw:gap-3 tw:rounded-xl tw:border tw:border-rose-300 tw:bg-rose-50 tw:p-4"
      >
        <p class="tw:min-w-0 tw:break-words tw:text-sm tw:text-rose-900">
          Leaving removes your access; deletion removes the workspace for everyone. Neither can be undone outside this
          preview.
        </p>
        <div class="tw:flex tw:min-w-0 tw:flex-wrap tw:gap-2">
          <button
            hlmButton
            type="button"
            variant="secondary"
            appearance="outline"
            data-testid="leave-workspace"
            [disabled]="readOnly()"
            [title]="readOnly() ? readOnlyMessage : 'Leave this workspace'"
            (click)="leaveWorkspace.emit()"
          >
            Leave workspace
          </button>
          <button
            hlmButton
            type="button"
            variant="danger"
            data-testid="delete-workspace"
            [disabled]="readOnly()"
            [title]="readOnly() ? readOnlyMessage : 'Delete this workspace'"
            (click)="deleteWorkspace.emit()"
          >
            Delete workspace
          </button>
        </div>
      </div>
    </app-settings-section>
  `,
})
export class DangerZoneSectionComponent {
  readonly readOnly = input(false);
  readonly leaveWorkspace = output<void>();
  readonly deleteWorkspace = output<void>();
  protected readonly readOnlyMessage = EXAMPLE_READ_ONLY_MESSAGE;
}

/**
 * Account and workspace settings product flow.
 *
 * The page owns all shared form state (three typed reactive forms, the saved
 * snapshot, the save lifecycle, section navigation, and outcomes). Section
 * components only edit the form group they receive, so ownership stays clear
 * while no single component becomes a giant form.
 */
@Component({
  selector: 'app-settings-example',
  imports: [
    DemoHeaderComponent,
    ExampleStateToolbarComponent,
    HlmButton,
    EgBasicAlert,
    ReactiveFormsModule,
    ProfileSettingsSectionComponent,
    WorkspaceSettingsSectionComponent,
    NotificationSettingsSectionComponent,
    DangerZoneSectionComponent,
  ],
  template: `
    <section class="tw:min-w-0 tw:space-y-6">
      <app-demo-header
        title="Settings"
        description="Edit profile, workspace, and notification settings with visible save feedback. The catalog toolbar switches this preview between loading, empty, error, and loaded views without a backend."
      />

      <app-example-state-toolbar
        [(viewState)]="viewState"
        [(readOnly)]="readOnly"
        [(simulateFailure)]="simulateFailure"
      />

      @switch (viewState()) {
        @case ('loading') {
          <div role="status" aria-label="Loading settings" class="tw:animate-pulse tw:space-y-3">
            <div class="tw:h-5 tw:w-1/4 tw:rounded tw:bg-slate-200"></div>
            <div class="tw:h-10 tw:w-full tw:rounded-xl tw:bg-slate-200"></div>
            <div class="tw:h-10 tw:w-full tw:rounded-xl tw:bg-slate-200"></div>
          </div>
        }
        @case ('empty') {
          <div class="tw:rounded-2xl tw:border tw:border-slate-200 tw:bg-white tw:p-6 tw:text-center">
            <h3 class="tw:text-base tw:font-semibold tw:text-slate-900">No settings found</h3>
            <p class="tw:mt-1 tw:text-sm tw:text-slate-600">This workspace has no saved settings yet.</p>
            <button hlmButton type="button" class="tw:mt-4" (click)="viewState.set('loaded')">Show fixtures</button>
          </div>
        }
        @case ('error') {
          <div role="alert" class="tw:rounded-2xl tw:border tw:border-rose-200 tw:bg-rose-50 tw:p-6 tw:text-center">
            <h3 class="tw:text-base tw:font-semibold tw:text-rose-900">Settings failed to load</h3>
            <p class="tw:mt-1 tw:text-sm tw:text-rose-700">{{ loadError() }}</p>
            <button hlmButton type="button" class="tw:mt-4" (click)="reload()">Retry</button>
          </div>
        }
        @default {
          <div class="tw:min-w-0 tw:space-y-4" data-testid="settings-loaded">
            <nav
              aria-label="Settings sections"
              data-testid="settings-nav"
              class="tw:min-w-0 tw:rounded-2xl tw:border tw:border-slate-200 tw:bg-white tw:p-3"
            >
              <ul class="tw:flex tw:min-w-0 tw:flex-wrap tw:gap-2">
                @for (section of sections; track section.id) {
                  <li>
                    <button
                      hlmButton
                      type="button"
                      size="sm"
                      [variant]="activeSection() === section.id ? 'default' : 'secondary'"
                      [attr.aria-current]="activeSection() === section.id ? 'true' : null"
                      [attr.data-testid]="'settings-nav-' + section.id"
                      (click)="selectSection(section.id)"
                    >
                      {{ section.label }}
                    </button>
                  </li>
                }
              </ul>
            </nav>

            @if (isDirty()) {
              <p
                role="status"
                data-testid="dirty-warning"
                class="tw:break-words tw:rounded-2xl tw:border tw:border-amber-200 tw:bg-amber-50 tw:p-3 tw:text-sm tw:text-amber-900"
              >
                You have unsaved changes. Save them or discard them before leaving this preview — switching sections
                asks first.
              </p>
            }

            @if (formErrorSummary().length > 0) {
              <div
                role="alert"
                data-testid="settings-form-errors"
                class="tw:rounded-2xl tw:border tw:border-rose-200 tw:bg-rose-50 tw:p-4"
              >
                <p class="tw:text-sm tw:font-semibold tw:text-rose-900">Fix the following before saving:</p>
                <ul class="tw:mt-1 tw:list-disc tw:space-y-1 tw:pl-5 tw:text-sm tw:text-rose-800">
                  @for (entry of formErrorSummary(); track entry) {
                    <li>{{ entry }}</li>
                  }
                </ul>
              </div>
            }

            <app-profile-settings-section [form]="profileForm" />
            <app-workspace-settings-section [form]="workspaceForm" />
            <app-notification-settings-section [form]="notificationsForm" />
            <app-danger-zone-section
              [readOnly]="readOnly()"
              (leaveWorkspace)="leaveWorkspace()"
              (deleteWorkspace)="deleteWorkspace()"
            />

            @if (readOnly()) {
              <p data-testid="settings-readonly-note" class="tw:break-words tw:text-xs tw:text-slate-500">
                {{ READ_ONLY_MESSAGE }} You are previewing as a workspace member: members cannot change settings, so ask
                an admin to update these sections.
              </p>
            }

            <div class="tw:flex tw:min-w-0 tw:flex-wrap tw:items-center tw:gap-2">
              <button
                hlmButton
                type="button"
                data-testid="settings-save"
                [disabled]="!canSave()"
                [title]="readOnly() ? READ_ONLY_MESSAGE : 'Save settings changes'"
                (click)="save()"
              >
                Save changes
              </button>
              <button
                hlmButton
                variant="secondary"
                appearance="outline"
                type="button"
                data-testid="settings-discard"
                [disabled]="!canDiscard()"
                (click)="discardChanges()"
              >
                Discard changes
              </button>
            </div>

            @switch (saveState()) {
              @case ('pending') {
                <p role="status" data-testid="settings-save-pending" class="tw:text-sm tw:text-slate-700">
                  Saving settings…
                </p>
              }
              @case ('success') {
                @if (saveOutcome(); as outcome) {
                  <p
                    role="status"
                    data-testid="settings-save-outcome"
                    class="tw:break-words tw:rounded-2xl tw:border tw:border-emerald-200 tw:bg-emerald-50 tw:p-4 tw:text-sm tw:text-emerald-900"
                  >
                    {{ outcome }}
                  </p>
                }
              }
              @case ('failure') {
                <div role="alert" data-testid="settings-save-error" class="tw:grid tw:gap-3">
                  <eg-basic-alert
                    variant="danger"
                    title="Settings failed to save"
                    [description]="saveError() ?? 'Settings failed to save.'"
                  />
                  <div>
                    <button
                      hlmButton
                      type="button"
                      variant="secondary"
                      appearance="outline"
                      data-testid="settings-retry"
                      (click)="save()"
                    >
                      Retry save
                    </button>
                  </div>
                </div>
              }
            }

            @if (dangerOutcome(); as danger) {
              <p
                role="status"
                data-testid="danger-outcome"
                class="tw:break-words tw:rounded-2xl tw:border tw:border-slate-200 tw:bg-white tw:p-4 tw:text-sm tw:text-slate-700"
              >
                {{ danger }}
              </p>
            }
          </div>
        }
      }

      <div class="tw:flex tw:flex-wrap tw:gap-2">
        <button hlmButton variant="secondary" type="button" (click)="reload()">Simulate reload</button>
      </div>
    </section>
  `,
})
export class SettingsExamplePage {
  private readonly _fb = inject(FormBuilder);
  private readonly _dialogs = inject(HlmDialogService);
  private readonly _confirm = inject(EgConfirmationDialogService);

  protected readonly viewState = signal<ExampleViewState>('loaded');
  protected readonly readOnly = signal(false);
  protected readonly simulateFailure = signal(false);
  protected readonly snapshot = signal<SettingsSnapshot>(EXAMPLE_SETTINGS);
  protected readonly saveState = signal<SettingsSaveState>('idle');
  protected readonly saveOutcome = signal<string | null>(null);
  protected readonly saveError = signal<string | null>(null);
  protected readonly dangerOutcome = signal<string | null>(null);
  protected readonly loadError = signal<string | null>(null);
  protected readonly activeSection = signal<string>(SETTINGS_SECTIONS[0].id);
  protected readonly saveAttempted = signal(false);

  protected readonly sections = SETTINGS_SECTIONS;
  protected readonly READ_ONLY_MESSAGE = EXAMPLE_READ_ONLY_MESSAGE;

  /**
   * Form-event counter. Reactive form models are invisible to zoneless change
   * detection, so every form event bumps this signal and the dirty/validity
   * computeds below re-evaluate deterministically in both the running app and
   * `fixture.detectChanges()` assertions.
   */
  private readonly _formVersion = signal(0);

  protected readonly profileForm: ProfileSettingsForm = this._fb.nonNullable.group({
    displayName: this._fb.nonNullable.control('', {
      validators: [Validators.required, Validators.minLength(2)],
    }),
    email: this._fb.nonNullable.control('', {
      validators: [Validators.required, Validators.email],
    }),
    timezone: this._fb.nonNullable.control('UTC', {
      validators: [Validators.required],
    }),
  });

  protected readonly workspaceForm: WorkspaceSettingsForm = this._fb.nonNullable.group({
    workspaceName: this._fb.nonNullable.control('', {
      validators: [Validators.required, Validators.minLength(2)],
    }),
    slug: this._fb.nonNullable.control('', {
      validators: [Validators.required, Validators.pattern(SETTINGS_SLUG_PATTERN)],
    }),
    planId: this._fb.nonNullable.control('plan-team', {
      validators: [Validators.required],
    }),
  });

  protected readonly notificationsForm: NotificationSettingsForm = this._fb.nonNullable.group({
    weeklyDigest: this._fb.nonNullable.control(true),
    mentionAlerts: this._fb.nonNullable.control(false),
  });

  constructor() {
    // Every value, status, or touched change bumps the version so the
    // dirty/validity computeds below re-evaluate deterministically.
    for (const form of [this.profileForm, this.workspaceForm, this.notificationsForm]) {
      form.events.subscribe(() => {
        this._formVersion.update((version) => version + 1);
      });
    }
    this._syncFormsFromSnapshot();
    // Read-only previews lock every control programmatically so mutation is
    // impossible through any template or alternate path, not just the Save
    // button. Disabled values still read through getRawValue().
    effect(() => {
      const locked = this.readOnly();
      const forms = [this.profileForm, this.workspaceForm, this.notificationsForm];
      for (const form of forms) {
        if (locked) {
          form.disable({ emitEvent: false });
        } else {
          form.enable({ emitEvent: false });
        }
      }
    });
  }

  private _rawFromSnapshot(snapshot: SettingsSnapshot): SettingsRawValue {
    return {
      profile: { ...snapshot.profile },
      workspace: { ...snapshot.workspace },
      notifications: { ...snapshot.notifications },
    };
  }

  private _syncFormsFromSnapshot(): void {
    // Resets emit by default so the version counter observes them.
    this.profileForm.reset(this._rawFromSnapshot(this.snapshot()).profile);
    this.workspaceForm.reset(this._rawFromSnapshot(this.snapshot()).workspace);
    this.notificationsForm.reset(this._rawFromSnapshot(this.snapshot()).notifications);
    this.saveAttempted.set(false);
  }

  private _currentRaw(): SettingsRawValue {
    return {
      profile: this.profileForm.getRawValue(),
      workspace: this.workspaceForm.getRawValue(),
      notifications: this.notificationsForm.getRawValue(),
    };
  }

  protected readonly isDirty = computed(() => {
    this._formVersion();
    return JSON.stringify(this._currentRaw()) !== JSON.stringify(this._rawFromSnapshot(this.snapshot()));
  });

  private _allValid(): boolean {
    return this.profileForm.valid && this.workspaceForm.valid && this.notificationsForm.valid;
  }

  protected readonly canSave = computed(() => {
    this._formVersion();
    return !this.readOnly() && this.saveState() !== 'pending' && this.isDirty() && this._allValid();
  });

  protected readonly canDiscard = computed(() => {
    this._formVersion();
    return !this.readOnly() && this.saveState() !== 'pending' && this.isDirty();
  });

  protected readonly formErrorSummary = computed((): readonly string[] => {
    // Save stays disabled while any control is invalid, so the summary cannot
    // wait for a save attempt: it appears as soon as a touched control fails.
    this._formVersion();
    this.saveAttempted();
    if (this._allValid()) return [];
    if (!this.profileForm.touched && !this.workspaceForm.touched && !this.notificationsForm.touched) {
      return [];
    }
    const entries: string[] = [];
    const profile = this.profileForm.controls;
    if (profile.displayName.invalid) entries.push('Profile — display name needs attention.');
    if (profile.email.invalid) entries.push('Profile — email needs attention.');
    if (profile.timezone.invalid) entries.push('Profile — timezone needs attention.');
    const workspace = this.workspaceForm.controls;
    if (workspace.workspaceName.invalid) entries.push('Workspace — workspace name needs attention.');
    if (workspace.slug.invalid) entries.push('Workspace — slug needs attention.');
    if (workspace.planId.invalid) entries.push('Workspace — plan needs attention.');
    return entries;
  });

  protected async save(): Promise<void> {
    if (this.readOnly() || this.saveState() === 'pending') return;
    this.saveAttempted.set(true);
    this.profileForm.markAllAsTouched();
    this.workspaceForm.markAllAsTouched();
    this.notificationsForm.markAllAsTouched();
    if (!this.isDirty() || !this._allValid()) return;
    this.saveState.set('pending');
    this.saveError.set(null);
    const raw = this._currentRaw();
    try {
      const saved = await simulateExampleLoad<SettingsSnapshot>(
        {
          profile: { ...raw.profile },
          workspace: { ...raw.workspace },
          notifications: { ...raw.notifications },
          updatedAtIso: SETTINGS_SAVED_AT_ISO,
        },
        { shouldFail: this.simulateFailure(), latencyMs: 10 },
      );
      this.snapshot.set(saved);
      this._syncFormsFromSnapshot();
      this.saveState.set('success');
      this.saveOutcome.set(`Settings saved for ${saved.profile.displayName} at ${saved.workspace.workspaceName}.`);
    } catch (error) {
      this.saveState.set('failure');
      this.saveError.set(error instanceof Error ? error.message : 'Settings failed to save.');
    }
  }

  protected async discardChanges(): Promise<void> {
    if (!this.canDiscard()) return;
    const confirmed = await this._confirm.showConfirmationDialog({
      title: 'Discard unsaved changes?',
      description: 'Every edited field returns to its last saved value. This cannot be undone.',
    });
    if (!confirmed) return;
    this._syncFormsFromSnapshot();
    this.saveState.set('idle');
    this.saveOutcome.set(null);
    this.saveError.set(null);
    this.dangerOutcome.set(null);
  }

  protected async selectSection(sectionId: string): Promise<void> {
    if (sectionId === this.activeSection()) return;
    if (this.isDirty() && !this.readOnly()) {
      const confirmed = await this._confirm.showConfirmationDialog({
        title: 'Discard unsaved changes?',
        description: 'Switching sections discards every unsaved edit. Save or discard first to keep them.',
      });
      if (!confirmed) return;
      this._syncFormsFromSnapshot();
      this.saveState.set('idle');
      this.saveOutcome.set(null);
      this.saveError.set(null);
    }
    this.activeSection.set(sectionId);
    const host = document.getElementById(sectionId);
    host?.scrollIntoView({ block: 'start' });
    (host?.querySelector('h3') as HTMLElement | null)?.focus?.();
  }

  protected async leaveWorkspace(): Promise<void> {
    if (this.readOnly()) return;
    const name = this.snapshot().workspace.workspaceName;
    const confirmed = await this._confirm.showConfirmationDialog({
      title: `Leave ${name}?`,
      description: 'You lose access to this workspace immediately. An admin must invite you back.',
    });
    if (!confirmed) return;
    this.dangerOutcome.set(`Leave request for ${name} recorded. An admin approves access changes in this preview.`);
  }

  protected deleteWorkspace(): void {
    if (this.readOnly()) return;
    const expectedSlug = this.snapshot().workspace.slug;
    const dialogRef = this._dialogs.open<string | null>(DeleteWorkspaceDialog, {
      context: { expectedSlug } satisfies DeleteWorkspaceContext,
      contentClass: 'tw:w-full tw:max-w-[425px]',
    });
    dialogRef.closed$.subscribe((result) => {
      if (result == null) return;
      this.snapshot.set(EXAMPLE_SETTINGS);
      this._syncFormsFromSnapshot();
      this.saveState.set('idle');
      this.saveOutcome.set(null);
      this.saveError.set(null);
      this.dangerOutcome.set(`Workspace ${result} deleted. This preview restored the original fixtures.`);
    });
  }

  protected async reload(): Promise<void> {
    this.viewState.set('loading');
    this.loadError.set(null);
    try {
      const snapshot = await simulateExampleLoad(EXAMPLE_SETTINGS, { shouldFail: this.simulateFailure() });
      this.snapshot.set(snapshot);
      this._syncFormsFromSnapshot();
      this.saveState.set('idle');
      this.saveOutcome.set(null);
      this.saveError.set(null);
      this.dangerOutcome.set(null);
      this.viewState.set('loaded');
    } catch (error) {
      this.loadError.set(error instanceof Error ? error.message : 'Settings failed to load.');
      this.viewState.set('error');
    }
  }
}
