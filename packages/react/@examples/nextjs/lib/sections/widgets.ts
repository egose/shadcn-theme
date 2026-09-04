import { defineSection } from '../example-registry';

/**
 * Widgets — composed, real-world building blocks grouped by family:
 *   1. Foundation/Shell helpers (Page Header, Content Sidebar)
 *   2. Dialog manager + dialog-producing widgets
 *   3. List / row action widgets
 *   4. Hook demos
 *
 * All widget examples currently own a dedicated static route under
 * `app/widgets/<slug>/page.tsx`, so every entry is `route: 'static'`.
 */
export const widgetsSection = defineSection({
  name: 'widgets',
  base: '/widgets',
  entries: [
    // ─── Shell / Page framing ────────────────────────────────────────
    {
      slug: 'page-header',
      route: 'static',
      title: 'Page Header',
      description: 'Consistent title, description, and trailing actions for page tops.',
    },
    {
      slug: 'content-sidebar',
      route: 'static',
      title: 'Content Sidebar',
      description: 'Sidebar paired with switchable content panels and breadcrumbs.',
    },

    // ─── Dialog manager + dialog-producing widgets ───────────────────
    {
      slug: 'dialog-manager',
      route: 'static',
      title: 'Dialog Manager',
      description: 'Programmatic dialogs created through a shared manager context.',
    },
    {
      slug: 'confirmation-dialog',
      route: 'static',
      title: 'Confirmation Dialog',
      description: 'Promise-based confirmation dialog that resolves with the user decision.',
    },
    {
      slug: 'text-input-dialog',
      route: 'static',
      title: 'Text Input Dialog',
      description: 'Promise-based text prompt with built-in length validation.',
    },
    {
      slug: 'image-preview-dialog',
      route: 'static',
      title: 'Image Preview Dialog',
      description: 'Programmatic image preview dialog driven through the shared manager.',
    },

    // ─── List / row actions ──────────────────────────────────────────
    {
      slug: 'action-menu',
      route: 'static',
      title: 'Action Menu',
      description: 'List-driven dropdown menu for row and card overflow actions.',
    },

    // ─── Hook demos ──────────────────────────────────────────────────
    {
      slug: 'use-debounced-value',
      route: 'static',
      title: 'Use Debounced Value',
      description: 'A hook demo showing deferred filtering while the user types.',
    },
  ],
});
