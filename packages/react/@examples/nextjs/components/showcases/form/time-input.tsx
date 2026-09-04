'use client';

import * as React from 'react';

import { ExamplePage, ExampleSection, ExampleStack } from '@/components/showcase-shell';
import { FormTimeInput } from '@egose/shadcn-theme/components/form/time-input';

export default function TimeInputFormShowcase() {
  const [value, setValue] = React.useState(2.25);

  return (
    <ExamplePage
      title="Time Input"
      description="Time input normalizes flexible duration entry into numeric hour values."
    >
      <ExampleSection title="Controlled duration">
        <ExampleStack>
          <FormTimeInput name="time" label="Time spent" value={value} onChange={setValue} />
          <p className="text-sm text-muted-foreground">Stored value: {value} hours</p>
        </ExampleStack>
      </ExampleSection>
    </ExamplePage>
  );
}
