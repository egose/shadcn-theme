'use client';

import * as React from 'react';

import { ExamplePage, ExampleSection, ExampleStack } from '@/components/showcase-shell';
import { FormCheckbox } from '@egose/shadcn-theme/components/form/checkbox';

export default function CheckboxFormShowcase() {
  const [checked, setChecked] = React.useState(true);

  return (
    <ExamplePage
      title="Form Checkbox"
      description="The form checkbox wraps the checkbox primitive with label handling and simple controlled usage."
    >
      <ExampleSection title="Standalone checkbox field">
        <ExampleStack>
          <FormCheckbox
            name="updates"
            label="Email me weekly updates"
            checked={checked}
            onCheckedChange={(value) => setChecked(Boolean(value))}
          />
          <p className="text-sm text-muted-foreground">Current value: {String(checked)}</p>
        </ExampleStack>
      </ExampleSection>
    </ExamplePage>
  );
}
