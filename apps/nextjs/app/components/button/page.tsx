'use client';

import { IconInbox } from '@tabler/icons-react';
import _startCase from 'lodash-es/startCase';
import { Button } from '../../../../../packages/react/components/ui/button';

const variants = [
  'primary',
  'secondary',
  'success',
  'warning',
  'danger',
  'info',
  'light',
  'dark',
  'link',
  'destructive',
  'accent',
  'muted',
] as const;

export default function Page() {
  return (
    <>
      <h1 className="font-bold text-2xl mt-4 mb-5">Button</h1>

      {/* Basic */}
      <Section title="Basic">
        {variants.map((variant) => (
          <Button key={variant} variant={variant}>
            {_startCase(variant)}
          </Button>
        ))}
      </Section>

      {/* Basic - disabled */}
      <Section title="Basic - disabled">
        {variants.map((variant) => (
          <Button key={variant} variant={variant} disabled>
            {_startCase(variant)}
          </Button>
        ))}
      </Section>

      {/* Basic - loading */}
      <Section title="Basic - loading">
        {variants.map((variant) => (
          <Button key={variant} variant={variant} loading>
            {_startCase(variant)}
          </Button>
        ))}
      </Section>

      {/* Basic - disabled + loading */}
      <Section title="Basic - disabled - loading">
        {variants.map((variant) => (
          <Button key={variant} variant={variant} disabled loading>
            {_startCase(variant)}
          </Button>
        ))}
      </Section>

      {/* Compact (was thin) */}
      <Section title="Compact">
        {variants.map((variant) => (
          <Button key={variant} variant={variant} size="compact-default">
            {_startCase(variant)}
          </Button>
        ))}
      </Section>

      {/* Outline */}
      <Section title="Outline">
        {variants.map((variant) => (
          <Button key={variant} variant={variant} appearance="outline">
            {_startCase(variant)}
          </Button>
        ))}
      </Section>

      {/* Outline - disabled */}
      <Section title="Outline - disabled">
        {variants.map((variant) => (
          <Button key={variant} variant={variant} appearance="outline" disabled>
            {_startCase(variant)}
          </Button>
        ))}
      </Section>

      {/* Outline - loading */}
      <Section title="Outline - loading">
        {variants.map((variant) => (
          <Button key={variant} variant={variant} appearance="outline" loading>
            {_startCase(variant)}
          </Button>
        ))}
      </Section>

      {/* Outline - disabled + loading */}
      <Section title="Outline - disabled - loading">
        {variants.map((variant) => (
          <Button key={variant} variant={variant} appearance="outline" disabled loading>
            {_startCase(variant)}
          </Button>
        ))}
      </Section>

      {/* Outline - compact */}
      <Section title="Outline - compact">
        {variants.map((variant) => (
          <Button key={variant} variant={variant} appearance="outline" size="compact-default">
            {_startCase(variant)}
          </Button>
        ))}
      </Section>

      {/* Outline Filled */}
      <Section title="Outline filled">
        {variants.map((variant) => (
          <Button key={variant} variant={variant} appearance="outline-filled">
            {_startCase(variant)}
          </Button>
        ))}
      </Section>

      {/* Outline Filled - disabled */}
      <Section title="Outline filled - disabled">
        {variants.map((variant) => (
          <Button key={variant} variant={variant} appearance="outline-filled" disabled>
            {_startCase(variant)}
          </Button>
        ))}
      </Section>

      {/* Outline Filled - loading */}
      <Section title="Outline filled - loading">
        {variants.map((variant) => (
          <Button key={variant} variant={variant} appearance="outline-filled" loading>
            {_startCase(variant)}
          </Button>
        ))}
      </Section>

      {/* Outline Filled - disabled + loading */}
      <Section title="Outline filled - disabled - loading">
        {variants.map((variant) => (
          <Button key={variant} variant={variant} appearance="outline-filled" disabled loading>
            {_startCase(variant)}
          </Button>
        ))}
      </Section>

      {/* Outline Filled - compact */}
      <Section title="Outline filled - compact">
        {variants.map((variant) => (
          <Button key={variant} variant={variant} appearance="outline-filled" size="compact-default">
            {_startCase(variant)}
          </Button>
        ))}
      </Section>

      {/* Icons */}
      <Section title="Icon (left)">
        {variants.map((variant) => (
          <Button key={variant} variant={variant} icon={<IconInbox />} iconPosition="left">
            {_startCase(variant)}
          </Button>
        ))}
      </Section>

      <Section title="Icon (right)">
        {variants.map((variant) => (
          <Button key={variant} variant={variant} icon={<IconInbox />} iconPosition="right">
            {_startCase(variant)}
          </Button>
        ))}
      </Section>
    </>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="font-semibold mt-4">
      <h3>{title}</h3>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}
