/**
 * Deterministic fixtures for the pricing example. No dates, no randomness:
 * prices, claims, and copy are fixed so renders are identical across builds
 * and time zones. Follows `components/real-examples/_shared/fixtures.ts`.
 */

import type { ComparisonRow, FaqEntry, Plan, PlanId } from './types';

/** Plan the demo workspace is on when the example loads. */
export const CURRENT_PLAN_ID: PlanId = 'starter';

export const PLANS: readonly Plan[] = [
  {
    id: 'starter',
    name: 'Starter',
    tagline: 'For individuals and small side projects.',
    monthlyPrice: 12,
    annualMonthlyPrice: 10,
    annualSavings: 'Save $24 a year',
    features: ['Up to 3 projects', 'Community support', '1 GB storage'],
  },
  {
    id: 'growth',
    name: 'Growth',
    tagline: 'For teams shipping to production regularly.',
    monthlyPrice: 29,
    annualMonthlyPrice: 24,
    annualSavings: 'Save $60 a year',
    recommended: true,
    features: ['Unlimited projects', 'Priority email support', '50 GB storage', 'Custom domains'],
  },
  {
    id: 'scale',
    name: 'Scale',
    tagline:
      'For organizations with compliance, audit, and cross-team reliability requirements that span multiple working groups.',
    monthlyPrice: 79,
    annualMonthlyPrice: 65,
    annualSavings: 'Save $168 a year',
    features: ['Everything in Growth', 'Single sign-on (SSO)', 'Audit log', '500 GB storage', '99.9% uptime SLA'],
  },
];

export const COMPARISON_ROWS: readonly ComparisonRow[] = [
  { feature: 'Projects', values: { starter: 'Up to 3', growth: 'Unlimited', scale: 'Unlimited' } },
  { feature: 'Storage', values: { starter: '1 GB', growth: '50 GB', scale: '500 GB' } },
  { feature: 'Custom domains', values: { starter: 'Not included', growth: 'Included', scale: 'Included' } },
  { feature: 'Support', values: { starter: 'Community', growth: 'Priority email', scale: 'Priority + SLA' } },
  { feature: 'Single sign-on (SSO)', values: { starter: 'Not included', growth: 'Not included', scale: 'Included' } },
  { feature: 'Audit log', values: { starter: 'Not included', growth: 'Not included', scale: 'Included' } },
];

export const FAQ_ENTRIES: readonly FaqEntry[] = [
  {
    question: 'Can I change plans at any time?',
    answer:
      'Yes. Upgrades apply immediately and downgrades take effect at the start of your next billing cycle. This example simulates the request; no payment provider is involved.',
  },
  {
    question: 'How does annual billing work?',
    answer:
      'Annual billing charges once per year at a discounted rate. The per-month figure shown is the effective monthly cost of that annual charge.',
  },
  {
    question: 'Is there a free trial?',
    answer:
      'Every workspace starts with a 14-day evaluation of the Growth plan. You pick a paid plan before the evaluation ends to keep your projects active.',
  },
  {
    question: 'What happens to my data if I downgrade?',
    answer:
      'Nothing is deleted. Features above your new plan’s limits become read-only until you reduce usage or upgrade again.',
  },
];
