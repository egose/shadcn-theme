/**
 * Settings example: typed models and deterministic fixtures.
 *
 * Colocated with the owning flow. All values are fixed literals with a
 * fixed UTC ISO update stamp — the page demonstrates dirty state, save
 * feedback, and read-only restrictions against these fixtures rather than
 * any live service.
 */

import type { SettingsPlanOption, SettingsSectionNavItem, SettingsSnapshot } from './settings-types';
export type {
  ProfileSettings,
  WorkspaceSettings,
  NotificationSettings,
  SettingsSnapshot,
  SettingsSectionNavItem,
  SettingsPlanOption,
  ProfileFormValue,
  WorkspaceFormValue,
  NotificationFormValue,
} from './settings-types';

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
export const SETTINGS_SECTIONS: readonly SettingsSectionNavItem[] = [
  { id: 'settings-profile', label: 'Profile' },
  { id: 'settings-workspace', label: 'Workspace' },
  { id: 'settings-notifications', label: 'Notifications' },
  { id: 'settings-danger-zone', label: 'Danger zone' },
];

/** Deterministic timezone options for the profile form. */
export const SETTINGS_TIMEZONES: readonly string[] = ['UTC', 'America/New_York', 'Europe/Berlin', 'Asia/Tokyo'];

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
