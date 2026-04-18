import Link from 'next/link';

import { realExampleExamples } from '../../lib/example-registry';

export default function Page() {
  return (
    <div className="space-y-8 py-4">
      <header className="space-y-2">
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-muted-foreground">Examples</p>
        <div className="space-y-1">
          <h1 className="text-3xl font-semibold tracking-tight">Real Examples</h1>
          <p className="max-w-3xl text-sm leading-6 text-muted-foreground">
            These demos combine multiple fields and patterns into realistic flows so you can evaluate how the pieces
            work together in practice.
          </p>
        </div>
      </header>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {realExampleExamples.map((example) => (
          <Link
            key={example.url}
            href={example.url}
            className="rounded-xl border bg-background p-5 transition-colors hover:border-primary/40 hover:bg-muted/30"
          >
            <div className="space-y-2">
              <h2 className="text-lg font-semibold">{example.title}</h2>
              <p className="text-sm leading-6 text-muted-foreground">{example.description}</p>
              <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">{example.url}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
