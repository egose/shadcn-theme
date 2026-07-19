'use client';

import { IconInbox } from '@tabler/icons-react';
import _startCase from 'lodash-es/startCase';
import { Button } from '../../../../../components/ui/button';
import { ExamplePage, ExampleSection, ExampleInline } from '@/components/showcase-shell';

const variants = [
  'primary',
  'secondary',
  'action',
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
    <ExamplePage
      title="Button"
      description="Trigger actions and events with a full range of variants, sizes, and states."
    >
      {appearances.map((appearance) => (
        <ExampleSection key={appearance} title={`Appearance: ${_startCase(appearance)}`}>
          <ExampleInline>
            {variants.map((variant) => (
              <Button key={variant} variant={variant} appearance={appearance}>
                {_startCase(variant)}
              </Button>
            ))}
          </ExampleInline>
        </ExampleSection>
      ))}

      <ExampleSection title="Sizes">
        <ExampleInline>
          {sizes.map((size) => (
            <Button key={size} size={size}>
              {_startCase(size)}
            </Button>
          ))}
        </ExampleInline>
      </ExampleSection>

      {appearances.map((appearance) => (
        <ExampleSection key={appearance + '-loading'} title={`Appearance: ${_startCase(appearance)} - Loading`}>
          <ExampleInline>
            {variants.map((variant) => (
              <Button key={variant} variant={variant} appearance={appearance} loading>
                {_startCase(variant)}
              </Button>
            ))}
          </ExampleInline>
        </ExampleSection>
      ))}

      {appearances.map((appearance) => (
        <ExampleSection key={appearance + '-disabled'} title={`Appearance: ${_startCase(appearance)} - Disabled`}>
          <ExampleInline>
            {variants.map((variant) => (
              <Button key={variant} variant={variant} appearance={appearance} disabled>
                {_startCase(variant)}
              </Button>
            ))}
          </ExampleInline>
        </ExampleSection>
      ))}

      {appearances.map((appearance) => (
        <ExampleSection
          key={appearance + '-loading-disabled'}
          title={`Appearance: ${_startCase(appearance)} - Loading + Disabled`}
        >
          <ExampleInline>
            {variants.map((variant) => (
              <Button key={variant} variant={variant} appearance={appearance} disabled loading>
                {_startCase(variant)}
              </Button>
            ))}
          </ExampleInline>
        </ExampleSection>
      ))}

      <ExampleSection title="Icons (Left)">
        <ExampleInline>
          {variants.map((variant) => (
            <Button key={variant + '-icon-left'} variant={variant} icon={<IconInbox />} iconPosition="left">
              {_startCase(variant)}
            </Button>
          ))}
        </ExampleInline>
      </ExampleSection>

      <ExampleSection title="Icons (Right)">
        <ExampleInline>
          {variants.map((variant) => (
            <Button key={variant + '-icon-right'} variant={variant} icon={<IconInbox />} iconPosition="right">
              {_startCase(variant)}
            </Button>
          ))}
        </ExampleInline>
      </ExampleSection>
    </ExamplePage>
  );
}
