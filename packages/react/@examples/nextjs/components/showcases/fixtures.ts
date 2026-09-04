/**
 * Shared deterministic fixtures for the dynamic showcase modules.
 *
 * Pure data only — this module is intentionally server-safe (no 'use client',
 * no React imports) so both server-rendered and client showcases can share it.
 */

export const teammates = [
  { name: 'Ava Stone', initials: 'AS', src: 'https://i.pravatar.cc/120?img=32', role: 'Design' },
  { name: 'Kai Miller', initials: 'KM', src: 'https://i.pravatar.cc/120?img=12', role: 'Frontend' },
  { name: 'Ruth Chen', initials: 'RC', src: 'https://i.pravatar.cc/120?img=48', role: 'Backend' },
];

export const selectOptions = [
  { label: 'Starter', value: 'starter' },
  { label: 'Growth', value: 'growth' },
  { label: 'Enterprise', value: 'enterprise' },
];

export const searchableOptions = [
  { label: 'Berlin', value: 'berlin' },
  { label: 'Lisbon', value: 'lisbon' },
  { label: 'Seoul', value: 'seoul' },
  { label: 'Toronto', value: 'toronto' },
];

export const multiSelectOptions = [
  { value: 'ops', label: 'Operations' },
  { value: 'product', label: 'Product' },
  { value: 'design', label: 'Design' },
  { value: 'data', label: 'Data' },
  { value: 'growth', label: 'Growth' },
];

export const tagSuggestions = ['Bug', 'Design System', 'Docs', 'Performance', 'Research', 'UX'];

export const orders = [
  { customer: 'Northwind', plan: 'Growth', amount: '$1,240', status: 'Paid' },
  { customer: 'Argon Labs', plan: 'Starter', amount: '$420', status: 'Pending' },
  { customer: 'Marble HQ', plan: 'Enterprise', amount: '$6,800', status: 'Paid' },
];
