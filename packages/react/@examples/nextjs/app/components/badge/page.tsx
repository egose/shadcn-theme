'use client';

import _startCase from 'lodash-es/startCase';
import { Badge } from '../../../../../components/ui/badge';

// All possible values from your badgeVariants definition
const variants = [
  'primary',
  'secondary',
  'success',
  'warning',
  'danger',
  'info',
  'light',
  'dark',
  'accent',
  'destructive',
  'muted',
  'link',
  'ghost',
] as const;

const sizes = ['sm', 'default', 'lg'] as const;
const appearances = ['solid', 'outline', 'outline-filled'] as const;

export default function Page() {
  return (
    <>
      <h1 className="font-bold text-2xl mt-4 mb-5">Badge Showcase</h1>

      {/* Variants x Appearance */}
      {appearances.map((appearance) => (
        <Section key={appearance} title={`Appearance: ${_startCase(appearance)}`}>
          {variants.map((variant) => (
            <Badge key={variant} variant={variant} appearance={appearance}>
              {_startCase(variant)}
            </Badge>
          ))}
        </Section>
      ))}

      {/* Sizes */}
      <Section title="Sizes">
        {sizes.map((size) => (
          <Badge key={size} size={size}>
            {_startCase(size)}
          </Badge>
        ))}
      </Section>

      {/* Variants x Sizes */}
      {sizes.map((size) => (
        <Section key={size} title={`Size: ${_startCase(size)}`}>
          {variants.map((variant) => (
            <Badge key={variant} variant={variant} size={size}>
              {_startCase(variant)}
            </Badge>
          ))}
        </Section>
      ))}
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
