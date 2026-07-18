'use client';

import * as React from 'react';
import { toast } from 'sonner';
import { MoreHorizontalIcon, PencilIcon, SquarePenIcon, Trash2Icon } from 'lucide-react';
import { Button } from '../../../../../components/ui/button';
import { ActionMenu } from '../../../../../components/widgets/action-menu';
import { ExampleInline, ExamplePage, ExampleSection } from '@/components/showcase-shell';

export default function Page() {
  return (
    <ExamplePage
      title="Action Menu"
      description="ActionMenu wraps DropdownMenu with a simple list-driven API for row and card overflows."
    >
      <ExampleSection
        title="Default trigger"
        description="Omit the trigger to render the standard kebab icon button anchored to the end."
      >
        <ExampleInline>
          <ActionMenu
            items={[
              { label: 'Rename', onSelect: () => toast.success('Rename triggered') },
              { label: 'Duplicate', onSelect: () => toast.success('Duplicated') },
              { label: 'Delete', variant: 'destructive', onSelect: () => toast.error('Deleted') },
            ]}
          />
        </ExampleInline>
      </ExampleSection>
      <ExampleSection
        title="Custom trigger"
        description="Pass any element as the trigger; ActionMenu still handles focus and open state."
      >
        <ExampleInline>
          <ActionMenu
            align="start"
            items={[
              { label: 'Edit', onSelect: () => toast.info('Edit') },
              { label: 'Archive', disabled: true },
              { label: 'Remove', variant: 'destructive', onSelect: () => toast.error('Removed') },
            ]}
            trigger={
              <Button variant="secondary" appearance="outline">
                <MoreHorizontalIcon /> More
              </Button>
            }
          />
          <ActionMenu
            items={[
              { label: 'Edit', onSelect: () => toast.info('Edit selected') },
              { label: 'Draft', onSelect: () => toast.info('Draft') },
            ]}
            trigger={
              <Button variant="ghost" appearance="outline" size="icon-sm" aria-label="Inline actions">
                <SquarePenIcon />
              </Button>
            }
          />
        </ExampleInline>
      </ExampleSection>
      <ExampleSection
        title="Row overflow"
        description="Place ActionMenu inside list rows or table cells to keep secondary actions out of view."
      >
        <div className="divide-y rounded-lg border">
          {[
            { id: 'Row A', icon: PencilIcon },
            { id: 'Row B', icon: PencilIcon },
            { id: 'Row C', icon: PencilIcon },
          ].map((row) => (
            <div key={row.id} className="flex items-center justify-between px-4 py-3 text-sm">
              <span className="font-medium">{row.id}</span>
              <ActionMenu
                items={[
                  { label: 'Edit', onSelect: () => toast.info(`Edit ${row.id}`) },
                  {
                    label: 'Delete',
                    variant: 'destructive',
                    onSelect: () => toast.error(`Deleted ${row.id}`),
                  },
                ]}
                trigger={
                  <Button variant="ghost" appearance="outline" size="icon-sm" aria-label={`Actions for ${row.id}`}>
                    <MoreHorizontalIcon />
                  </Button>
                }
              />
            </div>
          ))}
        </div>
      </ExampleSection>
    </ExamplePage>
  );
}
