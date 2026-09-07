'use client';

import * as React from 'react';
import { Sparkles, Star } from 'lucide-react';

import { ExampleInline, ExamplePage, ExampleSection } from '@/components/showcase-shell';
import { Toggle } from '@egose/shadcn-theme/components/ui/toggle';

export default function ToggleShowcase() {
  const [active, setActive] = React.useState(false);

  return (
    <ExamplePage title="Toggle" description="Use single toggles for on/off formatting or persistent pressed states.">
      <ExampleSection title="Pressed states">
        <ExampleInline>
          <Toggle pressed={active} onPressedChange={setActive}>
            <Star className="size-4" />
            Favorite
          </Toggle>
          <Toggle variant="outline" size="lg" defaultPressed>
            <Sparkles className="size-4" />
            Highlight
          </Toggle>
        </ExampleInline>
      </ExampleSection>
    </ExamplePage>
  );
}
