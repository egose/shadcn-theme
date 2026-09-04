import { FolderOpen } from 'lucide-react';

import { ExampleGrid, ExamplePage, ExampleSection } from '@/components/showcase-shell';
import { Button } from '@egose/shadcn-theme/components/ui/button';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@egose/shadcn-theme/components/ui/empty';

export default function EmptyShowcase() {
  return (
    <ExamplePage
      title="Empty"
      description="Empty states help explain why content is missing and what the user can do next."
    >
      <ExampleGrid>
        <ExampleSection title="No documents yet">
          <Empty className="border">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <FolderOpen className="size-4" />
              </EmptyMedia>
              <EmptyTitle>Create your first brief</EmptyTitle>
              <EmptyDescription>
                Draft a project brief to align scope, ownership, and delivery milestones.
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Button>New brief</Button>
            </EmptyContent>
          </Empty>
        </ExampleSection>
        <ExampleSection title="No search results">
          <Empty className="border">
            <EmptyHeader>
              <EmptyTitle>No matches for “Q4 launch”</EmptyTitle>
              <EmptyDescription>Try broadening your filters or searching by owner, status, or tag.</EmptyDescription>
            </EmptyHeader>
          </Empty>
        </ExampleSection>
      </ExampleGrid>
    </ExamplePage>
  );
}
