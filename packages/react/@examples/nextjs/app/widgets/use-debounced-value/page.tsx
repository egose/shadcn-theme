'use client';

import * as React from 'react';
import { Input } from '../../../../../components/ui/input';
import { Badge } from '../../../../../components/ui/badge';
import { useDebouncedValue } from '../../../../../hooks/use-debounced-value';
import { ExamplePage, ExampleSection, ExampleStack } from '@/components/showcase-shell';

const ALL_ITEMS = [
  'Aurora workspace',
  'Atlas workspace',
  'Beacon workspace',
  'Cascade workspace',
  'Cinder workspace',
  'Delta workspace',
  'Echo workspace',
  'Granite workspace',
  'Halo workspace',
  'Helix workspace',
  'Marble workspace',
  'Nimbus workspace',
  'Quartz workspace',
  'Sable workspace',
  'Tempest workspace',
];

export default function Page() {
  const [query, setQuery] = React.useState('');
  const [delay, setDelay] = React.useState(250);
  const debouncedQuery = useDebouncedValue(query, delay);

  const filtered = React.useMemo(() => {
    if (!debouncedQuery.trim()) {
      return ALL_ITEMS;
    }
    const needle = debouncedQuery.trim().toLowerCase();
    return ALL_ITEMS.filter((item) => item.toLowerCase().includes(needle));
  }, [debouncedQuery]);

  return (
    <ExamplePage
      title="useDebouncedValue"
      description="A small hook that returns a debounced copy of a value — useful for deferring expensive work until the input has settled."
    >
      <ExampleSection
        title="Live search"
        description="Type in the field below — the filtered list only updates after you pause typing for the configured delay."
      >
        <ExampleStack>
          <div className="flex flex-wrap items-center gap-3">
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Filter workspaces…"
              className="max-w-sm"
              aria-label="Filter workspaces"
            />
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <label htmlFor="debounce-delay">Delay</label>
              <Input
                id="debounce-delay"
                type="number"
                min={0}
                step={50}
                value={delay}
                onChange={(event) => setDelay(Number(event.target.value) || 0)}
                className="h-9 w-24"
                aria-label="Debounce delay in milliseconds"
              />
              <span>ms</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-sm">
            <Badge variant="secondary" appearance="outline">
              raw: {query.length ? query : '(empty)'}
            </Badge>
            <Badge variant="secondary" appearance="outline">
              debounced: {debouncedQuery.length ? debouncedQuery : '(empty)'}
            </Badge>
            <Badge variant="secondary" appearance="outline">
              matches: {filtered.length}
            </Badge>
          </div>

          <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((item) => (
              <li key={item} className="rounded-lg border px-3 py-2 text-sm">
                {item.trim()}
              </li>
            ))}
            {filtered.length === 0 ? (
              <li className="col-span-full text-sm text-muted-foreground">
                No workspaces match &ldquo;{debouncedQuery}&rdquo;.
              </li>
            ) : null}
          </ul>
        </ExampleStack>
      </ExampleSection>
      <ExampleSection
        title="How it works"
        description="Each render schedules a timer that copies the latest value into state after the configured delay; the cleanup clears the previous timer on every change."
      >
        <ExampleStack>
          <ol className="list-decimal space-y-1 pl-5 text-sm text-muted-foreground">
            <li>The user types into the controlled input.</li>
            <li>
              <code className="rounded bg-muted px-1 py-0.5 text-xs">useDebouncedValue</code> captures the latest value
              without committing it yet.
            </li>
            <li>
              After <code className="rounded bg-muted px-1 py-0.5 text-xs">{`{delay}ms`}</code> without changes, the
              debounced value updates.
            </li>
            <li>The filtered list re-renders once per pause — never per keystroke.</li>
          </ol>
        </ExampleStack>
      </ExampleSection>
    </ExamplePage>
  );
}
