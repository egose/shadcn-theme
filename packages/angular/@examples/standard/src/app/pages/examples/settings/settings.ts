import { Component, DestroyRef, ElementRef, computed, effect, inject, signal, untracked } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AbstractControl, FormBuilder, Validators, type ValidationErrors } from '@angular/forms';
import { defaultIfEmpty, firstValueFrom, take } from 'rxjs';
import { EgBasicAlert } from '@egose/shadcn-theme-ng/basic-alert';
import { HlmButton } from '@egose/shadcn-theme-ng/button';
import { EgConfirmationDialog } from '@egose/shadcn-theme-ng/confirmation-dialog';
import { HlmDialogService } from '@egose/shadcn-theme-ng/dialog';
import { DemoHeaderComponent } from '../../../shared/demo-header';
import { EXAMPLE_READ_ONLY_MESSAGE, ExampleViewState } from '../../../shared/real-examples/example-view-state';
import { ExampleStateToolbarComponent } from '../../../shared/real-examples/example-state-toolbar';
import { simulateExampleLoad } from '../../../shared/real-examples/async-simulator';
import { DangerZoneSectionComponent } from './components/danger-zone-section';
import { DeleteWorkspaceDialog } from './components/delete-workspace-dialog';
import { NotificationSettingsSectionComponent } from './components/notification-settings-section';
import { ProfileSettingsSectionComponent } from './components/profile-settings-section';
import { WorkspaceSettingsSectionComponent } from './components/workspace-settings-section';
import { EXAMPLE_SETTINGS, SETTINGS_SAVED_AT_ISO, SETTINGS_SECTIONS, SETTINGS_SLUG_PATTERN } from './settings-fixtures';
import type {
  DeleteWorkspaceContext,
  NotificationSettingsForm,
  ProfileSettingsForm,
  SettingsRawValue,
  SettingsSaveState,
  SettingsSnapshot,
  WorkspaceSettingsForm,
} from './settings-types';

function nameValidation(control: AbstractControl<string>): ValidationErrors | null {
  const length = control.value.trim().length;
  return length === 0 ? { required: true } : length < 2 ? { minlength: true } : null;
}

/** The route owns drafts, saved snapshots, confirmations and workspace sessions. */
@Component({
  selector: 'app-settings-example',
  imports: [
    DemoHeaderComponent,
    ExampleStateToolbarComponent,
    HlmButton,
    EgBasicAlert,
    ProfileSettingsSectionComponent,
    WorkspaceSettingsSectionComponent,
    NotificationSettingsSectionComponent,
    DangerZoneSectionComponent,
  ],
  templateUrl: './settings.html',
})
export class SettingsExamplePage {
  private readonly _fb = inject(FormBuilder);
  private readonly _dialogs = inject(HlmDialogService);
  private readonly _destroyRef = inject(DestroyRef);
  private readonly _host = inject<ElementRef<HTMLElement>>(ElementRef);
  private _session = 0;
  private _loadOperation = 0;
  private _draftRevision = 0;
  private readonly _revisions = new Map<AbstractControl, number>();
  private _closeDelete: (() => void) | null = null;
  private _closeConfirmation: (() => void) | null = null;

  protected readonly viewState = signal<ExampleViewState>('loaded');
  protected readonly readOnly = signal(false);
  protected readonly simulateFailure = signal(false);
  protected readonly snapshot = signal<SettingsSnapshot>(EXAMPLE_SETTINGS);
  protected readonly terminal = signal<'deleted' | 'left' | null>(null);
  protected readonly confirmationPending = signal(false);
  protected readonly saveState = signal<SettingsSaveState>('idle');
  protected readonly saveOutcome = signal<string | null>(null);
  protected readonly saveError = signal<string | null>(null);
  protected readonly sessionNotice = signal<string | null>(null);
  protected readonly dangerOutcome = signal<string | null>(null);
  protected readonly loadError = signal<string | null>(null);
  protected readonly activeSection = signal<string>(SETTINGS_SECTIONS[0].id);
  protected readonly sections = SETTINGS_SECTIONS;
  protected readonly READ_ONLY_MESSAGE = EXAMPLE_READ_ONLY_MESSAGE;
  private readonly _formVersion = signal(0);

  protected readonly profileForm: ProfileSettingsForm = this._fb.nonNullable.group({
    displayName: ['', nameValidation],
    email: ['', [Validators.required, Validators.email]],
    timezone: ['UTC', Validators.required],
  });
  protected readonly workspaceForm: WorkspaceSettingsForm = this._fb.nonNullable.group({
    workspaceName: ['', nameValidation],
    slug: ['', [Validators.required, Validators.pattern(SETTINGS_SLUG_PATTERN)]],
    planId: ['plan-team', Validators.required],
  });
  protected readonly notificationsForm: NotificationSettingsForm = this._fb.nonNullable.group({
    weeklyDigest: this._fb.nonNullable.control<boolean>(true),
    mentionAlerts: this._fb.nonNullable.control<boolean>(false),
  });
  private readonly _forms = {
    profile: this.profileForm,
    workspace: this.workspaceForm,
    notifications: this.notificationsForm,
  };

  constructor() {
    for (const form of Object.values(this._forms)) {
      form.events.pipe(takeUntilDestroyed(this._destroyRef)).subscribe(() => this._formVersion.update((v) => v + 1));
      for (const control of Object.values(form.controls)) {
        this._revisions.set(control, 0);
        control.valueChanges.pipe(takeUntilDestroyed(this._destroyRef)).subscribe(() => {
          this._revisions.set(control, this._revisions.get(control)! + 1);
          this._draftRevision++;
        });
      }
    }
    this._syncFormsFromSnapshot();
    effect(() => {
      const locked = this.readOnly();
      const preview = this.viewState();
      const terminal = this.terminal();
      untracked(() => {
        if (locked || preview !== 'loaded' || terminal) this.invalidateSession();
        for (const form of Object.values(this._forms)) {
          if (locked || terminal) form.disable({ emitEvent: false });
          else form.enable({ emitEvent: false });
        }
        this._formVersion.update((v) => v + 1);
      });
    });
    this._destroyRef.onDestroy(() => {
      this._loadOperation++;
      this.invalidateSession();
    });
  }

  protected setReadOnly(value: boolean): void {
    this.invalidateSession();
    this.readOnly.set(value);
  }

  protected setPreview(value: ExampleViewState): void {
    this._loadOperation++;
    this.invalidateSession();
    this.viewState.set(value);
  }

  private invalidateSession(): void {
    this._session++;
    if (this.saveState() === 'pending') this.sessionNotice.set('Save cancelled. Your draft is preserved.');
    this.saveState.set('idle');
    this.saveOutcome.set(null);
    this.saveError.set(null);
    this.confirmationPending.set(false);
    const close = this._closeDelete;
    this._closeDelete = null;
    close?.();
    const closeConfirmation = this._closeConfirmation;
    this._closeConfirmation = null;
    closeConfirmation?.();
  }

  private canMutate(): boolean {
    return !this._destroyRef.destroyed && !this.readOnly() && this.viewState() === 'loaded' && !this.terminal();
  }

  private _syncFormsFromSnapshot(): void {
    const snapshot = this.snapshot();
    this.profileForm.reset(snapshot.profile);
    this.workspaceForm.reset(snapshot.workspace);
    this.notificationsForm.reset(snapshot.notifications);
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
    const { profile, workspace, notifications } = this.snapshot();
    return (
      !this.terminal() && JSON.stringify(this._currentRaw()) !== JSON.stringify({ profile, workspace, notifications })
    );
  });
  private _allValid(): boolean {
    return Object.values(this._forms).every((form) => form.valid);
  }
  protected readonly canSave = computed(() => {
    this._formVersion();
    return (
      this.canMutate() &&
      !this.confirmationPending() &&
      this.saveState() !== 'pending' &&
      this.isDirty() &&
      this._allValid()
    );
  });
  protected readonly canDiscard = computed(
    () => this.canMutate() && !this.confirmationPending() && this.saveState() !== 'pending' && this.isDirty(),
  );
  protected readonly formErrorSummary = computed((): readonly string[] => {
    this._formVersion();
    const entries: string[] = [];
    for (const [section, form] of Object.entries(this._forms)) {
      for (const [field, control] of Object.entries(form.controls)) {
        if (control.touched && control.invalid) {
          const label = field.replace(/([A-Z])/g, ' $1').toLowerCase();
          entries.push(`${section[0].toUpperCase()}${section.slice(1)} — ${label} needs attention.`);
        }
      }
    }
    return entries;
  });

  protected async save(): Promise<void> {
    if (!this.canMutate() || this.confirmationPending() || this.saveState() === 'pending') return;
    Object.values(this._forms).forEach((form) => form.markAllAsTouched());
    if (!this.isDirty() || !this._allValid()) return;
    const raw = this._currentRaw();
    const submitted: SettingsSnapshot = {
      profile: { ...raw.profile, displayName: raw.profile.displayName.trim() },
      workspace: { ...raw.workspace, workspaceName: raw.workspace.workspaceName.trim() },
      notifications: { ...raw.notifications },
      updatedAtIso: SETTINGS_SAVED_AT_ISO,
    };
    const revisions = new Map(this._revisions);
    const session = this._session;
    const identity = this.snapshot();
    const canCommit = () => session === this._session && this.canMutate() && this.snapshot() === identity;
    this.saveState.set('pending');
    this.saveOutcome.set(null);
    this.saveError.set(null);
    this.sessionNotice.set(null);
    try {
      const saved = await simulateExampleLoad(submitted, { shouldFail: this.simulateFailure(), latencyMs: 10 });
      if (!canCommit()) return;
      this.snapshot.set(saved);
      // Normalize/clean only controls untouched since submission. Other fields
      // keep their newer value, touched state and validation, even after edits back.
      for (const section of ['profile', 'workspace', 'notifications'] as const) {
        for (const [field, control] of Object.entries(this._forms[section].controls)) {
          if (this._revisions.get(control) === revisions.get(control)) {
            control.reset((saved[section] as unknown as Record<string, string | boolean>)[field]);
          }
        }
      }
      this.saveState.set('success');
      this.saveOutcome.set(`Settings saved for ${saved.profile.displayName} at ${saved.workspace.workspaceName}.`);
    } catch (error) {
      if (!canCommit()) return;
      this.saveState.set('failure');
      this.saveError.set(error instanceof Error ? error.message : 'Settings failed to save.');
    }
  }

  /** Confirmations belong to the exact session, saved workspace and draft shown. */
  private beginConfirmation(requireMutation = true) {
    if (this._destroyRef.destroyed || this.confirmationPending() || (requireMutation && !this.canMutate())) return null;
    const session = this._session;
    const identity = this.snapshot();
    const revision = this._draftRevision;
    const document = this._host.nativeElement.ownerDocument;
    const origin = document.activeElement as HTMLElement | null;
    this.confirmationPending.set(true);
    return {
      valid: () =>
        !this._destroyRef.destroyed &&
        session === this._session &&
        identity === this.snapshot() &&
        revision === this._draftRevision &&
        (!requireMutation || this.canMutate()),
      finish: () => {
        if (session !== this._session) return;
        this.confirmationPending.set(false);
        // The trigger was disabled while confirming. Wait for it to be enabled
        // before restoring focus, and never steal focus from a newer session.
        setTimeout(() => {
          if (
            !this._destroyRef.destroyed &&
            session === this._session &&
            origin?.isConnected &&
            document.activeElement === document.body
          )
            origin.focus();
        }, 0);
      },
    };
  }

  /** Own the public dialog's lifetime as well as the decision it returns. */
  private async confirm(context: { title: string; description: string }): Promise<boolean> {
    const ref = this._dialogs.open<boolean>(EgConfirmationDialog, {
      context,
      contentClass: 'tw:w-full tw:max-w-[425px] tw:break-words',
    });
    const close = () => ref.close(false);
    this._closeConfirmation = close;
    try {
      return (
        (await firstValueFrom(
          ref.closed$.pipe(take(1), takeUntilDestroyed(this._destroyRef), defaultIfEmpty(false)),
        )) ?? false
      );
    } finally {
      if (this._closeConfirmation === close) this._closeConfirmation = null;
    }
  }

  protected async discardChanges(): Promise<void> {
    if (!this.canDiscard()) return;
    const confirmation = this.beginConfirmation();
    if (!confirmation) return;
    try {
      const confirmed = await this.confirm({
        title: 'Discard unsaved changes?',
        description: 'Every edited field returns to its last saved value. This cannot be undone.',
      });
      if (!confirmed || !confirmation.valid()) return;
      this.invalidateSession();
      this._syncFormsFromSnapshot();
      this.sessionNotice.set('Unsaved changes discarded.');
      this.focusAfterRender(`${this.activeSection()}-title`);
    } finally {
      confirmation.finish();
    }
  }

  protected selectSection(sectionId: string): void {
    if (!SETTINGS_SECTIONS.some((section) => section.id === sectionId)) return;
    this.activeSection.set(sectionId);
    const section = this._host.nativeElement.querySelector<HTMLElement>(`#${sectionId}`);
    section?.scrollIntoView({ block: 'start' });
    section?.querySelector<HTMLElement>('h3')?.focus();
  }

  /** Called by the real Angular route deactivation guard, including readonly drafts. */
  async canDeactivate(): Promise<boolean> {
    if (!this.isDirty()) return true;
    const confirmation = this.beginConfirmation(false);
    if (!confirmation) return false;
    try {
      const confirmed = await this.confirm({
        title: 'Leave settings with unsaved changes?',
        description:
          'Leaving discards all unsaved edits and cancels any pending save. Cancel to keep editing this draft.',
      });
      if (!confirmed || !confirmation.valid()) return false;
      this.invalidateSession();
      return true;
    } finally {
      confirmation.finish();
    }
  }

  protected async leaveWorkspace(): Promise<void> {
    if (!this.canMutate() || this.confirmationPending()) return;
    this.invalidateSession();
    const confirmation = this.beginConfirmation();
    if (!confirmation) return;
    const name = this.snapshot().workspace.workspaceName;
    try {
      const confirmed = await this.confirm({
        title: `Leave ${name}?`,
        description:
          'You lose access to this workspace and discard unsaved edits in this local preview. Only explicit preview recovery restores access.',
      });
      if (confirmed && confirmation.valid())
        this.endWorkspace('left', `You left ${name}. Workspace settings are no longer accessible in this preview.`);
    } finally {
      confirmation.finish();
    }
  }

  protected deleteWorkspace(): void {
    if (!this.canMutate() || this.confirmationPending()) return;
    this.invalidateSession();
    const confirmation = this.beginConfirmation();
    if (!confirmation) return;
    const expectedSlug = this.snapshot().workspace.slug;
    const dialogRef = this._dialogs.open<string | null>(DeleteWorkspaceDialog, {
      context: { expectedSlug } satisfies DeleteWorkspaceContext,
      contentClass: 'tw:w-full tw:max-w-[425px]',
    });
    const closeDelete = () => dialogRef.close(null);
    this._closeDelete = closeDelete;
    dialogRef.closed$.pipe(take(1), takeUntilDestroyed(this._destroyRef)).subscribe((result) => {
      const valid = result === expectedSlug && confirmation.valid();
      if (this._closeDelete === closeDelete) this._closeDelete = null;
      confirmation.finish();
      if (valid)
        this.endWorkspace(
          'deleted',
          `Workspace ${expectedSlug} deleted. Its settings are no longer available in this preview.`,
        );
    });
  }

  private endWorkspace(state: 'deleted' | 'left', message: string): void {
    this.invalidateSession();
    this._loadOperation++;
    this.terminal.set(state);
    this.dangerOutcome.set(message);
    this.sessionNotice.set(null);
    this.focusAfterRender('settings-terminal-title');
  }

  protected recover(): void {
    this._loadOperation++;
    this.invalidateSession();
    this.terminal.set(null);
    this.snapshot.set(EXAMPLE_SETTINGS);
    this._syncFormsFromSnapshot();
    this.activeSection.set(SETTINGS_SECTIONS[0].id);
    this.dangerOutcome.set(null);
    this.loadError.set(null);
    this.sessionNotice.set('Preview fixtures restored.');
    this.viewState.set('loaded');
    this.focusAfterRender('settings-profile-title');
  }

  protected async reload(): Promise<void> {
    if (this.terminal() || this._destroyRef.destroyed) return;
    this.recover();
    const operation = ++this._loadOperation;
    this.viewState.set('loading');
    this.sessionNotice.set('Reload discarded local drafts and restored fixture settings.');
    try {
      await simulateExampleLoad(null, { shouldFail: this.simulateFailure() });
      if (this._destroyRef.destroyed || operation !== this._loadOperation) return;
      this.viewState.set('loaded');
    } catch (error) {
      if (this._destroyRef.destroyed || operation !== this._loadOperation) return;
      this.loadError.set(error instanceof Error ? error.message : 'Settings failed to load.');
      this.viewState.set('error');
    }
  }

  private focusAfterRender(id: string): void {
    const operation = this._loadOperation;
    setTimeout(() => {
      if (!this._destroyRef.destroyed && operation === this._loadOperation)
        this._host.nativeElement.querySelector<HTMLElement>(`#${id}`)?.focus();
    }, 0);
  }
}
