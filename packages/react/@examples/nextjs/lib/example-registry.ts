import type { ComponentType } from 'react';

/**
 * Catalog registry — the single source of truth for the four example
 * sections (`components`, `form`, `widgets`, `real-examples`).
 *
 * Each section is a flat list of typed entries. Every entry carries its own
 * slug, listing metadata, and routing strategy, so catalog links, static
 * params, slug validation, and implementation lookup all derive from one
 * object — adding one entry is sufficient, and key/metadata drift is
 * impossible by construction (no parallel `Record<string, ...>` maps).
 *
 * Routing strategies:
 *
 * - `route: 'dynamic'` — the entry carries a `load` lazy loader
 *   (`() => import(...)`) and is rendered by the section's
 *   `app/<section>/[slug]/page.tsx`. Prefer this for small, self-contained
 *   demos that only need the shared `ExamplePage` framing: it keeps the
 *   catalog uniform and code-splits every implementation into its own chunk.
 * - `route: 'static'` — the example owns a dedicated
 *   `app/<section>/<slug>/page.tsx`. Prefer a dedicated static route when the
 *   example needs its own route-level logic: local `generateMetadata`,
 *   multiple composed sub-demos with bespoke layout, colocated helper files
 *   (e.g. `widgets/dialog-manager/`), or page-level tests that import the
 *   route module directly.
 *
 * The contract is enforced two ways:
 * - TypeScript: a dynamic entry without `load` (or a static entry with one)
 *   does not compile (`RegistryEntry` discriminated union).
 * - `lib/example-registry.test.ts`: dynamic loaders must resolve, static
 *   entries must have a matching `page.tsx`, and no slug may claim both.
 */

export type ExampleLink = {
  title: string;
  url: string;
  description: string;
};

export type ShowcaseLoader = () => Promise<{ default: ComponentType }>;

export type StaticEntry = {
  slug: string;
  route: 'static';
  title: string;
  description: string;
};

export type DynamicEntry = {
  slug: string;
  route: 'dynamic';
  title: string;
  description: string;
  load: ShowcaseLoader;
};

export type RegistryEntry = StaticEntry | DynamicEntry;

export type ListedEntry = RegistryEntry & { url: string };

export type SectionName = 'components' | 'form' | 'widgets' | 'real-examples';

export type ExampleSection = {
  name: SectionName;
  base: `/${SectionName}`;
  /** Catalog entries in sidebar/listing order, each with its derived URL. */
  entries: ListedEntry[];
  /** Slugs rendered by the section's `[slug]` route (in listing order). */
  dynamicSlugs: string[];
};

export function defineSection(config: {
  name: SectionName;
  base: `/${SectionName}`;
  entries: RegistryEntry[];
}): ExampleSection {
  const entries = config.entries.map((entry) => ({ ...entry, url: `${config.base}/${entry.slug}` }));
  return {
    name: config.name,
    base: config.base,
    entries,
    dynamicSlugs: entries.filter((entry) => entry.route === 'dynamic').map((entry) => entry.slug),
  };
}
