import type { LaunchRequestValues } from './types';

/**
 * Fixed initial launch request.
 *
 * The launch date is a calendar day, not an instant. Keep it date-only through
 * the form and submitted payload so local picker display cannot shift the day.
 */

export const DEFAULT_LAUNCH_REQUEST: LaunchRequestValues = {
  projectName: 'Insights Hub',
  summary:
    'Coordinate launch copy, QA sign-off, and customer success enablement before the public rollout of the new analytics workspace.',
  launchDate: '2026-03-30',
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
