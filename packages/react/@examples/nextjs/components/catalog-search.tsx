'use client';

import Link from 'next/link';
import { useId, useRef, useState } from 'react';

import { Button } from '@egose/shadcn-theme/components/ui/button';
import { Input } from '@egose/shadcn-theme/components/ui/input';
import { Label } from '@egose/shadcn-theme/components/ui/label';
import type { CatalogListing } from '../lib/example-registry';

export function CatalogSearch({ entries }: { entries: CatalogListing[] }) {
  // Empty initial query renders every card on the server, before hydration.
  const [query, setQuery] = useState('');
  const id = useId();
  const input = useRef<HTMLInputElement>(null);
  const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  const results = entries.filter((entry) => {
    const text = [entry.title, entry.description, ...entry.capabilities].join(' ').toLowerCase();
    return terms.every((term) => text.includes(term));
  });

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor={id}>Search examples</Label>

        <div className="flex flex-wrap gap-2">
          <Input
            ref={input}
            id={id}
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            aria-describedby={`${id}-help ${id}-results`}
            className="min-w-0 flex-1 basis-60"
          />

          <Button
            variant="secondary"
            disabled={!query}
            onClick={() => {
              setQuery('');
              input.current?.focus();
            }}
          >
            Clear search
          </Button>
        </div>

        <p id={`${id}-help`} className="text-sm text-muted-foreground">
          Search titles, descriptions, and capabilities in this section.
        </p>

        <p id={`${id}-results`} role="status" className="text-sm text-muted-foreground">
          {results.length} of {entries.length} examples
        </p>
      </div>
      {results.length === 0 && <p>No examples match “{query}”. Try fewer words or clear the search.</p>}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {results.map((entry) => (
          <article key={entry.url} className="min-w-0 space-y-3 rounded-xl border bg-background p-5">
            <h2 className="text-lg font-semibold">
              <Link href={entry.url} className="underline-offset-4 hover:underline focus-visible:underline">
                {entry.title}
              </Link>
            </h2>
            <p className="text-sm leading-6 text-muted-foreground">{entry.description}</p>
            <p className="break-all text-xs font-medium text-muted-foreground">{entry.url}</p>

            {entry.capabilities.length > 0 && (
              <p className="text-sm">
                <span className="font-medium">Capabilities: </span>
                {entry.capabilities.join(' · ')}
              </p>
            )}

            {entry.related.length > 0 && (
              <div className="space-y-1 text-sm">
                <p className="font-medium">Related examples</p>

                <ul className="space-y-1">
                  {entry.related.map((related) => (
                    <li key={related.url}>
                      <Link href={related.url} className="text-muted-foreground underline underline-offset-4">
                        {related.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </article>
        ))}
      </div>
    </div>
  );
}
