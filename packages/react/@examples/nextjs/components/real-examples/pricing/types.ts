/** Domain types for the pricing and plan-selection example. */

export type BillingPeriod = 'monthly' | 'annual';

export type PlanId = 'starter' | 'growth' | 'scale';

export type Plan = {
  id: PlanId;
  name: string;
  tagline: string;
  /** USD charged each month on monthly billing. */
  monthlyPrice: number;
  /** Effective USD per month when billed annually. */
  annualMonthlyPrice: number;
  /** Human-readable annual savings claim, e.g. "Save $60 a year". */
  annualSavings: string;
  recommended?: boolean;
  features: readonly string[];
};

export type ComparisonRow = {
  feature: string;
  values: Record<PlanId, string>;
};

export type FaqEntry = {
  question: string;
  answer: string;
};

/** Explicit simulated outcome for the plan-change request (deterministic). */
export type UpgradeOutcome = 'success' | 'failure';
