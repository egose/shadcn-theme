/**
 * Settings example: typed models and deterministic fixtures.
 *
 * Colocated with the owning flow. All values are fixed literals with a
 * fixed UTC ISO update stamp — the page demonstrates dirty state, save
 * feedback, and read-only restrictions against these fixtures rather than
 * any live service.
 */

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

export interface SettingsSnapshot {
  readonly profile: ProfileSettings;
  readonly workspace: WorkspaceSettings;
  readonly notifications: NotificationSettings;
  /** Fixed UTC ISO stamp — never derived from the current time. */
  readonly updatedAtIso: string;
}

export const EXAMPLE_SETTINGS: SettingsSnapshot = {
  profile: {
    displayName: 'Ada Okafor',
    email: 'ada.okafor@example.com',
    timezone: 'UTC',
  },
  workspace: {
    workspaceName: 'Acme Design System',
    slug: 'acme-design-system',
    planId: 'plan-team',
  },
  notifications: {
    weeklyDigest: true,
    mentionAlerts: false,
  },
  updatedAtIso: '2026-01-20T10:00:00.000Z',
};

/** Section navigation for the settings flow. Ids double as section anchors. */
export interface SettingsSectionNavItem {
  readonly id: string;
  readonly label: string;
}

export const SETTINGS_SECTIONS: readonly SettingsSectionNavItem[] = [
  { id: 'settings-profile', label: 'Profile' },
  { id: 'settings-workspace', label: 'Workspace' },
  { id: 'settings-notifications', label: 'Notifications' },
  { id: 'settings-danger-zone', label: 'Danger zone' },
];

/** Deterministic timezone options for the profile form. */
export const SETTINGS_TIMEZONES: readonly string[] = ['UTC', 'America/New_York', 'Europe/Berlin', 'Asia/Tokyo'];

export interface SettingsPlanOption {
  readonly id: string;
  readonly name: string;
}

/** Deterministic workspace plan options. */
export const SETTINGS_PLANS: readonly SettingsPlanOption[] = [
  { id: 'plan-starter', name: 'Starter' },
  { id: 'plan-team', name: 'Team' },
  { id: 'plan-enterprise', name: 'Enterprise' },
];

/**
 * Fixed UTC ISO stamp recorded when a save succeeds. Never derived from the
 * current time so save outcomes render identically across runs and zones.
 */
export const SETTINGS_SAVED_AT_ISO = '2026-03-02T09:00:00.000Z';

/** Workspace slug rule: lowercase letters, numbers, and single hyphens. */
export const SETTINGS_SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/** Typed value contracts for the three settings forms. */
export interface ProfileFormValue {
  readonly displayName: string;
  readonly email: string;
  readonly timezone: string;
}

export interface WorkspaceFormValue {
  readonly workspaceName: string;
  readonly slug: string;
  readonly planId: string;
}

export interface NotificationFormValue {
  readonly weeklyDigest: boolean;
  readonly mentionAlerts: boolean;
}
