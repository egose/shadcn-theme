'use client';

import * as React from 'react';

import { ExampleGrid, ExamplePage, ExampleSection, ExampleStack } from '@/components/showcase-shell';
import { FormTextInput } from '@egose/shadcn-theme/components/form/text-input';
import { FormTimeInput } from '@egose/shadcn-theme/components/form/time-input';

export default function TextInputFormShowcase() {
  const [duration, setDuration] = React.useState(1.5);

  return (
    <ExamplePage
      title="Text Input"
      description="Use the standalone form field wrappers for simple labeled inputs outside form context."
    >
      <ExampleGrid>
        <ExampleSection title="Basic fields">
          <ExampleStack>
            <FormTextInput name="firstName" label="First name" placeholder="Ava" />
            <FormTextInput name="email" label="Email" type="email" placeholder="team@example.com" />
          </ExampleStack>
        </ExampleSection>
        <ExampleSection title="Related time field">
          <ExampleStack>
            <FormTimeInput name="duration" label="Estimated duration" value={duration} onChange={setDuration} />
            <p className="text-sm text-muted-foreground">Normalized hours: {duration}</p>
          </ExampleStack>
        </ExampleSection>
      </ExampleGrid>
    </ExamplePage>
  );
}
