import type { FormControl, FormGroup } from '@angular/forms';

export interface ProfileSettings {
  readonly displayName: string;
  readonly email: string;
  readonly timezone: string;
}

export interface WorkspaceSettings {
  readonly workspaceName: string;
  readonly slug: string;
  readonly planId: string;
}

export interface NotificationSettings {
  readonly weeklyDigest: boolean;
  readonly mentionAlerts: boolean;
}

export interface SettingsRawValue {
  readonly profile: ProfileSettings;
  readonly workspace: WorkspaceSettings;
  readonly notifications: NotificationSettings;
}

export interface SettingsSnapshot extends SettingsRawValue {
  /** Deterministic UTC timestamp for the local preview. */
  readonly updatedAtIso: string;
}

export type ProfileFormValue = ProfileSettings;
export type WorkspaceFormValue = WorkspaceSettings;
export type NotificationFormValue = NotificationSettings;
export type ProfileSettingsForm = FormGroup<{ [K in keyof ProfileSettings]: FormControl<ProfileSettings[K]> }>;
export type WorkspaceSettingsForm = FormGroup<{ [K in keyof WorkspaceSettings]: FormControl<WorkspaceSettings[K]> }>;
export type NotificationSettingsForm = FormGroup<{
  [K in keyof NotificationSettings]: FormControl<NotificationSettings[K]>;
}>;
export type SettingsSaveState = 'idle' | 'pending' | 'success' | 'failure';

export interface SettingsSectionNavItem {
  readonly id: string;
  readonly label: string;
}

export interface SettingsPlanOption {
  readonly id: string;
  readonly name: string;
}

export interface DeleteWorkspaceContext {
  readonly expectedSlug: string;
}
