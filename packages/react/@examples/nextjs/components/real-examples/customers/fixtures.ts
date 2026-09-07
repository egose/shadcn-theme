/**
 * Deterministic customer fixtures for the resource-management example.
 *
 * Conventions come from `../_shared/fixtures.ts`: stable IDs, fixed UTC
 * offsets from `FIXTURE_NOW`, varied name lengths, archived and disabled
 * rows, and enough entries (12 at a page size of 5) to exercise pagination.
 *
 * Avatars intentionally have no `src`: every row renders its initials
 * fallback (no remote images), so rendering is identical in every
 * environment and on every run.
 *
 * Server-safe: no 'use client', no React imports.
 */

import { addDaysUtc, FIXTURE_NOW, stableId } from '../_shared/fixtures';

import type { Customer } from './types';

interface CustomerSeed {
  name: string;
  email: string;
  plan: Customer['plan'];
  status: Customer['status'];
  createdDaysAgo: number;
  actionsEnabled?: boolean;
}

const SEEDS: readonly CustomerSeed[] = [
  { name: 'Ada Okafor', email: 'ada.okafor@example.com', plan: 'pro', status: 'active', createdDaysAgo: 1 },
  { name: 'Ben Carter', email: 'ben.carter@example.com', plan: 'free', status: 'invited', createdDaysAgo: 3 },
  {
    // Deliberately long name to exercise truncation/wrapping in both layouts.
    name: 'Christobal Hernandez-Villanueva y Delgado',
    email: 'christobal.hernandez-villanueva-y-delgado@example.com',
    plan: 'team',
    status: 'active',
    createdDaysAgo: 8,
  },
  { name: 'Dana Kim', email: 'dana.kim@example.com', plan: 'free', status: 'active', createdDaysAgo: 13 },
  { name: 'Efe Mensah', email: 'efe.mensah@example.com', plan: 'pro', status: 'archived', createdDaysAgo: 21 },
  { name: 'Farah Noor', email: 'farah.noor@example.com', plan: 'team', status: 'active', createdDaysAgo: 34 },
  {
    // Disabled-row fixture: actions are unavailable for this customer.
    name: 'Grace Liu',
    email: 'grace.liu@example.com',
    plan: 'free',
    status: 'active',
    createdDaysAgo: 55,
    actionsEnabled: false,
  },
  { name: 'Henrik Sorensen', email: 'henrik.sorensen@example.com', plan: 'pro', status: 'active', createdDaysAgo: 89 },
  { name: 'Imani Diallo', email: 'imani.diallo@example.com', plan: 'free', status: 'invited', createdDaysAgo: 144 },
  { name: 'Joao Pereira', email: 'joao.pereira@example.com', plan: 'team', status: 'archived', createdDaysAgo: 233 },
  { name: 'Kira Tanaka', email: 'kira.tanaka@example.com', plan: 'pro', status: 'active', createdDaysAgo: 377 },
  { name: 'Leila Haddad', email: 'leila.haddad@example.com', plan: 'free', status: 'active', createdDaysAgo: 610 },
];

export const CUSTOMERS: readonly Customer[] = SEEDS.map((seed, index) => ({
  id: stableId('customer', index + 1),
  name: seed.name,
  email: seed.email,
  plan: seed.plan,
  status: seed.status,
  createdAt: addDaysUtc(FIXTURE_NOW, -seed.createdDaysAgo),
  actionsEnabled: seed.actionsEnabled ?? true,
}));

/** Empty customer list for the inspectable initial-empty state. */
export const NO_CUSTOMERS: readonly Customer[] = Object.freeze([]);
