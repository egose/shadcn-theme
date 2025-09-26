'use client';

import { IconInbox } from '@tabler/icons-react';
import _startCase from 'lodash-es/startCase';
import { Button } from '../../../../../packages/react/components/ui/button';

// All possible values from your buttonVariants definition
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

const sizes = [
  'xs',
  'sm',
  'default',
  'lg',
  'icon',
  'compact-xs',
  'compact-sm',
  'compact-default',
  'compact-lg',
] as const;

const appearances = ['solid', 'outline', 'outline-filled'] as const;

export default function Page() {
  return (
    <>
      <h1 className="font-bold text-2xl mt-4 mb-5">Button Showcase</h1>

      {/* Variants x Appearance x Loading */}
      {appearances.map((appearance) => (
        <Section key={appearance} title={`Appearance: ${_startCase(appearance)}`}>
          {variants.map((variant) => (
            <Button key={variant} variant={variant} appearance={appearance}>
              {_startCase(variant)}
            </Button>
          ))}
        </Section>
      ))}

      {/* Sizes */}
      <Section title="Sizes">
        {sizes.map((size) => (
          <Button key={size} size={size}>
            {_startCase(size)}
          </Button>
        ))}
      </Section>

      {/* Loading States */}
      {appearances.map((appearance) => (
        <Section key={appearance + '-loading'} title={`Appearance: ${_startCase(appearance)} - Loading`}>
          {variants.map((variant) => (
            <Button key={variant} variant={variant} appearance={appearance} loading>
              {_startCase(variant)}
            </Button>
          ))}
        </Section>
      ))}

      {/* Disabled States */}
      {appearances.map((appearance) => (
        <Section key={appearance + '-disabled'} title={`Appearance: ${_startCase(appearance)} - Disabled`}>
          {variants.map((variant) => (
            <Button key={variant} variant={variant} appearance={appearance} disabled>
              {_startCase(variant)}
            </Button>
          ))}
        </Section>
      ))}

      {/* Loading + Disabled */}
      {appearances.map((appearance) => (
        <Section
          key={appearance + '-loading-disabled'}
          title={`Appearance: ${_startCase(appearance)} - Loading + Disabled`}
        >
          {variants.map((variant) => (
            <Button key={variant} variant={variant} appearance={appearance} disabled loading>
              {_startCase(variant)}
            </Button>
          ))}
        </Section>
      ))}

      {/* Icons */}
      <Section title="Icons (Left)">
        {variants.map((variant) => (
          <Button key={variant + '-icon-left'} variant={variant} icon={<IconInbox />} iconPosition="left">
            {_startCase(variant)}
          </Button>
        ))}
      </Section>

      <Section title="Icons (Right)">
        {variants.map((variant) => (
          <Button key={variant + '-icon-right'} variant={variant} icon={<IconInbox />} iconPosition="right">
            {_startCase(variant)}
          </Button>
        ))}
      </Section>
    </>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="font-semibold mt-6">
      <h3 className="mb-2">{title}</h3>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}
