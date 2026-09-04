import { addDaysUtc, FIXTURE_NOW } from '../_shared/fixtures';

import type { LaunchRequestValues } from './types';

/**
 * Fixed initial launch request.
 *
 * The launch date is derived from the shared `FIXTURE_NOW` constant, never
 * from `new Date()`, so the rendered summary and payloads are identical
 * across builds and time zones.
 */

export const DEFAULT_LAUNCH_REQUEST: LaunchRequestValues = {
  projectName: 'Insights Hub',
  summary:
    'Coordinate launch copy, QA sign-off, and customer success enablement before the public rollout of the new analytics workspace.',
  launchDate: new Date(addDaysUtc(FIXTURE_NOW, 21)),
  rolloutWindow: 'morning',
  ownerEmail: 'ava@company.com',
  teams: ['product', 'design'],
  confirmed: false,
};

export const ROLLOUT_WINDOW_OPTIONS = [
  { label: 'Morning (low traffic)', value: 'morning' },
  { label: 'Afternoon (peak traffic)', value: 'afternoon' },
  { label: 'Evening (maintenance window)', value: 'evening' },
];

export const TEAM_OPTIONS = [
  { label: 'Product', value: 'product' },
  { label: 'Design', value: 'design' },
  { label: 'Engineering', value: 'engineering' },
  { label: 'Customer success', value: 'customer-success' },
];

/** Human-readable labels used in the review summary. */
export const VALUE_LABELS: Record<string, string> = Object.fromEntries(
  [...ROLLOUT_WINDOW_OPTIONS, ...TEAM_OPTIONS].map((option) => [option.value, option.label]),
);
