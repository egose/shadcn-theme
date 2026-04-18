import * as React from 'react';
import { cn } from '../../../utils/ui';

export function ExamplePage({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
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
      {children}
    </div>
  );
}

export function ExampleSection({
  title,
  description,
  children,
  className,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className="space-y-3">
      <div className="space-y-1">
        <h2 className="text-lg font-semibold">{title}</h2>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </div>
      <div className={cn('rounded-xl border bg-background p-4', className)}>{children}</div>
    </section>
  );
}

export function ExampleGrid({ className, ...props }: React.ComponentProps<'div'>) {
  return <div className={cn('grid gap-4 md:grid-cols-2 xl:grid-cols-3', className)} {...props} />;
}

export function ExampleStack({ className, ...props }: React.ComponentProps<'div'>) {
  return <div className={cn('flex flex-col gap-4', className)} {...props} />;
}

export function ExampleInline({ className, ...props }: React.ComponentProps<'div'>) {
  return <div className={cn('flex flex-wrap items-center gap-3', className)} {...props} />;
}
