/**
 * Domain types for the account/workspace settings real example.
 * Fixtures live in `./fixtures.ts`; everything stays deterministic
 * (fixed IDs and dates via `_shared/fixtures.ts` conventions).
 */

/** Deterministic outcome the catalog tooling chooses for simulated saves/copies. */
export type SimulatedOutcomeChoice = 'success' | 'failure';

/** Clipboard behavior chosen by the catalog tooling. */
export type ClipboardBehavior = 'real' | 'force-failure';

/**
 * The persistence state model every editable settings section shares:
 * - `pristine` — draft matches the last saved values
 * - `unsaved` — the user has edited one or more fields
 * - `saving` — a simulated save request is in flight
 * - `saved` — the last save succeeded
 * - `error` — the last save failed; unsaved changes are kept
 */
export type SaveStatus = 'pristine' | 'unsaved' | 'saving' | 'saved' | 'error';

export type ProfileDraft = {
  displayName: string;
  bio: string;
};

export type DigestFrequency = 'off' | 'daily' | 'weekly';

export type NotificationDraft = {
  mentions: boolean;
  productUpdates: boolean;
  digestFrequency: DigestFrequency;
};

export type WorkspaceDraft = {
  name: string;
};

export type BillingDraft = {
  billingEmail: string;
};
