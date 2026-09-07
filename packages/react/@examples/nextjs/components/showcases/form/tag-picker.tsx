'use client';

import * as React from 'react';

import { ExamplePage, ExampleSection, ExampleStack } from '@/components/showcase-shell';
import { FormTagPicker } from '@egose/shadcn-theme/components/form/tag-picker';

import { tagSuggestions } from '../fixtures';

export default function TagPickerFormShowcase() {
  const [tags, setTags] = React.useState(['Bug', 'Research']);

  return (
    <ExamplePage
      title="Tag Picker"
      description="Standalone tag picker fields cover freeform tagging flows without requiring a full form context."
    >
      <ExampleSection title="Controlled tags">
        <ExampleStack>
          <FormTagPicker name="tags" label="Tags" value={tags} onChange={setTags} suggestions={tagSuggestions} />
          <p className="text-sm text-muted-foreground">Selected: {tags.join(', ')}</p>
        </ExampleStack>
      </ExampleSection>
    </ExamplePage>
  );
}
