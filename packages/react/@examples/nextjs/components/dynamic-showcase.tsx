import * as React from 'react';

import type { DynamicEntry, ExampleSection, ListedEntry } from '../lib/example-registry';

/**
 * Shared renderer for the registry-backed dynamic `[slug]` routes. Resolving
 * through `entry.load()` keeps each showcase module in its own lazy chunk, so
 * rendering one catalog page never bundles its sibling implementations.
 */
export function DynamicShowcase({ section, slug }: { section: ExampleSection; slug: string }) {
  const entry = section.entries.find((e): e is ListedEntry & DynamicEntry => e.slug === slug && e.route === 'dynamic');
  if (!entry) {
    return null;
  }
  return <LazyEntry load={entry.load} />;
}

function LazyEntry({ load }: { load: DynamicEntry['load'] }) {
  const loaded = React.use(load());
  const Showcase = loaded.default;
  return <Showcase />;
}
