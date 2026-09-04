/**
 * Domain types for the customer resource-management example.
 *
 * Server-safe: no 'use client', no React imports.
 */

export type CustomerPlan = 'free' | 'pro' | 'team';

export type CustomerStatus = 'active' | 'invited' | 'archived';

export interface Customer {
  id: string;
  name: string;
  email: string;
  plan: CustomerPlan;
  status: CustomerStatus;
  /** Fixed UTC ISO string — fixtures never read the wall clock. */
  createdAt: string;
  /**
   * Whether row actions are available. Fixtures include at least one
   * disabled row so the action column exercises a non-interactive state.
   */
  actionsEnabled: boolean;
}

/** Explicit, deterministic outcome for simulated mutations. */
export type MutationOutcome = 'success' | 'failure';
