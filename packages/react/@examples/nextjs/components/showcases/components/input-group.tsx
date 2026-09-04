// InputGroupAddon attaches an onClick focus handler without its own
// 'use client' marker, so this showcase must render on the client.
'use client';

import { Search, UserPlus } from 'lucide-react';

import { ExampleGrid, ExamplePage, ExampleSection } from '@/components/showcase-shell';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from '@egose/shadcn-theme/components/ui/input-group';

export default function InputGroupShowcase() {
  return (
    <ExamplePage
      title="Input Group"
      description="Input groups combine text fields with icons, prefixes, suffixes, and actions."
    >
      <ExampleGrid>
        <ExampleSection title="Inline addon">
          <InputGroup>
            <InputGroupAddon>
              <InputGroupText>
                <Search className="size-4" />
                Search
              </InputGroupText>
            </InputGroupAddon>
            <InputGroupInput placeholder="Filter issues" />
          </InputGroup>
        </ExampleSection>
        <ExampleSection title="Action buttons">
          <InputGroup>
            <InputGroupInput defaultValue="billing@egose.dev" />
            <InputGroupAddon align="inline-end">
              <InputGroupButton size="icon-sm" aria-label="Invite member">
                <UserPlus className="size-4" />
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
        </ExampleSection>
        <ExampleSection title="Stacked helper text">
          <InputGroup>
            <InputGroupAddon align="block-start">
              <InputGroupText>Notes</InputGroupText>
            </InputGroupAddon>
            <InputGroupTextarea rows={4} placeholder="Capture customer context before the handoff." />
            <InputGroupAddon align="block-end">
              <InputGroupText>Markdown supported</InputGroupText>
            </InputGroupAddon>
          </InputGroup>
        </ExampleSection>
      </ExampleGrid>
    </ExamplePage>
  );
}
