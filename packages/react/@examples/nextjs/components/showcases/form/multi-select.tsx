'use client';

import * as React from 'react';

import { ExamplePage, ExampleSection, ExampleStack } from '@/components/showcase-shell';
import { FormMultiSelect } from '@egose/shadcn-theme/components/form/multi-select';

import { multiSelectOptions } from '../fixtures';

export default function MultiSelectFormShowcase() {
  const [teams, setTeams] = React.useState(['ops', 'product']);

  return (
    <ExamplePage
      title="Multi Select"
      description="Use the standalone form wrapper when you want labels and layout around a controlled multi select field."
    >
      <ExampleSection title="Controlled teams">
        <ExampleStack>
          <FormMultiSelect name="teams" label="Teams" data={multiSelectOptions} value={teams} onChange={setTeams} />
          <p className="text-sm text-muted-foreground">Selected: {teams.join(', ')}</p>
        </ExampleStack>
      </ExampleSection>
    </ExamplePage>
  );
}
