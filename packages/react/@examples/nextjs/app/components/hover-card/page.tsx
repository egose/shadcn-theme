'use client';

import { Button } from '../../../../../components/ui/button';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '../../../../../components/ui/hover-card';
import { ExampleInline, ExamplePage, ExampleSection } from '@/components/showcase-shell';

export default function Page() {
  return (
    <ExamplePage
      title="Hover Card"
      description="Hover cards reveal supplemental content without consuming permanent layout space."
    >
      <ExampleSection
        title="Inline author preview"
        description="Hover the link to surface profile context and timestamps."
      >
        <ExampleInline>
          <HoverCard openDelay={10} closeDelay={100}>
            <HoverCardTrigger asChild>
              <Button variant="link">Hover Here</Button>
            </HoverCardTrigger>
            <HoverCardContent className="flex w-64 flex-col gap-0.5">
              <div className="font-semibold">@nextjs</div>
              <div>The React Framework - created and maintained by @vercel.</div>
              <div className="mt-1 text-xs text-muted-foreground">Joined December 2021</div>
            </HoverCardContent>
          </HoverCard>
        </ExampleInline>
      </ExampleSection>
    </ExamplePage>
  );
}
