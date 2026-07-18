'use client';

import { ToggleGroup, ToggleGroupItem } from '../../../../../components/ui/toggle-group';
import { Bold, Italic, Underline } from 'lucide-react';
import { ExamplePage, ExampleSection } from '@/components/showcase-shell';

export default function Page() {
  return (
    <ExamplePage
      title="Toggle Group"
      description="A set of two-state buttons for controlling formatting or selection options."
    >
      <ExampleSection
        title="Multiple Selection"
        description="Outline-styled group with bold, italic, and underline toggles."
      >
        <ToggleGroup variant="outline" type="multiple">
          <ToggleGroupItem value="bold" aria-label="Toggle bold">
            <Bold />
          </ToggleGroupItem>
          <ToggleGroupItem value="italic" aria-label="Toggle italic">
            <Italic />
          </ToggleGroupItem>
          <ToggleGroupItem value="strikethrough" aria-label="Toggle strikethrough">
            <Underline />
          </ToggleGroupItem>
        </ToggleGroup>
      </ExampleSection>
    </ExamplePage>
  );
}
