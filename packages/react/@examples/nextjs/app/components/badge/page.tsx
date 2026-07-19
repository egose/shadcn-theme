'use client';

import _startCase from 'lodash-es/startCase';
import { Badge } from '../../../../../components/ui/badge';
import { ExamplePage, ExampleSection } from '@/components/showcase-shell';

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
    <ExamplePage
      title="Badge"
      description="Badges label status, categories, and metadata with compact, color-coded chips."
    >
      {appearances.map((appearance) => (
        <ExampleSection key={appearance} title={`Appearance: ${_startCase(appearance)}`}>
          <div className="flex flex-wrap gap-2">
            {variants.map((variant) => (
              <Badge key={variant} variant={variant} appearance={appearance}>
                {_startCase(variant)}
              </Badge>
            ))}
          </div>
        </ExampleSection>
      ))}

      <ExampleSection title="Sizes">
        <div className="flex flex-wrap items-center gap-2">
          {sizes.map((size) => (
            <Badge key={size} size={size}>
              {_startCase(size)}
            </Badge>
          ))}
        </div>
      </ExampleSection>

      {sizes.map((size) => (
        <ExampleSection key={size} title={`Size: ${_startCase(size)}`}>
          <div className="flex flex-wrap gap-2">
            {variants.map((variant) => (
              <Badge key={variant} variant={variant} size={size}>
                {_startCase(variant)}
              </Badge>
            ))}
          </div>
        </ExampleSection>
      ))}
    </ExamplePage>
  );
}
