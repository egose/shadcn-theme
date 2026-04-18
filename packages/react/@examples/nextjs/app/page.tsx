import Link from 'next/link';
import { componentExamples, formExamples, realExampleExamples, widgetExamples } from '../lib/example-registry';

const sections = [
  {
    title: 'Components',
    href: '/components',
    count: componentExamples.length,
    description: 'Browse the full UI component surface with focused usage examples.',
  },
  {
    title: 'Form',
    href: '/form',
    count: formExamples.length,
    description: 'See controlled, uncontrolled, and react-hook-form integrations side by side.',
  },
  {
    title: 'Widgets',
    href: '/widgets',
    count: widgetExamples.length,
    description: 'Explore higher-level interaction helpers built on top of the primitives.',
  },
  {
    title: 'Real Examples',
    href: '/real-examples',
    count: realExampleExamples.length,
    description: 'See complete, task-oriented demos that combine multiple components into a realistic workflow.',
  },
];

export default function Home() {
  return (
    <div className="space-y-8 py-4">
      <section className="space-y-3">
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-muted-foreground">shadcn-theme</p>
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight">Component example catalog</h1>
          <p className="max-w-3xl text-sm leading-6 text-muted-foreground">
            The example app now indexes the available UI, form, and widget demos from a shared registry so navigation
            stays consistent as coverage grows.
          </p>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {sections.map((section) => (
          <Link
            key={section.href}
            href={section.href}
            className="rounded-xl border bg-background p-5 transition-colors hover:border-primary/40 hover:bg-muted/30"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-lg font-semibold">{section.title}</h2>
                <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
                  {section.count} demos
                </span>
              </div>
              <p className="text-sm leading-6 text-muted-foreground">{section.description}</p>
            </div>
          </Link>
        ))}
      </section>
    </div>
  );
}
