import { FIXTURE_NOW, stableId } from '../_shared/fixtures';

import type { BillingDraft, NotificationDraft, ProfileDraft, WorkspaceDraft } from './types';

/**
 * Deterministic fixtures for the settings example. IDs and dates follow the
 * shared conventions (`stableId`, `FIXTURE_NOW`) — no `new Date()`, no
 * randomness, no remote resources.
 */

/** Stable workspace identifier shown (and copied) in the workspace section. */
export const WORKSPACE_ID = stableId('workspace', 42); // 'workspace-042'

/** Fixed demo invite URL; copying it is the clipboard workflow. */
export const INVITE_URL = `https://app.example.dev/invite/${WORKSPACE_ID}?expires=2026-03-16`;

/** The current plan — drives the plan-gated billing control. */
export const CURRENT_PLAN = { id: 'starter', name: 'Starter' } as const;

/** The plan required by the gated control, referenced in its visible reason. */
export const REQUIRED_PLAN = { id: 'scale', name: 'Scale' } as const;

/** Signed-in user's role — drives the permission-disabled control. */
export const CURRENT_ROLE = 'administrator' as const;

export const INITIAL_PROFILE: ProfileDraft = {
  displayName: 'Rowan Whitfield',
  bio: 'Operations lead keeping shared infrastructure, incident runbooks, and on-call rotations boring.',
};

export const INITIAL_WORKSPACE: WorkspaceDraft = {
  // Deliberately long name to exercise wrapping/truncation at narrow widths.
  name: 'Acme Platform — Cross-Regional Shared Services and Developer Experience',
};

export const INITIAL_NOTIFICATIONS: NotificationDraft = {
  mentions: true,
  productUpdates: false,
  digestFrequency: 'weekly',
};

export const INITIAL_BILLING: BillingDraft = {
  billingEmail: 'billing@acme.example.dev',
};

/** Deliberately long, realistic failure text to exercise wrapping at narrow widths. */
export const SAVE_ERROR_HINT =
  'The settings service did not acknowledge the request before the deadline, so nothing was persisted. Your edits are still here — try saving again.';

/** Date the workspace was created — fixed ISO, rendered as-is. */
export const WORKSPACE_CREATED_AT = FIXTURE_NOW.slice(0, 10);
