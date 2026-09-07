import Link from 'next/link';

import type { ExampleSection } from '../lib/example-registry';

/**
 * Shared server-compatible presentation for the four section catalog index
 * pages (`/components`, `/form`, `/widgets`, `/real-examples`).
 */
export function CatalogIndexPage({
  title,
  description,
  section,
}: {
  title: string;
  description: string;
  section: ExampleSection;
}) {
  return (
    <div className="space-y-8 py-4">
      <header className="space-y-2">
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-muted-foreground">Examples</p>
        <div className="space-y-1">
          <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
          <p className="max-w-3xl text-sm leading-6 text-muted-foreground">{description}</p>
        </div>
      </header>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {section.entries.map((entry) => (
          <Link
            key={entry.slug}
            href={entry.url}
            className="rounded-xl border bg-background p-5 transition-colors hover:border-primary/40 hover:bg-muted/30"
          >
            <div className="space-y-2">
              <h2 className="text-lg font-semibold">{entry.title}</h2>
              <p className="text-sm leading-6 text-muted-foreground">{entry.description}</p>
              <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">{entry.url}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
