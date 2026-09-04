'use client';

import * as React from 'react';

import { ExamplePage, ExampleSection, ExampleStack } from '@/components/showcase-shell';
import { TagPicker } from '@egose/shadcn-theme/components/ui/tag-picker';

import { tagSuggestions } from '../fixtures';

export default function TagPickerShowcase() {
  const [tags, setTags] = React.useState(['Design System', 'Docs']);

  return (
    <ExamplePage
      title="Tag Picker"
      description="Tag picker supports reusable suggestions while still letting users create new tags inline."
    >
      <ExampleSection title="Creatable tags">
        <ExampleStack>
          <TagPicker value={tags} onChange={setTags} suggestions={tagSuggestions} placeholder="Add a tag..." />
          <p className="text-sm text-muted-foreground">Selected: {tags.join(', ')}</p>
        </ExampleStack>
      </ExampleSection>
    </ExamplePage>
  );
}
