'use client';

import * as React from 'react';
import { DownloadIcon, RotateCcwIcon, StarIcon } from 'lucide-react';
import { Button } from '../../../../../components/ui/button';
import { PageHeader } from '../../../../../components/widgets/page-header';
import { ExamplePage, ExampleSection } from '@/components/showcase-shell';

export default function Page() {
  return (
    <ExamplePage
      title="Page Header"
      description="PageHeader captures title, description, and trailing actions in a consistent responsive layout."
    >
      <ExampleSection
        title="Standard header"
        description="Use the default layout for the top of a settings page or content section."
      >
        <PageHeader
          title="Release dashboard"
          description="Track launch readiness across teams and surface blockers before they ship."
          actions={
            <>
              <Button variant="secondary" appearance="outline">
                <RotateCcwIcon /> Reset filters
              </Button>
              <Button>
                <DownloadIcon /> Export
              </Button>
            </>
          }
        />
      </ExampleSection>
      <ExampleSection
        title="Headline with rating"
        description="Custom React nodes render inline inside the description slot."
      >
        <PageHeader
          title="Studio archive"
          description={
            <span className="flex items-center gap-2">
              <StarIcon className="size-4 text-warning" />
              <span>Rated 4.8 by 218 reviewers</span>
            </span>
          }
          actions={<Button>Subscribe</Button>}
        />
      </ExampleSection>
      <ExampleSection
        title="Custom classNames"
        description="Pass per-section classNames for the root, content, title, description, or actions region."
      >
        <PageHeader
          title="Compact migration"
          description="Override padding and typography when the header is used in dense layouts."
          classNames={{
            root: 'gap-2',
            title: 'text-xl font-semibold',
            description: 'text-xs',
          }}
          actions={<Button variant="ghost">Dismiss</Button>}
        />
      </ExampleSection>
    </ExamplePage>
  );
}
