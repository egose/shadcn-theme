/**
 * Pricing example: typed models and deterministic fixtures.
 *
 * Colocated with the owning flow (ANGEX-09 keeps domain blocks local until
 * repeated use proves a shared abstraction). Dates are fixed UTC ISO
 * strings, IDs are stable, and blurbs vary in length so plan cards exercise
 * realistic copy differences. No random or current-time defaults anywhere.
 */

export type BillingCadence = 'monthly' | 'annual';

export interface ExamplePlan {
  readonly id: string;
  readonly name: string;
  readonly monthlyCents: number;
  readonly annualCents: number;
  readonly blurb: string;
  /** Per-plan feature bullets rendered as a semantic list on each card. */
  readonly features: readonly string[];
  readonly recommended: boolean;
  readonly current: boolean;
  /** Contact-only plans (enterprise) never open the confirmation dialog. */
  readonly contactOnly: boolean;
}

/** Fixed UTC anchor all pricing copy derives from — never "today". */
export const PRICING_BILLING_ANCHOR_ISO = '2026-02-01T00:00:00.000Z';

export const EXAMPLE_PLANS: readonly ExamplePlan[] = [
  {
    id: 'plan-starter',
    name: 'Starter',
    monthlyCents: 1200,
    annualCents: 11520,
    blurb: 'Core components for a single side project.',
    features: ['Up to 3 projects', 'Core component library', 'Community support'],
    recommended: false,
    current: true,
    contactOnly: false,
  },
  {
    id: 'plan-team',
    name: 'Team',
    monthlyCents: 3900,
    annualCents: 37440,
    blurb:
      'Shared workspaces, review workflows, and deterministic preview environments for product teams shipping every week.',
    features: [
      'Unlimited projects',
      'Shared workspaces and review workflows',
      'Deterministic preview environments',
      'Priority email support',
    ],
    recommended: true,
    current: false,
    contactOnly: false,
  },
  {
    id: 'plan-enterprise',
    name: 'Enterprise',
    monthlyCents: 9900,
    annualCents: 95040,
    blurb:
      'Single sign-on, audit trails, and dedicated support for regulated organizations with custom deployment needs.',
    features: [
      'Everything in Team',
      'Single sign-on (SSO) and audit trails',
      'Custom deployment options and regulated-industry reviews',
      'Dedicated support with a one-business-day response target',
    ],
    recommended: false,
    current: false,
    contactOnly: true,
  },
];

export interface PricingComparisonRow {
  readonly feature: string;
  readonly starter: string;
  readonly team: string;
  readonly enterprise: string;
}

/** Concise feature comparison rendered as a semantic table (text, never color alone). */
export const PRICING_COMPARISON_ROWS: readonly PricingComparisonRow[] = [
  { feature: 'Projects', starter: 'Up to 3', team: 'Unlimited', enterprise: 'Unlimited' },
  { feature: 'Shared workspaces', starter: 'Not included', team: 'Included', enterprise: 'Included' },
  { feature: 'Review workflows', starter: 'Not included', team: 'Included', enterprise: 'Included' },
  { feature: 'Single sign-on (SSO)', starter: 'Not included', team: 'Add-on', enterprise: 'Included' },
  { feature: 'Support', starter: 'Community support', team: 'Priority email support', enterprise: 'Dedicated support' },
];

export interface PricingFaq {
  readonly id: string;
  readonly question: string;
  readonly answer: string;
}

/** FAQ disclosure content with stable IDs for testing. */
export const PRICING_FAQS: readonly PricingFaq[] = [
  {
    id: 'faq-billing',
    question: 'When are we billed?',
    answer:
      'Billing anchors to Feb 1, 2026 in this demo. Monthly plans renew every month and annual plans renew once per year.',
  },
  {
    id: 'faq-switch',
    question: 'Can we switch plans later?',
    answer:
      'Yes. Choosing Team from Starter opens the same confirmation step shown here, and the accessible summary always reflects the pending selection.',
  },
  {
    id: 'faq-enterprise',
    question: 'How does Enterprise purchase work?',
    answer:
      'Enterprise is contact-only: choose Contact sales and email sales@example.com. Our team replies within one business day.',
  },
  {
    id: 'faq-payment',
    question: 'Does this demo charge a card?',
    answer: 'No. Plan selection only previews confirmation details; no payment provider is integrated.',
  },
];

export function formatPlanPrice(plan: ExamplePlan, cadence: 'monthly' | 'annual'): string {
  const cents = cadence === 'monthly' ? plan.monthlyCents : plan.annualCents;
  return `$${(cents / 100).toFixed(2)}`;
}

export function formatCents(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

/** Annual totals divide evenly into monthly equivalents for every fixture plan. */
export function monthlyEquivalentCents(plan: ExamplePlan): number {
  return plan.annualCents / 12;
}

/**
 * Short unit price shown on plan cards. Changes with the billing cadence;
 * the fixtures themselves never change.
 */
export function unitPriceCopy(plan: ExamplePlan, cadence: BillingCadence): string {
  if (cadence === 'annual') {
    return `${formatCents(monthlyEquivalentCents(plan))}/mo, billed annually (${formatCents(plan.annualCents)}/year)`;
  }
  return `${formatCents(plan.monthlyCents)}/mo, billed monthly`;
}

/** Accessible one-line context for the billing summary live region. */
export function describeCadence(cadence: BillingCadence): string {
  if (cadence === 'annual') {
    return 'Annual billing: prices show the per-month equivalent, billed once per year. Switch to monthly billing to compare.';
  }
  return 'Monthly billing: prices show the per-month rate, billed every month. Switch to annual billing to compare yearly savings.';
}

/** Confirmation total for a seat quantity; deterministic math only. */
export function totalPriceCopy(plan: ExamplePlan, cadence: BillingCadence, seats: number): string {
  if (cadence === 'annual') {
    return `${formatCents(monthlyEquivalentCents(plan) * seats)}/mo, billed as ${formatCents(plan.annualCents * seats)} per year`;
  }
  return `${formatCents(plan.monthlyCents * seats)}/mo, billed monthly`;
}
