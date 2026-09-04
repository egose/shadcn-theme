'use client';

import * as React from 'react';

import { ExamplePage, ExampleSection, ExampleStack } from '@/components/showcase-shell';
import {
  MultiSelector,
  MultiSelectorContent,
  MultiSelectorInput,
  MultiSelectorItem,
  MultiSelectorList,
  MultiSelectorTrigger,
  type MultiSelectValue,
} from '@egose/shadcn-theme/components/ui/multi-select';

import { multiSelectOptions } from '../fixtures';

export default function MultiSelectShowcase() {
  const [values, setValues] = React.useState<MultiSelectValue[]>([multiSelectOptions[0], multiSelectOptions[2]]);

  return (
    <ExamplePage
      title="Multi Select"
      description="The extension multi-select supports chip-based selection with keyboard navigation."
    >
      <ExampleSection title="Team ownership">
        <ExampleStack>
          <MultiSelector values={values} onValuesChange={setValues}>
            <MultiSelectorTrigger>
              <MultiSelectorInput placeholder="Add a team..." />
            </MultiSelectorTrigger>
            <MultiSelectorContent>
              <MultiSelectorList>
                {multiSelectOptions.map((option) => (
                  <MultiSelectorItem key={option.value} value={option.value} label={option.label}>
                    {option.label}
                  </MultiSelectorItem>
                ))}
              </MultiSelectorList>
            </MultiSelectorContent>
          </MultiSelector>
          <p className="text-sm text-muted-foreground">Selected: {values.map((value) => value.label).join(', ')}</p>
        </ExampleStack>
      </ExampleSection>
    </ExamplePage>
  );
}
