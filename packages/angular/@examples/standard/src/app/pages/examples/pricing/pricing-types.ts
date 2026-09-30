export type BillingCadence = 'monthly' | 'annual';

export interface ExamplePlan {
  readonly id: string;
  readonly name: string;
  readonly monthlyCents: number;
  readonly annualCents: number;
  readonly blurb: string;
  readonly features: readonly string[];
  readonly recommended: boolean;
  readonly current: boolean;
  readonly contactOnly: boolean;
}

export interface PricingComparisonRow {
  readonly feature: string;
  readonly starter: string;
  readonly team: string;
  readonly enterprise: string;
}

export interface PricingFaq {
  readonly id: string;
  readonly question: string;
  readonly answer: string;
}

export interface PlanConfirmContext {
  readonly planName: string;
  readonly unitCopy: string;
}

export interface PlanConfirmResult {
  readonly seats: number;
}

/** A selection always belongs to the plan snapshot and cadence that opened it. */
export interface PricingSelection {
  readonly plan: ExamplePlan;
  readonly cadence: BillingCadence;
  readonly status: 'pending' | 'cancelled' | 'confirmed' | 'contact';
  readonly seats?: number;
}
