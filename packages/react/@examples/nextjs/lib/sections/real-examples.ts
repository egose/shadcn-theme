import { defineSection } from '../example-registry';

/**
 * Real examples — full product flows that combine multiple package surfaces.
 *
 * Each example owns a directory under `components/real-examples/<slug>/`
 * (main surface, local components, types, and fixtures colocated; see
 * `components/real-examples/README.md`) and is registered here as a dynamic
 * entry whose loader points at that directory's `index.tsx`. There is no
 * real-examples barrel: entries code-split per flow and stay independently
 * importable/testable.
 */
export const realExamplesSection = defineSection({
  name: 'real-examples',
  base: '/real-examples',
  entries: [
    {
      slug: 'pricing',
      route: 'dynamic',
      title: 'Pricing and Plan Selection',
      description:
        'A pricing flow with monthly/annual billing, a feature comparison table, FAQ, and a confirmed plan-change workflow with deterministic success/failure states.',
      load: () => import('@/components/real-examples/pricing'),
    },
    {
      slug: 'customers',
      route: 'dynamic',
      title: 'Customer Resource Management',
      description:
        'A customer list with debounced search, status/plan filters, pagination, responsive table/card representations, and confirmed rename/archive mutations with deterministic outcomes.',
      load: () => import('@/components/real-examples/customers'),
    },
    {
      slug: 'settings',
      route: 'dynamic',
      title: 'Account and Workspace Settings',
      description:
        'A ContentSidebar-driven settings flow with profile, workspace, notifications, billing, and danger-zone sections: deterministic save states, permission and plan gating, clipboard feedback, and a confirmed destructive action.',
      load: () => import('@/components/real-examples/settings'),
    },
    {
      slug: 'launch-request',
      route: 'dynamic',
      title: 'Launch Request',
      description:
        'A launch-request workflow with semantic overview, schedule, ownership, and approval sections, a user-facing review summary, draft/submitted status with deterministic save outcomes, and confirmed discarding of unsaved changes.',
      load: () => import('@/components/real-examples/launch-request'),
    },
  ],
});
